const AV = require('leanengine')
const fs = require('fs')
const path = require('path')
const axios = require('axios')
const User = AV.Object.extend('users');

/**
 * Loads all cloud functions under the `functions` directory.
 */
fs.readdirSync(path.join(__dirname, 'functions')).forEach( file => {
  require(path.join(__dirname, 'functions', file))
})

/**
 * A simple cloud function.
 */
AV.Cloud.define('aa', function(request) {
  return 'Hello world!'
})

AV.Cloud.define('onLogin', async request => {
  // 从请求中获取参数
  const { openid, userInfo } = request.params;

  // 查询用户表
  const query = new AV.Query('_User');
  query.equalTo('openid', openid);
  const users = await query.find();

  // 如果找到了用户，更新信息
  if (users.length > 0) {
    const user = users[0];
    user.set(userInfo);
    await user.save();
    return 'User updated';
  } else {
    // 否则创建新用户
    const User = AV.Object.extend('_User');
    const newUser = new User();
    newUser.set(userInfo);
    newUser.set('openid', openid);
    await newUser.save();
    return 'User created';
  }
})

AV.Cloud.define('createUser', async function (request) {
  const { id, uname } = request.params;

  const query = new AV.Query(User);
  query.equalTo('objectId', id);
  let user = await query.first();

  if (!user) {
    user = new User();
    user.set('id', id);
    user.set('uname', uname);
    await user.save();
    return 'User created';
  } else {
    return 'User already exists';
  }
});


AV.Cloud.define('loginAndGetUserInfo', async request => {
  const { code } = request.params;

  if (!code) {
    throw new Error('Missing "code" parameter');
  }

  // 从微信服务器获取用户 OpenID 和 session_key
  const appId = 'your_app_id'; // 请替换为你的微信小程序 App ID
  const appSecret = 'your_app_secret'; // 请替换为你的微信小程序 App Secret
  const wxApiUrl = `https://api.weixin.qq.com/sns/jscode2session?appid=${appId}&secret=${appSecret}&js_code=${code}&grant_type=authorization_code`;

  const { data } = await axios.get(wxApiUrl);
  const { openid, session_key } = data;

  if (!openid || !session_key) {
    throw new Error('Failed to get openid and session_key from WeChat');
  }

  // 查询是否已存在用户
  const userQuery = new AV.Query('users');
  userQuery.equalTo('openid', openid);
  let user = await userQuery.first();

  if (!user) {
    // 创建新用户
    user = new AV.users();
    user.set('openid', openid);
    user.set('username', `wx_${openid}`);
    user.set('password', session_key); // 使用 session_key 作为密码（仅示例，实际应用中请勿使用此方法）
    await user.signUp();
  } else {
    // 更新用户信息（如有需要）
    // user.set('your_field', 'your_value');
    // await user.save();
  }

  return {
    openid,
    userInfo: user.toJSON(),
  };
});

//判断书籍是否已购

AV.Cloud.define('checkBookIsBought', async (request) => {
  const { uid, bkid } = request.params;
  console.log('Query conditions: uid =', uid, 'bkid =', bkid);

  const query = new AV.Query('orders');
  
  // query.equalTo('uid', uid);
  query.equalTo('bkid', bkid);

  const result = await query.first();
  if (result) {
    return { bookIsBuy: 1 };
  } else {
    return { bookIsBuy: 0 };
  };
  console.log('result', result,);
});
;

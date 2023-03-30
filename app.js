const AV = require('./libs/av-core-min.js');
const adapters = require('./libs/leancloud-adapters-weapp.js');
// const user2 = AV.User.current();

AV.setAdapters(adapters);
AV.init({
  appId: 'xjjKM8UBTTzw7y3HOpcAaCuX-gzGzoHsz',
  appKey: 'SDSbgZF66O5qwscc4lODUmTn',
  // 请将 xxx.example.com 替换为你的应用绑定的自定义 API 域名
  serverURLs: "https://xjjkm8ub.lc-cn-n1-shared.com",
});
console.log(AV)
App({
  globalData: {
    userInfo: null,
    clouduserInfo: null,
    logincode:null,
    // LoginFlag:false,
    AV: AV,
    user:{},
  },
  
  onLaunch() {
    let that = this;
    that.checkLoginStatus();
    wx.login({
      success: (res) => {
        console.log('执行wx.login成功,返回code:');
        console.log(res.code);
        this.globalData.logincode = res.code;
      },
      fail: function(err) {
        console.error('登录失败', err);
      }
    });
    
  }, 
  
  // 检查本地 storage 中是否有登录态标识
  checkLoginStatus: function () {
    let that = this;
    let loginFlag = wx.getStorageSync('loginFlag');
    console.log('loginFlag'+loginFlag);
    if (loginFlag) {
        // 检查 session_key 是否过期
        wx.checkSession({
            // session_key 有效(为过期)
            success: function () {
                // 直接从Storage中获取用户信息
                let userStorageInfo = wx.getStorageSync('userInfo');
                if (userStorageInfo) {
                    // that.globalData.userInfo = JSON.parse(userStorageInfo);
                    //从leancloud获取当前用户信息
                  // 调用小程序 API，得到用户信息
                  let clouduserStorageInfo = wx.getStorageSync('clouduserInfo');
                  that.globalData.userInfo = userStorageInfo;
                  that.globalData.clouduserInfo = clouduserStorageInfo;
                  console.log('当前缓存中的用户信息:');
                  console.log(userStorageInfo);
                  
                } else {
                    that.showInfo('缓存信息缺失');
                    console.error('登录成功后将用户信息存在Storage的userStorageInfo字段中，该字段丢失');
                }

            },
            // session_key 过期
            fail: function () {
                // session_key过期
                // that.doLogin();
                //待添加提示框信息
            }
        });
    } else {
        // 无登录态
        // that.doLogin();
        //待添加提示框信息
    }
  },

  // 登录动作
  getUserProfile: function (page, callback) {
    console.log('正在执行app.js中的getUserProfile用户授权弹窗');
    
    wx.getUserProfile({
      // console.log('正在执行登录授权标准api:getUserProfile');
      desc: '用于完善会员资料',
      success: (res) => {
        if (callback) {
          callback(page, res);
        }
        // console.log(res.userInfo.avatarUrl);
        // wx.setStorageSync('userInfo', res.userInfo);
        wx.setStorageSync('userInfo', res.userInfo);
        wx.setStorageSync('loginFlag', true);
        // 在这里添加登录逻辑
        let user = this.globalData.user;
        AV.User.loginWithMiniApp().then(user => {
          this.globalData.user = user;
          wx.setStorageSync('clouduserInfo', user);
          // user.set('price',100);
        }).catch(console.error);
        console.log('调用与函数登录成功');
        // // 尝试更新积分(成功)
        // let currentUser = AV.User.current();
        // if (currentUser) {
        //   // 更新自定义字段 price 的值
        //   currentUser.set('price', 100);
        
        //   // 保存用户对象
        //   currentUser.save().then(savedUser => {
        //     console.log('自定义字段 price 已更新');
        //   }).catch(error => {
        //     console.error('更新自定义字段 price 时出错：', error);
        //   });
        // } else {
        //   console.error('用户未登录');
        // }
      }
      ,
      fail: err => {
        console.error('登录授权失败:', err);
      }
    });
    
    console.log('执行完毕app.js中的getUserProfile用户授权弹窗');

  },
  // 封装 wx.showToast 方法
  showInfo: function (info = 'error', icon = 'none') {
    wx.showToast({
        title: info,
        icon: icon,
        duration: 1500,
        mask: true
    });
  },
  // 获取用户登录标示 供全局调用
  getLoginFlag: function () {
    return wx.getStorageSync('loginFlag');
  },
})


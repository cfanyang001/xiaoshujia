// pages/my/my.js
const app = getApp();
const AV = app.globalData.AV;

Page({
  data: {
    userInfo: {},
    clouduserInfo: {},
    hasLogin: wx.getStorageSync('loginFlag') ? true : false
    // hasLogin: false,
  },

  // 检查本地 storage 中是否有登录态标识
  checkLoginStatus: function() {
    let that = this;
    let loginFlag = wx.getStorageSync('loginFlag');
    if (loginFlag) {
      this.setData({hasLogin : true});
        // 检查 session_key 是否过期
        wx.checkSession({

            // session_key 有效(为过期)
            success: function() {
                // 获取用户头像/昵称等信息
                that.getUserInfo();
            },

            // session_key 过期
            fail: function() {
                that.setData({
                    hasLogin: false
                });
            }
        });

    } else {
        that.setData({
            hasLogin: false
        });
    }
  },

  // doLogin: function() {
  //   let that = this;
  //   // wx.showLoading({
  //   //     title: '登录中...',
  //   //     mask: true
  //   // });
  //   console.log('在my页面点击登录');
  //   app.doLogin();
  //   // app.doLogin(that.getUserInfo);
  //   console.log('在my页面点击登录结束');
  // },
  
  goMyBooks: function() {
    wx.navigateTo({
        url: '../mybooks/mybooks'
    });
  },

  //从全局变量存获取用户信息
  getUserInfo: function() {
    // 从 globalData 中获取 userInfo
    let that = this;

    let userInfo = app.globalData.userInfo;
    let clouduserInfo = app.globalData.clouduserInfo;
    console.log('从 globalData 中获取 userInfo');
    console.info(userInfo);
    if (userInfo) {
        that.setData({
            hasLogin: true,
            userInfo: userInfo,
            clouduserInfo: clouduserInfo,
        });
        wx.hideLoading();
    } else {
        console.log('globalData中userInfo为空');
    }
  },
  getUserProfile(e) {
    // 使用全局方法
    app.getUserProfile(this, (page, res) => {
      page.setData({
        userInfo: res.userInfo,
        hasLogin: true
      });
    });
  },
  onLoad: function() {
    this.checkLoginStatus();
    if (this.hasLogin){
      this.setData({
        hasLogin: true,
        userInfo : app.globalData.userInfo,
        clouduserInfo : app.globalData.clouduserInfo,
        
      });
      
    };
    
  },

  onShow: function() {
    let that = this;
    that.setData({
        userInfo: app.globalData.userInfo
    });
  },
})
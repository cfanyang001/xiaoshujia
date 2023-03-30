const api = require('../../config/config.js');
const { fetchBooks } = require('../../utils/leancloud.js');
const app = getApp();
const AV = app.globalData.AV;
// pages/books/books.js
// 将 getBooks 函数移到这里
// 将 getBooks 函数移到这里
function getBooks() {

}
Page({

  /**
   * 页面的初始数据
   */
  data: {
    books: [
    ],
    userInfo: {},
    hasUserInfo: false,
    canIUseGetUserProfile: false,
    // test_img:'https://d1.faiusr.com/4/AAEIABAEGAAgsfvy-QUo5Kb64gcwqAU4pA0.png',
  },
  

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    // this.fetchBooks();
    // getBooks()
    //   .then((books) => {
    //     this.setData({
    //       books: books.books,
    //     });
    //     console.log('success')
    //     console.log(books)

    //   })
    //   .catch((err) => {
    //     console.error('Failed to get books:', err);
    //   });
    // console.log{{books}};
    
    this.setData({
      hasUserInfo: true,
      userInfo : app.globalData.userInfo
    });
    fetchBooks().then(books => {
      this.setData({ books });
      // console.log(books);
    }).catch(error => {
      console.error('获取书籍失败', error);
    });
    if (wx.getUserProfile) {
      this.setData({
        canIUseGetUserProfile: true
      })
    }
    // console.log{{books}};
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  },

      /**
     * 打开书籍详情页面
     */
  goDetail: function(ev) {

    let info = ev.currentTarget.dataset;
    let navigateUrl = '../detail/detail?';

    for (let key in info) {
        info[key] = encodeURIComponent(info[key]);
        navigateUrl += key + '=' + info[key] + '&';
    }

    navigateUrl = navigateUrl.substring(0, navigateUrl.length - 1);
    console.log(navigateUrl);
    wx.navigateTo({
        url: navigateUrl
    });
  },
  onShareAppMessage: function(res) {
    if (res.from === 'button') {
        // 来自页面内转发按钮
        console.log(res.target)
    }
    return {
        title: '小书架首页',
        path: '/pages/books/books',
        imageUrl: '/images/bookstore.png',
        success: function (res) {
            // 转发成功
        },
        fail: function (res) {
            // 转发失败
        }
    }
  },
  getUserProfile(e) {
    // 使用全局方法
    app.getUserProfile(this, (page, res) => {
      page.setData({
        userInfo: res.userInfo,
        hasUserInfo: true
      });
    });
  },
})
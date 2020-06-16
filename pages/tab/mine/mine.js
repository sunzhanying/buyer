const service = require("../../../service/service.js");
const common = require("../../../assets/js/common.js");
const config = require('../../../utils/config.js');
const app = getApp()
Page({
  data: {
    navList: [{
        title: '提交投诉',
        math: '1',
        index: 2
      },
      {
        title: '待付款',
        math: '1',
        index: 3

      },
      {
        title: '已付款',
        math: '1',
        index: 4
      },
      {
        title: '纠纷中',
        math: '1',
        index: 5
      }
    ],
    userInfo: [], //个人信息
    wxtx: '', //头像
    wxnc: '', //昵称
    isVip: false, //
    isPhone: false, //手机号是否存在
    isBuyer: Boolean
  },
  jumpDetail: function(e) {
    wx.navigateTo({
      url: `/pages/mine/orderRecord/orderRecord?index=${e.currentTarget.dataset.index}`,
    })
  },
  // 查看全部订单
  allOrderBtn: function () {
    wx.navigateTo({
      url: '/pages/mine/orderRecord/orderRecord?name='
    })
  },
  // 获取微信信息
  onGotUserInfo: function(e) {
    console.log('提交获取微信信息')
    var that = this;
    var avatarUrl = '';
    if (e.detail.errMsg == "getUserInfo:ok") {
      avatarUrl = e.detail.userInfo.avatarUrl;
      const token = wx.getStorageSync('token') || '';

      var formData = {
        "nickname": e.detail.userInfo.nickName, // 昵称
        "avatar": e.detail.userInfo.avatarUrl, //头像
      }
      service.saveUserInfo(formData).then(res => {
        if (res.data.code == 200) {
          that.setData({
            wxtx: e.detail.userInfo.avatarUrl,
            wxnc: e.detail.userInfo.nickName
          })
          wx.navigateTo({
            url: '/pages/mine/accountDetail/accountDetail'
          })
        } else {
          wx.showToast({
            title: res.data.message,
            icon: 'none',
            duration: 2000
          })
        }
      })
    }
  },

  // 获取个人信息
  getUserInfo: function() {
    var that = this;
    service.getUserInfo().then(res => {
      console.log(res, '获取个人信息')
      if (res.data.code == 200) {
        that.setData({
          userInfo: res.data.data,
          wxtx: res.data.data.wxtx,
          wxnc: res.data.data.wxnc,
          isPhone: res.data.data.sj ? true : false
        })
      } else {
        common.showToast(res.data.message)
      }
    })

  },
  getCenterInfo: function () {
    service.centerInfo().then(res => {    
      console.log(res)
      var list = this.data.navList
      list[0].math = res.data.data.tjts
      list[1].math = res.data.data.dfk
      list[2].math = res.data.data.yfk
      list[3].math = res.data.data.jfz
      this.setData({
        navList:list
      })
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    this.getUserInfo()
    this.getCenterInfo()
    app.globalData.isRefresh = true
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },
})
// pages/mine/accountDetail/accountDetail.js
import service from '../../../service/service.js'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    nikeName:'',
    name:'',
    tel:''
  },
  getUserInfo: function () {
    var that = this;
    service.getUserInfo().then(res => {
      console.log(res, '获取个人信息')
      if (res.data.code == 200) {
        that.setData({
          nikeName: res.data.data.wxnc,
          name: res.data.data.xm ? res.data.data.xm :'',
          tel: res.data.data.sj ?res.data.data.sj :''
        })
      } else {
        common.showToast(res.data.message)
      }
    })

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getUserInfo()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})
// pages/mine/confirmOrder/confirmOrder.js
import service from '../../../service/service.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    articleDetail: [],
    num: '',
    allPrice: '',
    id: ''
  },
  // 获取商品详情
  getDetails(id) {
    let fromData = {
      id
    }
    service.getSpDetail(fromData).then(res => {
      this.setData({
        articleDetail: res.data.data,
        allPrice: this.data.num * res.data.data.qyjg.csj
      })
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.getDetails(options.id)

    this.setData({
      num: options.num,
      id: options.id
    })
  },
  // 支付接口
  payOrder(id = '') {
    let fromData = {
      orderId: id, // 订单id
      sl: this.data.num, //数量
      spId: this.data.id // 商品id
    }
    service.orderPay(fromData).then(res => {
      console.log(res)
      if (res.data.code == 200) {
        let result = JSON.parse(res.data.data[0])
        wx.requestPayment({
          timeStamp: result.timeStamp,
          nonceStr: result.nonceStr,
          package: result.package,
          signType: 'MD5',
          paySign: result.paySign,
          'success': function(success) {
            wx.showToast({
              title: '支付成功',
              icon: 'success',
              duration: 2000
            })
            wx.redirectTo({
                url: `/pages/mine/orderDetail/orderDetail?orderid=${res.data.data[1]}`,
              })
          },
          'fail': function() {
            wx.redirectTo({
              url: `/pages/mine/orderDetail/orderDetail?orderid=${res.data.data[1]}`,
            })
          }
        })
      } else {
        wx.showToast({
          title: res.data.message,
          icon: 'none'
        })
      }
    })
  },
  // 点击结算
  pay: function() {
    this.payOrder()
  },

  // },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

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

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})
const service = require("../../../service/service.js");
const common = require("../../../assets/js/common.js");
const config = require('../../../utils/config.js');
Page({
  data: {
    orderId: '',
    num:'',
    id:'', //商品id
    orderList: []
  },
   //图片预览
   previewImageBtn: function(e) {
    var that = this;
    var current = e.target.dataset.url;
    var list = [];
    list.push(current)
    wx.previewImage({
      current: current, // 当前显示图片的http链接
      urls: list // 需要预览的图片http链接列表
    })
  },
  // 确认收货
  // 回到首页
  delAdd: function() {
    wx.switchTab({
      url: '/pages/tab/home/home'
    })
  },
  // 确认支付
   payOrder() {
    let fromData = {
      orderId: this.data.orderid, // 订单id
      sl: this.data.num, //数量
      spId: this.data.id // 商品id
    }
    service.orderPay(fromData).then(res => {
      console.log(res)
      if(res.data.code == 200){
        let result = JSON.parse(res.data.data[0])
        wx.requestPayment({
          timeStamp: result.timeStamp,
          nonceStr: result.nonceStr,
          package: result.package,
          signType: 'MD5',
          paySign: result.paySign,
          'success': function (success) {
            wx.showToast({
              title: '支付成功',
              icon: 'success',
              duration: 2000
            })
        
            wx.redirectTo({
                url: `/pages/mine/orderDetail/orderDetail?orderid=${res.data.data[1]}`,
              })
          },
          'fail': function (res) {
            wx.showToast({
              title: res.data.data.message || '支付失败',
              icon: 'none',
              duration: 2000
            })
          }
        })
      }else{
        wx.showToast({
          title: res.data.message,
          icon:'none'
        })
      }
    })
  },
  //  点击结算
  pay: function() {
    this.payOrder()
  },
  // 获取订单详情
  getOrderDetail: function (orderid) {
    var that = this;
    var formData = {
      orderid: orderid //订单id
    }
    service.orderDetail(formData).then(res => {
      console.log(res, '获取订单详情')
      res.data.data.spXx.img = config.NODOMAIN + res.data.data.spXx.img
      res.data.data.qyhsMxList.forEach(item=>{
        item.img = config.DOMAIN + item.img
      })
      this.setData({
        orderList: res.data.data,
        num:res.data.data.sl,
        id:res.data.data.spXx.id
      })

    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.getOrderDetail(options.orderid)
    this.setData({
      orderid:options.orderid
    })

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
    if (this.data.isPay) {
      // wx.navigateBack({
      //     delta: 2
      // })
      wx.switchTab({
        url: '/pages/tab/mine/mine'
      })
    }

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
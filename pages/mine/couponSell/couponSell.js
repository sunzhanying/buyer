// pages/mine/couponSell/couponSell.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    index: 1,
    commodityName: '', //商品名称
    price: '', // 价格
    source: '', //来源
    ruleTime:'',
    psdNum1: [{
      id: 0,
      time: ''
    }], //卡密
    psdNum2: [{
      id: 0,
      time: ''
    }] // 卡号+卡密

  },
  // 修改时间
  bindDateChange(e) {
    if (this.data.index == 1) {
      var dataList = this.data.psdNum1
      dataList.forEach(item => {
        if (item.id === e.currentTarget.dataset.id) {
          item.time = e.detail.value
        }
      })
      this.setData({
        psdNum1: dataList
      })
    } else if (this.data.index == 2) {
      var dataList = this.data.psdNum2
      dataList.forEach(item => {
        if (item.id === e.currentTarget.dataset.id) {
          item.time = e.detail.value
        }
      })
      this.setData({
        psdNum2: dataList
      })
    }

  },
  // 卡密的删除
  delete1: function(e) {
    let list = this.data.psdNum1.filter(item => {
      if (item.id !== e.currentTarget.dataset.id) {
        return item.id !== e.currentTarget.dataset.id
      }
    })
    this.setData({
      psdNum1: list
    })
  },
  // 卡号+卡密的删除
  delete2: function(e) {
    let list = this.data.psdNum2.filter(item => {
      if (item.id !== e.currentTarget.dataset.id) {
        return item.id !== e.currentTarget.dataset.id
      }
    })
    this.setData({
      psdNum2: list
    })
  },
  // 卡密的添加
  addCoupon1: function() {
    let obj = {
      id: this.data.psdNum1[this.data.psdNum1.length - 1].id + 1,
      time: ''
    }
    var arr = this.data.psdNum1
    arr.push(obj)
    this.setData({
      psdNum1: arr
    })
  },
  // 卡号+卡密的添加
  addCoupon2: function() {
    console.log(this.data.psdNum2[this.data.psdNum2.length - 1].id + 1)
    let obj = {
      id: this.data.psdNum2[this.data.psdNum2.length - 1].id + 1,
      time: ''
    }
    var arr = this.data.psdNum2
    arr.push(obj)
    this.setData({
      psdNum2: arr
    })
  },
  // 切换卡密 / 卡号+卡密
  toggleClick: function(e) {
    this.setData({
      index: e.target.dataset.index
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

      var date = new Date()
      var y = date.getFullYear();
      var m = date.getMonth() + 1;
      m = m < 10 ? '0' + m : m;
      var d = date.getDate();
      d = d < 10 ? ('0' + d) : d;
      this.setData({
        ruleTime: y + '-' + m + '-' + d
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
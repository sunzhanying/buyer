const servers = require("../../../service/service.js")
const common = require("../../../assets/js/common.js");
const config = require('../../../utils/config.js');
Page({

  data: {
    consumerTab: [ {
      tit: '提交投诉',
      type: 2
    }, {
      tit: '待付款',
      type: 3
    }, {
      tit: '已付款',
      type: 4
    }, {
      tit: '纠纷中',
      type: 5
    }],
    types: 4,
    yhqList: [], //订单记录
    // 数据是否为空
    isNull: false,
    pagesAll: 1, //总页数
    pageNum: 1, //第几页
    pageSize: 6, //每页多少条数据
  },
  orderBtn: function(e) {
    //zt   待付 1 待发货 3 已发货4 已完成 5
    wx.navigateTo({
      url: '/pages/mine/orderDetail/orderDetail?id=' + e.currentTarget.dataset.id + '&zt=' + e.currentTarget.dataset.zt
    })
  },
  orderDetail(e){
    wx.navigateTo({
      url: `/pages/mine/orderDetail/orderDetail?orderid=${e.currentTarget.dataset.id}`,
    })
  },
  // tab切换
  tabClick(e) {
    let _type = e.currentTarget.dataset.type;
    this.setData({
      pageNum:1,
      types: _type,
      yhqList: []
    })
    this.getDetail()
    // 请求接口
  },
  getDetail(){
    let fromData = {
      page: this.data.pageNum,
      size: this.data.pageSize,
      type:this.data.types
    }
    servers.BuyerDetail(fromData).then(res=>{
      console.log(res)
      res.data.list.forEach(item=>{
        item.spXx.img = config.NODOMAIN + item.spXx.img
      })
      this.setData({
        yhqList: this.data.yhqList.concat(res.data.list),
        pagesAll: Math.ceil(res.data.count / this.data.pageSize)
      })
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if(options.index){
      this.setData({
        types: options.index
      })
    }
      this.getDetail()
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
   
    // this.getOrderSpAll()

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
    var that = this;
    var pagesAll = that.data.pagesAll;
    var pageNum = that.data.pageNum;
    if (pageNum < pagesAll) {
      pageNum++;
      that.setData({
        pageNum: pageNum
      })
      that.getDetail();

    }
  },
})
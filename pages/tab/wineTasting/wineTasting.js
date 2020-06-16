const service = require("../../../service/service.js");
const common = require("../../../assets/js/common.js");
const config = require('../../../utils/config.js');
const app = getApp()
Page({
  data: {
    indicatorDots: false, //是否显示圆点
    autoplay: true, //是否自动轮播
    interval: 3000,
    duration: 1000,
    bannerList: [], //banner
    
    varietiesWine: [], //商品类型列表
    typeid: '', //选中类型id
    search: '', //搜索框
    wineList: [], //商品列表
    pagesAll: 1, //总页数
    pageNum: 1, //第几页
    pageSize: 10, //每页多少条数据
    isRefresh:false,//是否重新刷新页面
  },
  // 获取banner
  getBanner: function () {
    var that = this;
    var formData = {
      type: 1,//推荐位类型，1首页头部，2首页中部，默认传1
    }
    service.getBanner(formData).then(res => {
      console.log(res, '获取banner')
      if (res.data.code == 200) {
        var data = res.data.data;
        data.map((item, index) => {
          item.img = config.NODOMAIN + item.img;
          // relateType  banner类型 2酒品1菜品
          // link_type 链接类型 1内链 2外链
          switch (item.linkType) {
            case '1':
              // switch (item.relateType) {
              //     case '2':
              item.navUrl = "/pages/wine/wineDetail/wineDetail?id=" + item.relateId;
              //         break;
              //     case '1':
              //         item.navUrl = "/pages/home/recipeDetail/recipeDetail?id=" + item.relateId;
              //         break;
              // }
              break;
            case '2':
              item.navUrl = "/pages/webView/webView?url=" + item.link;
              break;
          }

        })
        that.setData({
          bannerList: data
        })
      } else {
        common.showToast(res.data.message)
      }
    })
  },
  // 查看详情
  checkDetailsBtn: function (e) {
    console.log(e)
   wx.navigateTo({
     url: `/pages/wine/wineDetail/wineDetail?id=${e.currentTarget.dataset.id}`,
   })
  },

  // 搜索输入框
  searchPro: function (e) {
    this.setData({
      search: e.detail.value,
      wineList: []
    })
    this.getSpAll()
  },
  // 点击左侧类型
  wineLIBtn: function (e) {
    console.log('类型筛选')
    var that = this;
    var Index = e.currentTarget.dataset.index;
    var typeid = e.currentTarget.dataset.typeid;
    var choose = "this.data.varietiesWine[" + Index + "].choose"
    that.data.varietiesWine.map((item, index) => {
      item.choose = false
      if (index == Index) {
        item.choose = true
      }
    })
    that.setData({
      search: '',
      typeid: typeid,
      varietiesWine: that.data.varietiesWine,
      wineList: []
    })
    this.getSpAll()

  },
  // 获取所有商品类型
  getSpTypeAll: function () {
    var that = this;
    service.allType().then(res => {
      if (res.data.code == 200) {
        let obj = {
          name: '全部',
          id: ' '
        }
        res.data.data.unshift(obj)
        res.data.data.map((item, index) => {
          item.choose = false
          if (index == 0) {
            item.choose = true
          }
        })
        that.setData({
          typeid: res.data.data[0].id,
          varietiesWine: res.data.data
        })
        // 获取所有商品
        that.getSpAll()
      } else {
        common.showToast(res.data.message)
      }
    })

  },
  // 获取所有商品
  getSpAll: function (type) {
    var that = this;
    var formData = {
      name: that.data.search, //搜索
      page: that.data.pageNum, //当前页
      size: that.data.pageSize, //每页多少条
      typeid: that.data.typeid
    }
    that.data.isRefresh = true
    service.getSpAll(formData).then(res => {
      console.log(res)
      wx.stopPullDownRefresh();
      if (res.statusCode == 200) {
        if (res.data.count > 0) {
          // var dataList = that.data.wineList;
          res.data.list.map((item, index) => {
            item.img = item.img ? config.NODOMAIN + item.img : '';
            // dataList.push(item);
          })
          if (type) {
            that.setData({
              wineList: res.data.list,
              pagesAll: Math.ceil(res.data.count / res.data.pageSize), //总页数
              pageNum: res.data.pageNo, //第几页
            })
          } else {
            that.setData({
              wineList: that.data.wineList.concat(res.data.list),
              pagesAll: Math.ceil(res.data.count / res.data.pageSize), //总页数
              pageNum: res.data.pageNo, //第几页
            })
          }
        }
      } else {
        common.showToast(res.data.message)
      }
    })

  },
  onLoad: function (options) {
    var that = this
    if (wx.getStorageSync('token')) {
      this.getSpTypeAll()
      that.getBanner()
    } else {
      wx.login({
        success: res => {
          // 发送 res.code 到后台换取 openId, sessionKey, unionId
          let fromData = {
            code: res.code,
            source: 2
          }
          service.Login(fromData).then(res => {
            wx.setStorageSync('token', res.data.data.token)
            wx.setStorageSync('data', res.data.data)
            that.getSpTypeAll()
            that.getBanner()
          })
        }
      })
    }
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
    var that = this;
    if (typeof this.getTabBar === 'function' &&
      this.getTabBar()) {
      this.getTabBar().setData({
        selected: 0 //这个数是，tabBar从左到右的下标，从0开始
      })
    }
    if(app.globalData.isRefresh){
      app.globalData.isRefresh = false
      that.data.pagesAll = 1//总页数
      that.data.pageNum = 1 //第几页
      that.getSpAll(1)
      that.getBanner()
    }
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
    var that = this;
    that.data.pagesAll = 1//总页数
    that.data.pageNum = 1 //第几页
      that.getSpAll(1)
      that.getBanner()
  },

  // scroll-view  上拉滚动加载
  loadMore: function () {
    console.log('触底')
    var that = this;
    var pagesAll = that.data.pagesAll;
    var pageNum = that.data.pageNum;
    if (pageNum < pagesAll) {
      pageNum++;
      that.setData({
        pageNum: pageNum
      })
      that.getSpAll();

    }
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

    var that = this;
    var pagesAll = that.data.pagesAll;
    var pageNum = that.data.pageNum;
    console.log(pageNum, 'pageNum', pagesAll)
    if (pageNum < pagesAll) {
      pageNum++;
      that.setData({
        pageNum: pageNum
      })
      that.getSpAll();

    }
  },

})
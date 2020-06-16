const service = require("../../../service/service.js");
const common = require("../../../assets/js/common.js");
const config = require('../../../utils/config.js');
var WxParse = require('../../../wxParse/wxParse.js');
Page({
  data: {
    addOrder: false, //购买订单弹框
    numData: 1, //订单数量
    addOrderaddOrder: true, //
    goodsId: '', //商品id
    goodsDetail: [], //商品详情
    numShoppingData: 1, //加入购物车数量
    isPhone: false
  },
  // 获取微信信息
  onGotUserInfo: function(e, val) {
    var that = this;
    var avatarUrl = '';
    if (!wx.getStorageSync('Authorization')) {
      if (e.detail.errMsg == "getUserInfo:ok") {
        avatarUrl = e.detail.userInfo.avatarUrl;
        const token = wx.getStorageSync('token') || '';

        var formData = {
          "nickname": e.detail.userInfo.nickName, // 昵称
          "avatar": e.detail.userInfo.avatarUrl, //头像
        }
        service.saveUserInfo(formData).then(res => {
          console.log(res, '提交获取用户信息')
          if (res.data.code == 200) {
            let tel = wx.getStorageSync('saveTel')
            
            if (!tel && !that.data.isPhone) {
              wx.navigateTo({
                url: '/pages/mine/memberInformation/memberInformation',
              })
            } else {
              that.setData({
                addOrderaddOrder: false
              })
              wx.setStorageSync('Authorization', true)
            }
          } else {
            wx.showToast({
              title: res.data.message,
              icon: 'none',
              duration: 2000
            })
          }
        })
      }
    } else {
      that.setData({
        addOrderaddOrder: false
      })
    }
  },
  // 获取个人信息 判断是否跳转到手机号页面
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
  // 获取详情
  getSpDetails: function() {
    var that = this;
    var formData = {
      id: that.data.goodsId, //
    }
    service.getSpDetail(formData).then(res => {
      console.log(res, '获取商品详情')
      if (res.data.code == 200) {
        var data = res.data.data;
        res.data.data.img = res.data.data.img ? config.NODOMAIN + res.data.data.img : '';
        res.data.data.imgBig = res.data.data.imgBig ? config.NODOMAIN + res.data.data.imgBig : '';
        var bq = []
        if (res.data.data.tagList.length > 0) {
          res.data.data.tagList.map(item => {
            bq.push(item.name)
          })
        }
        data.bqList = bq
        that.setData({
          numData: data.kc > 0 ? 1 : 0,
          numShoppingData: data.kc > 0 ? 1 : 0,
          goodsDetail: res.data.data,
          shareUrl: res.data.data.imgBig
        })
        // 富文本
        if (data.description) {
          var introduce = data.description.replace(/↵/g, '\n');
          if (introduce.substr(0, 1) == '<' || introduce.substr(0, 1) == '&') {
            var introducetext = introduce;
            WxParse.wxParse('introducetext', 'html', introducetext, that, 5);
            that.setData({
              introduceShow: false
            })
          } else {
            that.setData({
              introduce: introduce,
              introduceShow: true
            })
          }
        }
      } else {
        common.showToast(res.data.message)
      }
    })
  },
  // 关闭
  wineClose: function() {
    this.setData({
      addOrderaddOrder: true
    })
  },
  // 立即购买   显示订单弹框
  payOrderBtn: function(e) {
    var that = this;
    if (e.currentTarget.dataset.name == '1') {
      that.setData({
        addOrderaddOrder: false
      })
    } else {
      that.onGotUserInfo(e, 2)
    }
  },
  // 跳转支付页面

  goDetail() {
    if (this.data.numData <= 0) {
      wx.showToast({
        title: '库存不足',
        icon: 'none',
        duration: 2000
      })
    } else if (this.data.numData <= this.data.goodsDetail.kc) {
      wx.navigateTo({
        url: `/pages/mine/confirmOrder/confirmOrder?id=${this.data.goodsId}&num=${this.data.numData}`,
      })
    } else if (this.data.numData > this.data.goodsDetail.kc) {
      wx.showToast({
        title: '购买数量超出库存',
        icon: 'none',
        duration: 2000
      })
    }
    this.setData({
      addOrderaddOrder: true
    })

  },

  // 购买订单弹框隐藏  立即购买
  onCancel: function() {
    this.setData({
      addOrderaddOrder: true
    })
  },
  //   删减数量  立即购买
  reductionNum: function() {
    var numData = this.data.numData;
    if (numData > 1) {
      numData--;
      this.setData({
        numData: numData,
        score: this.data.points * numData
      })
    }
  },
  //   添加数量  最多不能超过库存数  立即购买
  addNum: function(e) {
    var numData = this.data.numData;
    if (numData < this.data.goodsDetail.kc) {
      numData++;
      this.setData({
        numData: numData,
        score: this.data.points * numData
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.data.goodsId = options.id

    this.getUserInfo()

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
    this.getSpDetails()

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
    // if (this.data.isGoHome) {
    //     wx.switchTab({
    //         url: '/pages/tab/home/home'
    //     })
    // }
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

  // 分享
  message: function(e) {
    // var formId = e.detail.formId;
    // this.setData({
    //     formId: formId
    // })
    // // 发送formId
    // // service.formId(e.detail.formId).then(res => { })
    // this.onShareAppMessage(formId);
  },
  // 分享
  onShareAppMessage: function(res) {
    // var that = this;
    // var userId = wx.getStorageSync('userId') || '';
    // var data = (new Date()).getTime() + '';
    // var path = '/pages/login/login?userId=' + userId + '&time=' + data + '&goodsId=' + that.data.goodsId + '&typeid=1';
    // // var image = '/images/loading.png'; 
    // return {
    //     title: that.data.goodsDetail.spmc,
    //     path: path,
    //     //   imageUrl: image,
    //     success: function(res) { //点击确认转发

    //     },
    //     fail: function(res) { //点击取消转发
    //     }
    // }
  }
})
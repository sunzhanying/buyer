// pages/mine/memberInformation/memberInformation.js
const service = require("../../../service/service.js");
const common = require("../../../assets/js/common.js");
const config = require('../../../utils/config.js');
var interval = null; //倒计时函数
Page({

  /**
   * 页面的初始数据
   */
  data: {
    username: '', //姓名
    phone: '', //手机号 
    code: "", //
    time: '获取验证码', //倒计时 
    currentTime: 60,
    disabled: false
  },
  //输入姓名
  checkName: function(e) {
    this.setData({
      username: e.detail.value
    })
  },
  // 输入验证码
  addSmsCode(e) {
    this.setData({
      code: e.detail.value
    })
  },
  // 输入手机号
  checkPhoneNumber: function(e) {
    var that = this;
    that.data.phone = e.detail.value;
  },
  // 发送验证码
  phoneTest: function() {
    var that = this;
    if (!that.data.disabled) {
      if (!that.data.phone) {
        wx.showToast({
          title: '手机号不能为空',
          icon: 'none',
          duration: 2000
        })
        return false;
      }
      if (!(/^1[3456789]\d{9}$/.test(that.data.phone))) {
        wx.showToast({
          title: '请输入正确的手机号',
          icon: 'none',
          duration: 2000
        })
        return false;
      }
      that.sendCode()
    }
  },
  // 发送验证码
  sendCode() {
    var that = this
    var formData = {
      phone: that.data.phone
    }
    service.sendSmsCode(formData).then(res => {
      console.log(res, '发送验证码')
      if (res.data.code == 200) {
        common.showToast('发送验证码成功')
        var currentTime = that.data.currentTime
        that.setData({
          time: currentTime + '秒后重新发送',
          disabled: true
        })
        var time = setInterval(() => {
          let currentTime = that.data.currentTime--

            that.setData({
              time: currentTime + '秒后重新发送',
              disabled: true
            })
          if (currentTime <= 0) {
            clearInterval(time)
            that.setData({
              time: '重新发送',
              currentTime: 60,
              disabled: false
            })
          }
        }, 1000)

      } else {
        common.showToast(res.data.data)
      }
    })
  },
  // 注册提交
  memberInformationSave: function(e) {
    var that = this;
    if (!that.data.username) {
      wx.showToast({
        title: '姓名不能为空',
        icon: 'none',
        duration: 2000
      })
      return false;
    }
    //手机号不存在时 须填写手机及验证码
    if (!that.data.phone) {
      wx.showToast({
        title: '手机号不能为空',
        icon: 'none',
        duration: 2000
      })
      return false;
    }
    var myreg = /^1[3456789]\d{9}$/;
    if (!myreg.test(that.data.phone)) {
      wx.showToast({
        title: '手机号格式不正确',
        icon: 'none',
        duration: 2000
      })
      clearInterval(interval)
      return false;
    }

    if (!that.data.code) {
      wx.showToast({
        title: '验证码不能为空',
        icon: 'none',
        duration: 2000
      })
      return false;
    }
    //验证码格式判断
    var reg = /^\d{6}$/;
    if (!reg.test(that.data.code)) {
      wx.showToast({
        title: '验证码格式错误，请重新输入',
        icon: 'none',
        duration: 2000
      })
      return false;
    }
    let fromData = {
      code: this.data.code,
      name: this.data.username,
      phone: this.data.phone
    }
    service.saveTelAndName(fromData).then(res => {
      console.log(res)
      if (res.data.code == 200) {
        wx.showToast({
          title: "绑定成功",
          icon: 'success',
          duration: 1500
        })
        wx.setStorageSync('saveTel', true)
        wx.navigateBack({
          delta: 1
        })
      } else {
        wx.showToast({
          title: res.data.message,
          icon: 'none',
          duration: 1500
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {},

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
  //   onShareAppMessage: function () {

  //   }
})
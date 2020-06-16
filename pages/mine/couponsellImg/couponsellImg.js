// pages/mine/couponsellImg/couponsellImg.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    cardList:[{id:0,time:'',img:''}],
    ruleTime: '',
  },
  bindDateChange(e){
    var dataList = this.data.cardList
    dataList.forEach(item => {
      if (item.id === e.currentTarget.dataset.id) {
        item.time = e.detail.value
      }
    })
    this.setData({
      cardList: dataList
    })
  },
  chooseImageBtn:function(res){
    console.log(11)
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有  
      success(res) {
        console.log(res)
        res.tempFilePaths.forEach(item => {
          // that.uploadFile(item); //图片上传每次一张  每次遍历都调用这个借口
        });

      }
    })
  },
  uploadFile:function(url){
    var that = this;
    const token = wx.getStorageSync('token') || '';

    wx.uploadFile({
      url: config.DOMAIN + '/common/auth/upload', //将图片传到服务器的请求路径
      filePath: url, //图片在手机里的存储路径
      name: 'file',
      header: {
        "Content-Type": "multipart/form-data",
        "X-Auth-Token": token
      },
      formData: {
        'user': 'test'
      },
      success(res) {
        const mata = JSON.parse(res.data)
        // 把数据存到imglist中去
        var url = config.DOMAIN + mata.fileUpload.fileUrl
        console.log(url)
        // that.data.files.push(url)
        that.setData({
          files: that.data.files
        })
        console.log(that.data.files)
        // 判断图片的长度 如果等于3 就隐藏
        if (that.data.files.length == 3) {
          that.setData({
            addimgBox: true
          })
          return false
        }
      }
    })
  },
  // 卡密-添加新卡密
  addCoupon:function(){
    let obj = {
      id: this.data.cardList[this.data.cardList.length - 1].id + 1,
      time:'',
      img:''
    }
    var arr = this.data.cardList
    arr.push(obj)
    this.setData({
      cardList: arr
    })
  },
  // 删除
  deletePsd:function(e){
    let list = this.data.cardList.filter(item => {
      if (item.id !== e.currentTarget.dataset.id) {
        return item.id !== e.currentTarget.dataset.id
      }
    })
    this.setData({
      cardList: list
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
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
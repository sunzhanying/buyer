Component({
  /**
   * 组件的属性列表
   */
  properties: {
    // 弹窗内容
    title: {
      type: String,
    }, //标题
    price: {
      type: String,
    }, //价格
    cnventory: {
      type: String,
    }, //库存
    numData: {
      type: String,
    },
    ordersImage: {
      type: String,
    },
    bq: {
      type: String,
    },
    cjl:{
      type: String
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    isShow: true,
    bqList: []

  },
  attached() {
    this.setData({
      bqList: this.data.bq ? this.data.bq.split(",") : []
    })
  },
  /**
   * 组件的方法列表
   */
  methods: { //隐藏弹框
    close() {
      //触发取消回调
      this.triggerEvent("orderClose")

    },
    hideDialog() {
      this.setData({
        isShow: !this.data.isShow
      })
    },
    //展示弹框
    showDialog() {
      this.setData({
        isShow: !this.data.isShow
      })
    },
    /*
     * 内部私有方法建议以下划线开头
     * triggerEvent 用于触发事件
     */
    _reductionNum() {
      //触发取消回调
      this.triggerEvent("reductionNum")
    },
    _addNum() {
      //触发成功回调
      this.triggerEvent("addNum");
    },
    _cancelOrder() {
      console.log(1111111111)
      this.triggerEvent("cancelOrder");
    },
    submit(e) {
      this.triggerEvent("submit");
    }
  }
})
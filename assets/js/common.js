const service = require("../../service/service.js");
// 验证手机号
let validation = (phone) => {
    var a = true;
    if (!phone) {
        wx.showToast({
            title: '手机号格式不能为空',
            icon: 'none',
            duration: 2000
        })
    }
    var myreg = /^1[3456789]\d{9}$/;
    if (!myreg.test(phone)) {
        wx.showToast({
            title: '手机号格式不正确',
            icon: 'none',
            duration: 2000
        })
    }

}

// 弹出框
let showToast = (data) => {
    wx.showToast({
        title: data,
        icon: 'none',
        duration: 2000
    })
}

// 页面标题title修改
let setNavigationBarTitle = (data) => {
    wx.setNavigationBarTitle({
        title: data,
    })
}



//支付 商品  data 传参   type 1 订单商品支付页面       isLift 1 自提  2 外送
let pay = (data, type, isLift) => {
    var that = this;
    // var _type = that.data._type
    // var typeData = "";
    wx.showModal({
        title: "",
        content: '确定支付？',
        confirmColor: '#f07021',
        success(res) {
            if (res.confirm) {
                wx.showLoading({
                    title: '加载支付数据',
                })
                service.pay(data).then(res => {
                    console.log(res, '购买');
                    wx.hideLoading();
                    if (res.data.code == 200) {
                        if (res.data.data.data.length == 2) {
                            var message = JSON.parse(res.data.data.data[0]);
                            var orderId = res.data.data.data[1];
                            wx.requestPayment({
                                'timeStamp': message.timeStamp,
                                'nonceStr': message.nonceStr,
                                'package': message.package,
                                'signType': message.signType,
                                'paySign': message.paySign,
                                'success': function(res) {
                                    wx.showToast({
                                        title: '支付成功',
                                    })
                                    if (type == 1) {
                                        //         // 跳转至分享页面
                                        var rel = setTimeout(function() {
                                            // redirectTo   /pages/mine/orderRecord/orderRecord?name=4
                                            if (isLift == 1) { //自提     isLift 1 自提  2 外送
                                                var name = '6'
                                            } else {
                                                var name = '3'
                                            }
                                            wx.redirectTo({
                                                url: '/pages/mine/orderRecord/orderRecord?pay=1&name=' + name,
                                            })
                                            clearInterval(rel)
                                        }, 200)
                                    } else if (type == 2) { //待支付
                                        wx.navigateBack({
                                            delta: 1,
                                        })
                                        // var rel = setTimeout(function () {
                                        //     wx.redirectTo({
                                        //         url: '/pages/mine/orderDetail/orderDetail?pay=1&name=3',
                                        //     })
                                        //     clearInterval(rel)
                                        // }, 200)
                                    }
                                    // }
                                },
                                'fail': function(res) {
                                    wx.hideLoading();
                                    wx.showToast({
                                        title: '支付失败',
                                        icon: 'none',
                                        duration: 2000
                                    })
                                    var rel = setTimeout(function() {
                                        wx.redirectTo({
                                            url: '/pages/mine/orderDetail/orderDetail?id=' + orderId + '&name=3',
                                        })
                                        clearInterval(rel)
                                    }, 200)
                                }
                            })
                        } else if (res.data.data.data.length == 1) {
                            var orderId = res.data.data.data[0];
                            if (type == 1) {
                                //         // 跳转至分享页面
                                var rel = setTimeout(function() {
                                    // redirectTo   /pages/mine/orderRecord/orderRecord?name=4
                                    if (isLift == 1) { //自提
                                        var name = '6'
                                    } else {
                                        var name = '3'
                                    }
                                    wx.redirectTo({
                                        url: '/pages/mine/orderRecord/orderRecord?pay=1&name=' + name,
                                    })
                                    clearInterval(rel)
                                }, 200)
                            } else if (type == 2) { //待支付
                                wx.navigateBack({
                                    delta: 1,
                                })
                            }
                        } else {
                            wx.showToast({
                                title: res.data.data.message,
                                icon: 'none',
                                duration: 2000
                            })
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
        }
    })
}


//会员购买
let payVipCard = (data) => {
    var that = this;
    // var _type = that.data._type
    // var typeData = "";
    // wx.showModal({
    //     title: "",
    //     content: '确定支付？',
    //     confirmColor: '#f07021',
    //     success(res) {
    //         if (res.confirm) {
    //             wx.showLoading({
    //                 title: '加载支付数据',
    //             })
    vipService.buyVipCard(data).then(res => { 
        console.log(res, '会员购买');
        if (res.data.code == 200) {
            if (res.data.data.data.length > 0) {
                var message = JSON.parse(res.data.data.data[0]);
                var orderId = res.data.data.data[1];
                wx.requestPayment({
                    'timeStamp': message.timeStamp,
                    'nonceStr': message.nonceStr,
                    'package': message.package,
                    'signType': message.signType,
                    'paySign': message.paySign,
                    'success': function(res) {
                        wx.showToast({
                            title: '支付成功',
                        })
                        //         // 跳转至分享页面
                        var rel = setTimeout(function() {
                            // redirectTo   /pages/mine/orderRecord/orderRecord?name=4
                            wx.redirectTo({
                                url: '/pages/mine/cardOrderDetail/cardOrderDetail?id=' + orderId
                            })
                            clearInterval(rel)
                        }, 200)
                    },
                    'fail': function(res) {
                        wx.hideLoading();
                        wx.showToast({
                            title: '支付失败',
                            icon: 'none',
                            duration: 2000
                        })
                        // var rel = setTimeout(function () {
                        //     wx.redirectTo({
                        //         url:  '/pages/mine/cardOrderDetail/cardOrderDetail?id=' + orderId
                        //     })
                        //     clearInterval(rel)
                        // }, 200)
                    }
                })
            } else {
                wx.showToast({
                    title: res.data.data.message,
                    icon: 'none',
                    duration: 2000
                })
            }
        } else if (res.data.code == 70005) {
            wx.navigateTo({
                url: '/pages/mine/memberInformation/memberInformation'
            })

        } else {
            wx.showToast({
                title: res.data.message,
                icon: 'none',
                duration: 2000
            })
        }
    })
    //         }
    //     }
    // })
}
module.exports = {
    validation,
    showToast,
    setNavigationBarTitle,
    pay,
    payVipCard
}
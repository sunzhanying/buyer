
const common = require("../../assets/js/common.js");
const config = require('../../utils/config.js');
Page({
    data: {
        userInfo: {},
        // isShow: false, //微信信息是否存在
        // navtoShow: true, //直接跳转
        token: ''
    },

    // 获取token
    login: function() {
        var that = this;
        // 登录
        wx.login({
            success: res => {
                // that.data.url = '/pages/wine/wineDetail/wineDetail?id=354355454654&khid=23434546&sourceId=1143741120285417472&sourceContent=aaa'
              // that.data.url = "/pages/home/recipeDetail/recipeDetail?id=1154404274283573248"
              // that.data.url ="/pages/home/recipeDetail/recipeDetail?id=1154404274283573248&amp;sourceId=1143741422967365632&amp;sourceContent=aaa"
                var tjrid = '';
                var sourceId = '';
              // console.log(that.data.url, 'that.data.url')
                if (that.data.url) {
                    var url = that.data.url
                    console.log(url, 'url')
                    if (url.match(/khid=(.*)/)) {
                        tjrid = that.data.url.match(/khid=(.*)&sourceId/) ? that.data.url.match(/khid=(.*)&sourceId/)[1] : that.data.url.match(/khid=(.*)/)[1]; //取 khid=后面所有字符串
                    }
                    if (url.match(/sourceId=(.*)/)) {
                        sourceId = that.data.url.match(/sourceId=(.*)&sourceContent/) ? that.data.url.match(/sourceId=(.*)&sourceContent/)[1] : that.data.url.match(/sourceId=(.*)/)[1]; //取 khid=后面所有字符串
                        // console.log(tjrid, 'tjrid', sourceId, 'sourceId')
                    }
                }
                var formData = {
                    'code': res.code,
                    'sourceId': sourceId, //来源
                    'tjrid': tjrid, //推荐人id
                }
                // }
                // 发送 res.code 到后台换取 openId, sessionKey, unionId
                loginService.loginP(formData).then(res => {
                    console.log(res, '登录')
                    if (res.data.code == 200) {
                        wx.setStorage({
                            key: 'token',
                            data: res.data.data.token,
                        })
                        // if (res.data.data.vipXx) {
                        //     wx.setStorage({
                        //         key: 'isVipAll',
                        //         data: true,
                        //     })
                        // } else {
                        //     wx.setStorage({
                        //         key: 'isVipAll',
                        //         data: false,
                        //     })
                        // }
                        // if (res.data.data.wxnc && res.data.data.wxnc != '') {
                            // that.setData({
                            //     // navtoShow: true,
                            //     // isShow: true
                            // })
                            if (that.data.url) {
                                var c = setInterval(function() {
                                    wx.reLaunch({
                                        url: that.data.url + "&name=login",
                                    })
                                    clearInterval(c)
                                }, 1000)
                            } else if (that.data.goodsId) { //商品id
                                var rel = setTimeout(function() {
                                    // wx.redirectTo({
                                    wx.reLaunch({
                                        url: that.data.goodsId + "&name=login",
                                    })
                                    clearInterval(rel)
                                }, 1000)
                            } else {
                                wx.reLaunch({
                                    url: '/pages/tab/wineTasting/wineTasting',
                                })
                            }
                        // } else {
                            // that.setData({
                            //     // navtoShow: false,
                            //     isShow: false
                            // })
                        // }
                        that.setData({
                            token: res.data.data.token
                        })

                    } else {
                        common.showToast(res.data.message)
                        // that.setData({
                        //     // navtoShow: false,
                        //     isShow: false
                        // })
                    }
                })
            }
        })
    },

    // 获取微信信息
    onGotUserInfo: function(e) {
        var that = this;
        var avatarUrl = '';
        if (e.detail.errMsg == "getUserInfo:ok") {
            // if (e.detail.userInfo.avatarUrl == '') {
            //     avatarUrl = '/images/logo_sweet@3x.png';
            // } else {
            avatarUrl = e.detail.userInfo.avatarUrl;
            // }
            // that.setData({
            //     userInfo: e.detail.userInfo,
            // })
            // const token1 = wx.getStorageSync('token1') || '';
            const token = wx.getStorageSync('token') || '';
            // const ismaster = wx.getStorageSync('ismaster') || '';

            var formData = {
                "nickname": e.detail.userInfo.nickName, // 昵称
                "avatar": e.detail.userInfo.avatarUrl, //头像
                // "xb": that.data.userInfo.gender
            }
            // that.login(formData)
            loginService.saveAvatarAndNickname(formData).then(res => {
                console.log(res, '提交获取用户信息')
                if (res.data.code == 200) {
                    if (that.data.url) {
                        wx.navigateTo({
                            url: that.data.url + "&name=login",
                        })
                    } else if (that.data.goodsId) { //商品id
                        var rel = setTimeout(function() {
                            // wx.redirectTo({
                            wx.reLaunch({
                                url: that.data.goodsId + "&name=login",
                            })
                            clearInterval(rel)
                        }, 1000)
                    } else {
                        var rel = setTimeout(function() {
                            wx.switchTab({
                                url: '/pages/tab/wineTasting/wineTasting',
                            })
                            clearInterval(rel)
                        }, 200)
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
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        var that = this;
        console.log(options, '传播人')
        // 菜品
      // options.q = "http%3A%2F%2Fbrandhub.lemondm.com%2Fmeterials%2Furl%3Dpages%2Fhome%2FrecipeDetail%2FrecipeDetail%26id%3D1155666722272743424%26khid%3D1151046225186414592"
      // 商品   pages/wine/wineDetail/wineDetail
      // options.q = "http%3A%2F%2Fbrandhub.lemondm.com%2Fgoods%2Furl%3D%2Fpages%2Fwine%2FwineDetail%2FwineDetail%26id%3D1153971879544786944%26khid%3D1151046225186414592"
        // 二维码分享
        if (options.q) {
            var scene = decodeURIComponent(options.q)
            if (scene) {
                var str = scene.match(/url=(.*)/)[1]; //取 data=后面所有字符串
                console.log(str,'str')
                if (str.substr(0, 5) === "/page") {
                    var url = str.replace('&', '?');
                    // console.log('登录页获取参数', url)
                    that.data.url = url
                } else {
                    that.setData({
                        recommended: str
                    })
                }
            }
        }

        // 酒 商品分享  // typeid 2 菜品分享
        switch (options.typeid) {
            case '1':
                // 酒品
                that.data.goodsId = "/pages/wine/wineDetail/wineDetail?id=" + options.goodsId
                break;
            case '2':
                // 菜品
                that.data.goodsId = "/pages/home/recipeDetail/recipeDetail?id=" + options.goodsId + '&typeId=' + options.typeid
                break;
        }
        // if (options.goodsId) {
        //     that.data.goodsId = "/pages/wine/wineDetail/wineDetail?id=" + options.goodsId
        // }
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
        this.login()
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

        // 生命周期函数--监听页面卸载    二维码分享地址
        // this.setData({
        //     url: false
        // })
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
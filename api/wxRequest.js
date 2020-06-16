/**
 * 
 * api
 * 专注服务端数据请求，统一服务状态管理，promise异步处理
 * 下层 => 数据层 => 统一处理数据
 * 
 */
const Promise = require('./es6-promise.min.js');

function wxPromise(method, url, data, headerType){
    return new Promise(function(resolve,reject){
        const token = wx.getStorageSync('token') || '';
        if (token) {
            var header = {
                "Content-Type": headerType,
                "X-Auth-Token": token
            }
        } else {
            var header = {
                "Content-Type": headerType
            }
        }
        // console.log(method, 'method', data, header, 'data', url,token)
        wx.request({
            // url
            url: url,
            // post/get/put
            method:method,
            // data
            data:data,
            header: header,
            success:function(res){
                // console.log(res,'ss')
                if (res.statusCode == 403){
                    // wx.reLaunch({
                    //     url: '/pages/login/login'
                    // })
                }else{
                    resolve(res);
                }
                
            },
            fail:function(res){
                // wx.navigateTo({
                //     url: '/pages/noNetwork/noNetwork'
                // })
                // setTimeout(function(){
                //     wx.hideLoading();
                // },100);
                wx.showToast({
                    title:'暂无网络',
                    icon:'none',
                    duration:2000
                })
                // reject(res);
            }
        })
    })
}

// GET
function getRequest(url,data){
    return wxPromise('GET', url, data,"application/json");
}
// POST
function postRequest(url,data){
    return wxPromise('POST', url, data, "application/x-www-form-urlencoded");
}

// POST  数组
function postListRequest(url, data) {
    return wxPromise('POST', url, data, "application/json");
}
// PUT
function putRequest(url, data) {
    return wxPromise('PUT', url, data, "application/json");
}
// DELETE
function deleteRequest(url, data) {
    return wxPromise('DELETE', url, data, "application/json");
}

module.exports = {
    wxPromise,
    getRequest,
    postRequest,
    putRequest,
    deleteRequest,
    postListRequest

}
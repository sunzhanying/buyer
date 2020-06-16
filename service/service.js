/**
 * 
 * 数据层
 * 专注提供数据到view层
 * 上册 => api层 服务端接口请求，接口状态管理
 * 下层 => view层 业务逻辑
 * 
 */
const wxRequest = require('../api/wxRequest.js');
const config = require('../utils/config.js');



// 登录
function Login(data) {
  var url = config.DOMAIN + '/api/auth/login';
  return wxRequest.postRequest(url, data);
}

// 获取所有类型
function allType(data) {
  var url = config.DOMAIN + '/api/qyq/getSpTypeAll';
  return wxRequest.getRequest(url, data);
}
// 获取所有商品 
function getSpAll(data) {
  var url = config.DOMAIN + '/api/qyq/getSpAll';
  return wxRequest.getRequest(url, data);
}
// 获取商品详情
function getSpDetail(data) {
  var url = config.DOMAIN + '/api/qyq/getSpDetails';
  return wxRequest.getRequest(url, data);
}
// 保存用户头像和昵称
function saveUserInfo(data) {
  var url = config.DOMAIN + '/api/khxx/saveAvatarAndNickname';
  return wxRequest.postRequest(url, data);
}
// 添加权益券
function addCard(data) {
  var url = config.DOMAIN + '/api/qyq/addQy';
  return wxRequest.postJson(url, data);
}
// 上传图片
function getUserInfo(data) {
  var url = config.DOMAIN + '/api/khxx/userInfo';
  return wxRequest.getRequest(url, data);
}
// 买方明细
function BuyerDetail(data) {
  var url = config.DOMAIN + '/api/qyq/getMx';
  return wxRequest.getRequest(url, data);
}
// 订单支付
function orderPay(data) {
  var url = config.DOMAIN + '/api/wx/pay';
  return wxRequest.postRequest(url, data);
}
// 个人中心
function centerInfo(data) {
  var url = config.DOMAIN + '/api/khxx/orderZt';
  return wxRequest.getRequest(url, data);
}
// 买房订单详情
function orderDetail(data) {
  var url = config.DOMAIN + '/api/qyq/getOrder';
  return wxRequest.getRequest(url, data);
}
// 发送验证码
function sendSmsCode(data) {
  var url = config.DOMAIN + '/api/khxx/send-register-sms';
  return wxRequest.postRequest(url, data);
}
// 保存手机号姓名
function saveTelAndName(data) {
  var url = config.DOMAIN + '/api/khxx/saveNamePhone';
  return wxRequest.postRequest(url, data);
}
//首页banner
function getBanner(data) {
  var url = config.DOMAIN + '/api/auth/banner';
  return wxRequest.getRequest(url, data)
}
module.exports = {
  Login,
  allType,
  getSpAll,
  getSpDetail,
  saveUserInfo,
  addCard,
  getUserInfo,
  BuyerDetail,
  orderPay,
  centerInfo,
  orderDetail,
  sendSmsCode,
  saveTelAndName,
  getBanner
}
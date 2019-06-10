import {http} from './util.js'
/**
 * 登录
 * @param {Object} 携带参数 obj.code
 */
export const login = obj => http('user/Login',obj)
/**
 * 获取验证码
 * @param {Number/String} 携带参数obj.mobile
 */
export const sendSms = obj => http('user/sendSms',obj);
/**
 * 绑定和修改手机
 * @param{Number/String} 携带参数 obj.mobile 手机号 携带参数 obj.code验证码
 */
export const bindPhone = obj => http('user/bindPhone', obj);
/**
 * 获取列表
 * @param {Number/String} 必选携带参数 obj.type 类型1是生活家福利 2是限时特惠  obj.page页数
 * @param {String} 可选携带参数 obj.size
 */
export const activityList = obj => http('index/activityList',obj);

/**
 * 获取商品详情
 * @param{String/Number}obj.id 商品id
 */
export const goodsDetail = obj => http('index/activityDetail',obj);
/**
 * 检查用户状态
 */
export const checkUser = obj => http('user/checkUserStatus',obj);
/**
 * 确认订单接口
 * @param{String/Number} goods_id 商品id    qty商品数量
 * @return ordersn 订单编号
 */
export const confirm = obj => http('order/create',obj);
/**
 * 支付接口
 * @param {String/number} obj.order_no 订单编号
 */
export const pay = obj => http('order/goPay', obj)
/**
 * 订单列表接口
 * @param {String/Number} obj.type 1是砍价 2是特价
 * @param {String/Number} obj.status  -1全部 0待支付 1成功
 * @param {String/number} obj.page 页数
 */
export const orderList = obj => http ('order/list',obj);

/**
 * 订单详情
 * @param {String/number} obj.id 订单id
 */
export const orderDetail = obj => http('order/detail',obj)
/**
 * 取消订单
 * @param {String/number} obj.id 订单id
 */
export const cancelOrder = obj => http('order/cancel',obj)

/**
 * 搜索
 * @param {string/number} obj.keyword 关键字
 * @param {string/number} obj.type 1是砍价活动 2是特价活动
 */
export const search = obj => http('index/search',obj)

/**
 * 获取系统设置
 */

export const setTing = obj => http('setting/index',obj)
/**
 * 砍价详情
 * @param {String} obj.goods_id 商品ID obj.buy_uid 购买人uid
 */
export const bargainDetail = obj => http('index/bargainlist',obj);

/**
 * 砍价 砍刀
 * @{param} {String} obj.goods_id 商品ID obj.buy_uid 购买人uid
 */
export const bargain = obj => http('index/bargain',obj)

/**
 * 获取用户信息
 * @{param} {String} obj.uuid 需要获取的用户信息
 */
export const getInfo = obj => http('user/getuserinfo', obj)
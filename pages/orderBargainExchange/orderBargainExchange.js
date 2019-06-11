// pages/orderSellExchange/orderSellExchange.js
import { orderDetail} from "../../utils/api.js"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    goodsid:0,
    goods:null
  },
  goGoods(event){
    let id = event.currentTarget.dataset['id'];
    wx.navigateTo({
      url: '/pages/bargaindetail/bargaindetail?id='+id,
    })
  },
  getDetail(){
    let obj = {};
    obj.id = this.data.goodsid;
    orderDetail(obj).then(res => {
      console.log(res)
      this.setData({
        goods: res
      })
    }, error => {
      wx.showToast({
        title: '请求出错',
        success: res => {
          setTimeout(() => {
            wx.navigateBack({
              delta: 1
            })
          }, 1500)
        }
      })
    })
  },
  callTel(event){
    let tel = event.currentTarget.dataset['tel'];
    wx.makePhoneCall({
      phoneNumber: tel
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      goodsid:options.id
    })
    this.getDetail()
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
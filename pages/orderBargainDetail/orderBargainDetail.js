// pages/orderSellDetail/orderSellDetail.js
import { orderDetail, cancelOrder, pay} from "../../utils/api.js"
const app  = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    goodsid:0,
    status:0,
    tel:null,
    goods:null,
    isPhoneX:false
  },
  //拨打电话
  callTel(event){
    let tel = event.currentTarget.dataset['tel'];
    wx.makePhoneCall({
      phoneNumber:tel
    })
  },
  //设置电话
  gotel() {
    if (this.data.tel == '未绑定') {
      wx.navigateTo({
        url: '../editTel/editTel?tel=0&active=1',
      })
    } else if (this.data.tel != '') {
      wx.navigateTo({
        url: '../editTel/editTel?tel=' + this.data.tel + "&active=0",
      })
    }
  },
  //请求详情
  getDetail(){
    let obj = {};
    obj.id = this.data.goodsid;
    orderDetail(obj).then(res=>{
      console.log(res)
      this.setData({
        goods:res
      })
    },error=>{
      wx.showToast({
        title: '请求出错',
        success:res => {
          setTimeout( () => {
            wx.navigateBack({
              delta:1
            })
          },1500)
        }
      })
    })
  },
  //取消的方法
  cancel(){
    wx.showModal({
      content: '确认取消该订单？',
      success:res => {
        if (res.confirm) {
          let obj = {};
          obj.id = this.data.goods.id;
          wx.showLoading({
            mask:true
          })
          cancelOrder(obj).then(res=>{
            wx.showToast({
              title: '取消成功',
              success: res => {
                setTimeout(() => {
                  getApp().globalData.orderRefresh = true;
                  wx.navigateBack();
                }, 1500)
              }
            })
          },error => {
            wx.hideLoading()
            wx.showToast({
              title: '请求失败',
              image:'../../images/common/sigh.png',
              mask:true
            })
          })
        }
      }
    }) 
  },
  //支付的方法
  gopay(){
    let obj = {};
    obj.order_no = this.data.goods.order_no;
    wx.showLoading({
      mask:true
    })
    pay(obj).then(res => {
      this.inpay(res)
    },error => { 
      wx.hideLoading();
      wx.showToast({
        title: '请求失败',
        image: '../../images/common/sigh.png',
        mask: true
      })
    })
  },
  inpay(obj) {
   
    wx.requestPayment({
      timeStamp: obj.timeStamp,
      nonceStr: obj.nonceStr,
      package: obj.package,
      signType: obj.signType,
      paySign: obj.paySign,
      success: res => {
        console.log(res)
   
        wx.showToast({
          title: '下单成功',
          mask:true,
          success:res => {
            setTimeout( () => {
              getApp().globalData.orderRefresh = true;
              wx.navigateBack();
            })
          }
        })
      },
      fail: res => {
        wx.hideLoading();
        wx.showToast({
          title: '支付失败',
          image: '../../images/common/sigh.png',
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.getSystemInfo({
      success: res => {
        let modelmes = res.model;
        if (modelmes.search('iPhone X') != -1) {
          this.setData({
            isPhoneX: true
          })
        }
      },
    })
    this.setData({
      goodsid:options.id,
      status:options.status
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
    let info = app.globalData.appUserinfo;
    console.log(info)
    let tel = info.mobile != '' ? info.mobile : '未绑定';
    this.setData({
      tel: tel
    })
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
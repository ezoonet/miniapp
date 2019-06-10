// pages/confirm/confirm.js
const app = getApp();
import { confirm, pay} from '../../utils/api.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    goods:null,
    tel:null,
    isPhoneX:false
  },
  gotel(){
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
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let item = app.globalData.cartItem;
    wx.getSystemInfo({
      success:res => {
        let modelmes = res.model;
        if (modelmes.search('iPhone X') != -1){
          this.setData({
            isPhoneX:true
          })
        }
      },
    })
    item.total = (item.price*item.num).toFixed(2);
    this.setData({
      goods:item
    })
    app.globalData.cartItem = null;
  },
  //去支付
  toConfirm(){
    let obj = {};
    obj.goods_id = this.data.goods.id;
    obj.qty = this.data.goods.num;
    wx.showLoading({
      mask:true
    });
    confirm(obj).then(res=>{
      let obj2 = {};
      obj2.order_no = res.order_no
      pay(obj2).then( res2 =>{
        wx.showLoading({
          mask: true
        });
        this.pay(res2)
      }, error => {
        wx.hideLoading()
        wx.showModal({
          content: error.msg,
        })
      })
    }, (error) => {
      wx.hideLoading()
      wx.showModal({
        content: error.msg,
      })
    })
  },
  //支付函数
  pay(obj){
    wx.requestPayment({
      timeStamp: obj.timeStamp,
      nonceStr: obj.nonceStr,
      package: obj.package,
      signType: obj.signType,
      paySign: obj.paySign,
      success:res => {
          console.log(res)
        // type 为1的时候跳转砍价订单列表页 为2跳转特价列表页
        // TODO 此处使用redirectTo 防止返回的时候重新跳转会触发请求的操作
        if (this.data.goods.type == 1) {
          wx.redirectTo({
            url: '/pages/bargainList/bargainList',
          })
        } else {
          wx.redirectTo({
            url: '/pages/sellList/sellList',
          })
        }
      },
      fail:res => {
        wx.hideLoading();
        wx.showToast({
          title: '支付失败',
          image:'../../images/common/sigh.png',
          success:res => {
            setTimeout( () => {
              wx.navigateBack({
                delta:1
              })
            }, 1500)
          }
        })
      }
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
    let info = app.globalData.appUserinfo;
    console.log(info)
    let tel = info.mobile != '' ? info.mobile : '未绑定';
    this.setData({
      tel:tel
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
})
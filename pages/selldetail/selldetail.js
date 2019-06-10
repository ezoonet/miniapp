// pages/bargaindetail/bargaindetail.js
const app = getApp();
import { login, goodsDetail } from '../../utils/api.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    sku: {},//对象内容
    empowerFlag: false,
    userinfo: null,
    unlink: false,//账号冻结的话显示弹层
    goodsid: 6,
    stoptimeFlag:false
  },
  //获取内容
  getDetail() {
    let obj = {};
    obj.id = this.data.goodsid;
    goodsDetail(obj).then(res => {
      if(res.length==0){
        wx.showToast({
          title: '商品已下架',
          image:'../../images/common/sigh.png',
          success:res => {
            setTimeout( () => {
               wx.navigateBack()
            },1500)
          }
        })
        return;
      }
      wx.setNavigationBarTitle({
        title: res.title,
      })
      let obj  = res;
      obj.num = 1;
      this.setData({
        sku: obj
      })
      
    })
  },
  //传输函数 商品时间停止
  stoptime(){
    this.setData({
      stoptimeFlag: true
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    if (options.id){
      const id = options.id;
      this.setData({
        goodsid: id
      })
    }
    
    
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
    const timer1 = setInterval(() => {
      if (app.globalData.emPowerUserInfoFlag !== null) {
        clearInterval(timer1)
        if (app.globalData.emPowerUserInfoFlag) {
          //如果有值的话 不显示授权
          this.setData({
            empowerFlag: false
          })
          if (app.globalData.appUserinfo !== null){
            //如果用户信息存在的话 就直接请求详情
            this.getDetail();
            return;
          }else{
            //如果用户信息不存在的话就请求登录
            this.getUserinfo()
          }
        } else {
          //如果没有值的话 显示授权
          this.setData({
            empowerFlag: true
          })
          return;
        }
      }
    },100)
  },
  getUserinfo() {
    wx.login({
      success: res => {
        let obj = {};
        obj.code = res.code;
        wx.getUserInfo({
          success: res2 => {
            obj.iv = res2.iv;
            obj.encryptedData = res2.encryptedData;
            this.inLogin(obj);
          }
        })
      }
    })
  },
  inLogin(obj) {
    login(obj).then(res => {
      let tel = res.mobile != '' ? res.mobile : '未绑定'
      this.setData({
        empowerFlag: false,
        unlink: false,
        userinfo: res,
        tel: tel
      })
      app.globalData.appUserinfo = res;
      app.globalData.emPowerUserInfoFlag = true;
     
      this.getDetail()
    }, (error) => {
      app.globalData.appUserinfo = null;
      app.globalData.emPowerUserInfoFlag = false;
      console.log(app.globalData)
      //发生异常
      wx.showToast({
        title: '请重试',
        image:'../../images/common/sigh.png',
        success:res => {
          setTimeout( () => {
            wx.navigateBack();
          },1500)
        }
      })
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
    let data = this.data.sku;
    return {
      title:data.title,
      url:'/pages/selldetail?id='+data.id+'&sharesell=0',
      imageUrl: data.primary_img.original_pic
    }
  }
})
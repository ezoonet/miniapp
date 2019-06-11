// pages/user/user.js
const app = getApp();
import { login, setTing} from '../../utils/api.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    empowerFlag:false,
    userinfo:null,
    unlink: false,//账号冻结的话显示弹层
    tel:'',
    banFlag:false,
    version:'1.2.7',
    shanghutel:'',
    kefutel:'',
    serviceTime:'获取中'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getSystem()
    
  },
  getSystem(){
    setTing({}).then(res => {
      const { cooperate_phone, service_phone, service_time} = res;
      this.setData({
        shanghutel: cooperate_phone,
        kefutel: service_phone,
        serviceTime: service_time
      })
    })
  },
  toBargain(event){
    let status = event.currentTarget.dataset['status'];
    wx.navigateTo({
      url: '/pages/bargainList/bargainList?status='+status,
    })
  },
  toSell(event){
    let status = event.currentTarget.dataset['status'];
    wx.navigateTo({
      url: '/pages/sellList/sellList?status='+status,
    })
  },
  //获取用户信息
  getUserinfo(){
    wx.showLoading();//优化生硬空白
    wx.login({
      success:res=>{
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
  inLogin(obj){
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
    }, (error) => {
      app.globalData.appUserinfo = null;
      app.globalData.emPowerUserInfoFlag = false;
      //发生异常
      wx.showToast({
        title: '请重试',
        image: '../../images/common/sigh.png',
        success: res => {
        }
      })
    })
  },
  //拨打电话
  call(event){
   
    let tel = event.currentTarget.dataset['call'];
    wx.makePhoneCall({
      phoneNumber: tel,
    })
  },
  toEdit(){
    if (this.data.tel == '未绑定'){
      wx.navigateTo({
        url: '../editTel/editTel?tel=0&active=1',
      })
    }else if(this.data.tel != ''){
      wx.navigateTo({
        url: '../editTel/editTel?tel='+this.data.tel+"&active=0",
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
        } else {
          //如果没有值的话 显示授权
          this.setData({
            empowerFlag: true
          })
          wx.hideLoading()
          return;
        }
        this.getUserinfo()
      }
    },10)
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
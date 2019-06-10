// pages/editTel/editTel.js
import { sendSms, bindPhone} from "../../utils/api.js"
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    active:1,//判断是绑定手机号还是修改手机号,
    current:'',//当前手机号
    tel:'',//新手机号
    code:'获取验证码',
    disabled:true,
    timer:null,
    codeNumber:'',
  },
  onIpunt(event){
    let reg = /^[1][3,4,5,7,8][0-9]{9}$/;
    let mobile = event.detail.value;
    console.log(mobile)
    if(reg.test(mobile)){
      this.setData({
        disabled:false,
        tel:mobile
      })
    }else{
      this.setData({
        disabled:true,
        tel: mobile
      })
    }
  },
  onCode(event){
    this.setData({
      codeNumber:event.detail.value
    });
  },
  //获取验证码
  toCode(){
    //如果是禁止状态下不做任何处理
    if(this.data.disabled)return;
    if(this.data.tel == this.data.current){
      wx.showModal({
        content: '请勿填写相同的手机号!',
      })
      return;
    }
    this.setData({
      disabled:true
    })
    let timer1;
    let obj = {};
    obj.mobile = this.data.tel;
    wx.showLoading();
    sendSms(obj).then( res => {
      let time = 60;
      timer1 = setInterval( () => {
        time--;
        let times = time+'s'
        console.log(time)
        this.setData({
          code: times
        })
        if(time<=0){
          let reg = /^[1][3,4,5,7,8][0-9]{9}$/;
          let mobile = this.data.tel;
          if (reg.test(mobile)){
            this.setData({
              code: '获取验证码',
              disabled:false
            })
          }else{
            this.setData({
              code: '获取验证码',
              disabled:true
            })
          }
          
          clearInterval(timer1)
        }
      },1000)
    }, (error) => {
      //出错的情况
      wx.showToast({
        title: error.msg,
        image: '../../images/common/sigh.png',
        mask: true
      })
    })
  },
  //绑定手机号
  bind(){
    let reg = /^[1][3,4,5,7,8][0-9]{9}$/;
    const mobile = this.data.tel;
    if (!reg.test(mobile)){
      wx.showToast({
        title: '手机号有误',
        image: '../../images/common/sigh.png',
        mask: true
      })
      return;
    }
    if (this.data.codeNumber.toString().length<6){
      wx.showToast({
        title: '验证码有误',
        image: '../../images/common/sigh.png',
        mask: true
      })
      return;
    }
    let obj = {};
    obj.sms_code = this.data.codeNumber;
    obj.mobile = this.data.tel;
    bindPhone(obj).then(res =>{
      let tips = this.data.active == 1? '绑定成功':'更换成功'
      wx.showToast({
        title: tips,
        success:res=>{
          setTimeout(() => {
            app.globalData.appUserinfo.mobile  = this.data.tel;
            wx.navigateBack({
              delta:1
            })
          },1500)
        }
      })
    },(error)=>{ 
      wx.showModal({
        content: error.msg,
      })
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      current:options.tel,
      active:options.active
    })
    if (options.active == 1){
      wx.setNavigationBarTitle({
        title: '绑定手机',
      })
    }else{
      wx.setNavigationBarTitle({
        title: '修改手机',
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
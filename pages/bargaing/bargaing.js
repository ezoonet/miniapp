// pages/bargaing/bargaing.js
const app = getApp();
import { login, bargainDetail, bargain, getInfo } from '../../utils/api.js'
import { judgeImg } from '../../utils/util.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    sku: {},//对象内容
    empowerFlag: false,
    userinfo: null,
    unlink: false,//账号冻结的话显示弹层
    goodsid: 16,
    day: '00',
    hour: '00',
    min: '00',
    sec: '00',
    kjTitle: '砍价进行中',
    endTime: 0,
    status: -1,
    total_price: 0,
    remain: 0,
    percent: 0,
    bargainlist: [],
    win: 0,
    toastFlag: false,
    buyinfo:{},
    uuid: 'a0ccab725ba9f43060f3afe62eb549ff',
  },
  join(){
    wx.reLaunch({
      url: '/pages/bargaindetail/bargaindetail?id='+this.data.goodsid,
    })
  },
  bargain(){
    const goods_id = this.data.goodsid;
    const buy_uid = this.data.uuid;
    const obj = {
      goods_id: goods_id,
      buy_uid: buy_uid
    }
    wx.showLoading()
    bargain(obj).then(res => {
      console.log(res);
      this.getDetail();
      this.setData({
        win: res.price,
        toastFlag: true
      })
    })
  },
  //倒计时方法
  countDown() {
    //当前时间
    let nowtime = new Date().getTime();
    //得出时间差
    let _time = this.data.endTime - nowtime;
    let time = (this.data.endTime - nowtime) / 1000
    if (time <= 0) {
      this.setData({
        day: '00',
        hour: '00',
        min: '00',
        sec: '00'
      });
      wx.showToast({
        title: '活动已结束',
        image: '../../images/common/sigh.png',
        success: res => {
          setTimeout(() => {
            this.setData({
              status: -1
            })
            wx.reLaunch({
              url: '/pages/index/index',
            })
          }, 1500)
        }
      })
      return;
    }
    //总天数
    let day = Math.floor(time / 3600 / 24)
    //总小时数
    let hr = Math.floor(time / 3600 % 24)
    //总分钟数
    let min = Math.floor(time / 60 % 60);
    //总秒数
    let sec = Math.floor(time % 60);
    hr = hr <= 9 ? '0' + hr : hr;
    min = min <= 9 ? '0' + min : min;
    sec = sec <= 9 ? '0' + sec : sec;
    this.setData({
      day: day,
      hour: hr,
      min: min,
      sec: sec
    });
    setTimeout(() => {
      this.countDown();
    }, 1000)
  },
  judgeImg2(e) {
    const img = e.currentTarget.dataset['img'];
    const renderImg = judgeImg(img);
    let dataimg = 'sku.primary_img.original_pic';
    this.setData({
      [dataimg]: renderImg
    })
  },
  hideToast() {
    this.setData({
      toastFlag: false
    })
  },
  //获取内容
  getDetail() {
    let obj = {};
    obj.goods_id = this.data.goodsid;
    obj.buy_uid = this.data.uuid;
    wx.showLoading();
    bargainDetail(obj).then(res => {
      if (res.length == 0) {
        wx.showToast({
          title: '商品已下架',
          success: res => {
            setTimeout(() => {
              wx.reLaunch({
                url: '/pages/index/index',
              })
            }, 1500)
          }
        })
        return;
      }
      wx.setNavigationBarTitle({
        title: res.activity.title,
      })
      this.setData({
        sku: res.activity,
        endTime: res.activity.end_time * 1000,
        status: res.is_bargain,
        total_price: res.total_price,
        remain: res.remain,
        percent: res.percent,
        bargainlist: res.list
      })
      this.countDown()
    }, error => {
      wx.showToast({
        title: '请求出错',
        image: '../../images/common/sigh.png',
        success: res => {
          setTimeout(() => {
            wx.reLaunch({
              url: '/pages/index/index',
            })
          })
        }
      })
    })
  },
  getinfo(){
    let obj = {};
    obj.uuid = this.data.uuid;
    getInfo(obj).then(res => {
      this.setData({
        buyinfo:res
      })
    })
  },
  getUserinfo() {
    wx.showLoading();//优化生硬空白
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
      //发生异常
      app.globalData.appUserinfo = null;
      app.globalData.emPowerUserInfoFlag = false;
      console.log(app.globalData)
      //发生异常
      wx.showToast({
        title: '请重试',
        image: '../../images/common/sigh.png',
        success: res => {
          setTimeout(() => {
            wx.navigateBack();
          }, 1500)
        }
      })
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //如果有内容的话
    if (options.uid){
      this.setData({
        goodsid: options.id,
        uuid: options.uid
      })
    }
    this.getinfo()
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
          if (app.globalData.appUserinfo !== null) {
            //如果用户信息存在的话 就直接请求详情
            this.getDetail();
            return;
          } else {
            //如果用户信息不存在的话就请求登录
            this.getUserinfo()
          }
        } else {
          //如果没有值的话 显示授权
          this.setData({
            empowerFlag: true
          })
          wx.hideLoading()
          return;
        }
      }
    }, 100)
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

  }
})
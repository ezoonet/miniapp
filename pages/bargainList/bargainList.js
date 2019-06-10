// pages/bargainList/bargainList.js
import { orderList, orderDetail, pay } from '../../utils/api.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    active: 0,
    tablist: [
      { text: '全部', id: 0 },
      { text: '待支付', id: 1 },
      { text: '兑换券', id: 2 }
    ],
    allList: [],//订单外部数组
  },
  //切换列表
  changelist(event) {
    let index = event.currentTarget.dataset['active'];
    this.setData({
      active: index
    })
  },
  /**
   * 初始化函数 主要是为了初始化allList数组
   */
  init() {
    //重新setdata防止出现不必要的麻烦
    this.setData({
      allList: []
    })
    let _Arr = [];
    //判断tabs有多少个 创建一个数组对象
    for (let i = 0; i < this.data.tablist.length; i++) {
      let data = this.data.tablist;
      let obj = {};
      obj.list = [];
      obj.page = 1;//页数
      obj.id = i + 1;
      obj.loadFlag = true; //滚动加载开关
      obj.nodata = false;//没有数据
      obj.bottomFlag = false;//到底部的状态
      _Arr[i] = obj;
    }
    this.setData({
      allList: _Arr
    })
    this.load(0)
    this.load(1)
    this.load(2)
  },
  /**
   * 加载函数
   * @param {number/string}  type 0 1 2 分别全部 待支付 兑换券 相对的也是对应数组的下标
   */
  load(type) {
    let status = type - 1;
    let list = this.data.allList;
    let editList = list[type].list;//需要操作的列表
    let eiitPage = list[type].page;//需要操作的页数
    //如果没有数据的话 直接return
    if (list[type].nodata) return;
    //如果当前没有数据了就禁止上啦
    if (list[type].bottomFlag) return;
    wx.showLoading();
    let obj = {};
    obj.page = list[type].page;
    obj.status = status;
    obj.type = 1;//砍价为1
    let _nodata = 'allList[' + type + '].nodata';
    let _list = 'allList[' + type + '].list';
    let _page = 'allList[' + type + '].page';
    let _bottomFlag = 'allList[' + type + '].bottomFlag';

    orderList(obj).then(res => {
      // 隐藏导航栏加载框
      wx.hideNavigationBarLoading();
      // 停止下拉动作
      wx.stopPullDownRefresh();
      //如果没数据的情况显示没有数据的界面
      if (res.page_count === 0) {
        this.setData({
          [_nodata]: true
        })
        return;
      } else {
        this.setData({
          [_nodata]: false
        })
      }
      //如果页数小于或等于后端返回的话就继续加载
      if (list[type].page <= res.page_count) {
        editList = editList.concat(res.list);
        let page = eiitPage + 1;
        this.setData({
          [_list]: editList,
          [_page]: page
        })
      }
      //如果条数已经满了就显示到底
      if (editList.length === res.count) {
        this.setData({
          [_bottomFlag]: true
        })
      } else {
        this.setData({
          [_bottomFlag]: false
        })
      }
    }, error => {
      wx.showToast({
        title: '请求出错',
        image: '../../images/common/sigh.png'
      })
    })
  },
  //去支付
  goPay(event){
    let sn = event.currentTarget.dataset['sn'];
    let obj = {};
    obj.order_no = sn;
    wx.showLoading({
      mask:true
    })
    pay(obj).then(res => {
      wx.showLoading({
        mask: true
      });
      this.inpay(res)
    },error => {
      wx.hideLoading()
      wx.showModal({
        content: error.msg,
      })
    })
    
  },
  inpay(obj){

    wx.requestPayment({
      timeStamp: obj.timeStamp,
      nonceStr: obj.nonceStr,
      package: obj.package,
      signType: obj.signType,
      paySign: obj.paySign,
      success: res => {
        wx.showToast({
          title: '支付成功',
          success:res => {
            setTimeout( () => {
              this.onLoad();
            },1500)
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
  //继续购物
  goShop(event){
    let id = event.currentTarget.dataset['id'];
    wx.navigateTo({
      url: '/pages/bargaindetail/bargaindetail?id='+id,
    })
  },
  //查看订单详情
  goDetail(event){
    let id = event.currentTarget.dataset['id'];
    let status = event.currentTarget.dataset['status'];
    //如果status==1 表示的是兑换券 就跳转兑换券的界面
    if(status == 1){
        wx.navigateTo({
          url: '/pages/orderBargainExchange/orderBargainExchange?id='+id,
        })
    }else{
      wx.navigateTo({
        url: '/pages/orderBargainDetail/orderBargainDetail?id=' + id+'&status='+status,
      })
    }
    
  },
  //查看兑换券
  goExchange(event){
    let id = event.currentTarget.dataset['id'];
    wx.navigateTo({
      url: '/pages/orderBargainExchange/orderBargainExchange?id=' + id,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if(options.status){
      this.setData({
        active: options.status
      })
    }
    this.init()
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
    if (getApp().globalData.orderRefresh){
      this.onLoad()
      getApp().globalData.orderRefresh = false;
    }
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
    this.init()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.load(this.data.active);
  },
})
//index.js
//获取应用实例
const app = getApp()
import { http, debounce } from '../../utils/util.js'
import { activityList } from '../../utils/api.js'
Page({
  data: {
    weather:'地址请求中',
    winHeight:0,
    active: 1,//判断选中的是砍价商品还是特价商品
    bargain:{//砍价对应的内容
      page: 1,
      loadFlag: true,//滚动加载开关
      nodata: false,//没有数据
      bottomFlag: false,//到底部的状态
      list: [],//数组
      
    },
    sell:{
      //特价对应的内容
      page: 1,
      loadFlag: true,//滚动加载开关
      nodata: false,//没有数据
      bottomFlag: false,//到底部的状态
      list: [],//数组
    }
  },
  onLoad: function () {
    
    wx.getSystemInfo({
      success: res => {
        this.setData({
          winHeight: res.windowHeight
        })
      },
    })
    this.init()
  },
  onShow(){
    this.getlcoation();
  },
  onShareAppMessage(){},
  //获取经纬度
  getlcoation(){
    wx.getLocation({
      type: 'wgs84',
      success:res => {
        let obj = {};
        obj.location = res.longitude + ',' + res.latitude
        http('Index/getCity',obj).then(data => {
          this.setData({
            weather: data.address
          })
        })
      },
    })
  },
  //初始化
  init(){
    let bargain = {//砍价对应的内容
      page: 1,
      loadFlag: true,//滚动加载开关
      nodata: false,//没有数据
      bottomFlag: false,//到底部的状态
      list: [],//数组
    };
    let sell = {
      //特价对应的内容
      page: 1,
      loadFlag: true,//滚动加载开关
      nodata: false,//没有数据
      bottomFlag: false,//到底部的状态
      list: [],//数组
    }
    this.setData({
      bargain: bargain,
      sell: sell
    })
    this.loadData(1);
    this.loadData(2);
  },
  //切换列表
  changelist(event){
    let index = event.currentTarget.dataset['active'];
    if(index!==this.data.active){
      this.setData({
        active:index
      })
    }
  },
  goSearch(){
    wx.navigateTo({
      url: '/pages/search/search',
    })
  },
  //跳转砍价详情
  toBargain(event){
    let id = event.currentTarget.dataset['id'];
    wx.navigateTo({
      url: '../bargaindetail/bargaindetail?id='+id,
    })
  },
  goSellDetail(event){
    let id = event.currentTarget.dataset['id'];
    wx.navigateTo({
      url: '../selldetail/selldetail?id=' + id,
    })
  },
  //下拉刷新
  onPullDownRefresh(){
    this.loadData(this.data.active,'up')
  },
  //上拉加载更多
  onReachBottom(){
    //如果没有到达底部或者是有数据的时候就执行加载函数
    this.loadData(this.data.active)
  },
  /**
   * 加载数据入口
   * @param {Number} 1表示的是砍价商品bargain 2表示是特价商品 sell
   * @param{}
   */
  loadData(type,state){
    // 显示顶部刷新图标
    wx.showNavigationBarLoading();
    let _page;
    let _list;
    let _type = type || this.data.active;
    if(typeof _type === 'string'){
      _type = Number(_type)
    }
    let _nodata;
    let _bottomFlag;
    let editPage;
    let editList;
    switch (_type){
      case 1:
        _nodata = 'bargain.nodata';
        _bottomFlag = 'bargain.bottomFlag';
        editPage = 'bargain.page';
        editList = 'bargain.list';
        if (state === 'up') {
          this.setData({
            [editList]:[],
            [editPage]:1,
            [_bottomFlag]:false
          })
        }
        _page = this.data.bargain.page;
        _list = this.data.bargain.list;
        
      break;
      case 2:
        _nodata = 'sell.nodata';
        _bottomFlag = 'sell.bottomFlag';
        editPage = 'sell.page';
        editList = 'sell.list';
        if (state === 'up') {
          this.setData({
            [editList]: [],
            [editPage]: 1,
            [_bottomFlag]: false
          })
        }
        _page = this.data.sell.page;
        _list = this.data.sell.list;
      break;
    }
    let obj = {};
    obj.page = _page;
    obj.type = _type
    activityList(obj).then(res => {
      // 隐藏导航栏加载框
      wx.hideNavigationBarLoading();
      // 停止下拉动作
      wx.stopPullDownRefresh();

      //如果没数据的情况显示没有数据的界面
      if (res.page_count === 0) {
        this.setData({
          [_nodata]:true
        })
        return;
      }else{
        this.setData({
          [_nodata]:false
        })
      }
      //如果页数小于或等于后端返回的话就继续加载
      if(_page <= res.page_count){
        _list = _list.concat(res.list);
        let page = _page+1;
        this.setData({
          [editList]: _list,
          [editPage]:page
        })
      }

      //如果条数已经满了就显示到底
      if(_list.length===res.count){
        this.setData({
          [_bottomFlag]:true
        })
      }else{
        this.setData({
          [_bottomFlag]:false
        })
      }
    })
  }
})

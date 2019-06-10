// pages/search/search.js
import { search } from '../../utils/api.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    linkList:[],//搜索下拉
    inputVal:'',
    timer:null,
    historyFlag:true,
    historyList:[],//历史记录
    list:[],//列表
    winHeight:0,
  },
  toDetail(event){
    let id = event.currentTarget.dataset['id'];
    wx.navigateTo({
      url: '../selldetail/selldetail?id=' + id,
    })
  },
  getInput(event){
    this.setData({
      inputVal:event.detail.value
    })
    
  },
  clean(){
    console.log(1111)
    let a = ''
    this.setData({
      inputVal:a
    })
  },
  search(){
    let val = this.data.inputVal;
    if(val.length < 2){
      wx.showModal({
        content: '搜索关键字最少两个字',
      })
      return
    }
    let arr = this.data.historyList
    if (this.data.historyList>0){
      //有数据的话进行判断
      if(this.data.historyList.indexOf(val) !== -1){
        //如果存在相同的话 先删除再加入
        arr.splice(this.historyList.indexOf(val), 1)
        arr.unshift(val)
      }else{
        //没有相同的,就直接添加
        arr.unshift(val)
      }
    }else{
      //没有数据就直接添加
      arr.unshift(val)
    }
    if (this.data.historyList.length > 6) { // 保留六个值
      arr.pop()
    }
    this.setData({
      historyList:arr,
    })
    this.load()
    wx.setStorage({
      key: 'HistoryList',
      data: JSON.stringify(this.data.historyList),
    })
  },
  //设置搜索内容
  setSearch(event){
    let text = event.currentTarget.dataset['text'];
    this.setData({
      inputVal:text
    })
    this.load()
  },
  load(){
    let obj = {};
    obj.type=2;
    obj.keyword = this.data.inputVal;
    obj.page = -1;
    search(obj).then( res => {
      this.setData({
        historyFlag:false,
        list:res.list
      })
    })
  },
  cancel(){
    wx.navigateBack()
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      wx.getSystemInfo({
        success:res => {
          this.setData({
            winHeight: res.windowHeight
          })
        },
      })
      wx.getStorage({
        key: 'HistoryList',
        success: res => {
          let arr = JSON.parse(res.data);
          this.setData({
            historyList:arr
          })
        },
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
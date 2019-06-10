// components/empower/empower.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    //授权回调操作
    onGotUserInfo(e){
      if(e.detail.userInfo){
        getApp().globalData.emPowerUserInfo = true;//开关打开
        getApp().globalData.userInfo = e.detail.userInfo;//微信用户信息
        this.triggerEvent('getUserinfo', { userinfo: e.detail.userinfo })
      }else{
        //拒绝执行授权操作
        wx.showModal({
          content: '为了您更好的用户体验，请先同意授权',
        })
      }
      
    }
  }
})

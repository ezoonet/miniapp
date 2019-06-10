// components/goodsheader/goods.js
var WxParse = require('../../pages/wxParse/wxParse.js');
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    goods:Object,//商品信息
    
  },

  /**
   * 组件的初始数据
   */
  data: {
    imgheights:[],//图片数组高度
    current:0,
    toastFlag:false,
    autoplay:false,
    day:'00',
    hour:'00',
    min:'00',
    sec:'00',
    endTime:null,
    diffTime:null,//时间差
  },

  lifetimes:{
    attached(){
      this.setData({
        endTime: this.data.goods.end_time*1000,
      })
      WxParse.wxParse('article', 'html', this.data.goods.detail, this, 5);
      this.countDown()
    }
  },
  /**
   * 组件的方法列表
   */
  methods: {
    //swiper滑动响应事件
    bindchange(e){
      this.setData({
        current: e.detail.current 
      })
    },
    //图片加载事件
    imgLoad(e){
      var imgwidth = e.detail.width,
        imgheight = e.detail.height,
        //宽高比  
        ratio = imgwidth / imgheight;
      //计算的高度值  
      var viewHeight = 750 / ratio;
      var imgheight = viewHeight;
      var imgheights = this.data.imgheights;
      //把每一张图片的对应的高度记录到数组里  
      imgheights[e.target.dataset.id] = imgheight;
      this.setData({
        imgheights: imgheights
      })
    },
    //开启关闭弹窗事件
    closeToast(){
      let flag = !this.data.toastFlag;
      this.setData({
        toastFlag: flag
      })
    },
    stopBubble(){

    },
    addKefu(event){
      let content = event.currentTarget.dataset['kefu'];
      wx.setClipboardData({
        data: content,
        success:res => {
          wx.showToast({
            title: '复制成功',
            mask:true
          })
        }
      })
    },
    //下载图片
    download(){
      console.log(1111)
    },
    //倒计时方法
    countDown(){
      //当前时间
      let nowtime = new Date().getTime();
      //得出时间差
      let _time = this.data.endTime - nowtime;
      let time = (this.data.endTime - nowtime)/1000
      if (time<=0){
        this.setData({
          day: '00',
          hour: '00',
          min: '00',
          sec: '00'
        });
        
        this.triggerEvent('stoptime')
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
        day:day,
        hour:hr,
        min:min,
        sec: sec
      });
      setTimeout( () => {
        this.countDown();
      },1000)
    }
  }
})

// components/sku/sku.js
Component({
  lifetimes: {
    attached() {
      // 在组件实例进入页面节点树时执行
      wx.getSystemInfo({
        success: res2 => {
          let modelmes = res2.model;
          if (modelmes.search('iPhone X') != -1) {
            this.setData({
              isPhoneX:true
            })
          }
        }
      })
      if (!this.data.sku.buyable){
        //如果是禁止购买的话直接禁用
        this.setData({
          stopFlag: true,
        })
      }

    },
    detached() {
      // 在组件实例被从页面节点树移除时执行
      
      
    },
  },
  observers:{
    'sku':function(val){
    
      
      //置为初始状态
      this.setData({
        addBtn: false,
        reduceBtn: true,
      })
      //如果限购一个的话
      if (val.limit_qty==1){
         this.setData({
           addBtn:true
         })
       }
      
    },
    'stop':function(val){
      console.log(3333)
      //如果为true才执行
      if(val){
        this.setData({
          stopFlag:true,
          toastFlag:false
         })
      }
    }
  },
  /**
   * 组件的属性列表
   */
  properties: {
    sku:Object,
    stop: Boolean,
  },

  /**
   * 组件的初始数据
   */
  data: {
    toastFlag:false,
    animation:{},//动画开关
    addBtn:false,//数量增加状态
    reduceBtn:true,
    stopFlag:false,
    isPhoneX:false
  },

  /**
   * 组件的方法列表
   */
  methods: {
    back(){
      wx.navigateBack()
    },
    //关闭sku
    closeSku(){
      // this.triggerEvent('closeSku')
      let animation = wx.createAnimation({
        duration: 200,
        timingFunction: "linear",
        delay: 0,
      });
      //先下调到600
      animation.translateY(600).step();
      this.setData({
        animation: animation.export()
      });
     setTimeout(() => {
       this.setData({
         toastFlag:false
       })
     },200)
    },
    //展开sku
    showSku(){
      if(this.data.stopFlag)return;
      if(this.data.toastFlag)return;
      let animation = wx.createAnimation({
        duration: 200,
        timingFunction: "linear",
        delay: 0,
      });
      animation.translateY(600).step();
      this.setData({
        animation: animation.export(),//动画实例的export方法导出动画数据传递给组件的animation属性
        toastFlag:true
      });
      setTimeout(() => {
        animation.translateY(0).step()
        this.setData({
          animation: animation.export()
        })
      },200)
     
    },
    //跳转首页
    toIndex(){
      wx.switchTab({
        url: '../../pages/index/index',
      })
    },
    //添加方法
    add(){
      //如果是不能再添加的话直接关闭按钮
      if(this.data.addBtn)return;
      let num = this.data.sku.num;
      let quota = this.data.sku.limit_qty; //限购数量
      let stock = this.data.sku.stock; //库存数量
      let _sku = 'sku.num';
      ++num;
      if (quota>0){
        //如果是有限购数量的话
        if (num >= quota){
          //如果满足限购条件 则禁止添加按钮
          this.setData({
            [_sku]: num,
            addBtn: true,
            reduceBtn: false
          })
        }else{
          //如果是小于限购数量的话
          this.setData({
            [_sku]: num,
            reduceBtn: false
          })
        }
      }else{
        //非限购
        this.setData({
          [_sku]: num,
          reduceBtn: false
        })
      }
    },
    //减少数量方法
    reduce(){
      if(this.data.reduceBtn)return;
      let num = this.data.sku.num;
      --num;
      if(num<=0)return;
      let _sku = 'sku.num';
      if(num==1){
        this.setData({
          [_sku]:num,
          reduceBtn:true,
          addBtn:false
        })
      }else{
        this.setData({
          [_sku]: num,
          reduceBtn: false,
          addBtn:false
        })
      }
      
    },
    //跳转
    goshop(){
      let obj = {};
      let data = this.data.sku
      obj.title = data.title;
      obj.img = data.img_list[0].middle_pic;
      obj.shop_name = data.shop_name;
      obj.shop_address = data.shop_address;
      obj.price = data.base_price;
      obj.market_price = data.market_price;
      obj.num = data.num;
      obj.id = data.id;
      obj.type = data.type;
      let app =  getApp();
      app.globalData.cartItem = obj;
      wx.navigateTo({
        url: '../../pages/confirm/confirm',
      })
    }
  }
})

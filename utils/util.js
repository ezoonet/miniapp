
//节流
const debounce = (func, wait=1000)=>{
  let timeout;
  return function(event){
    clearTimeout(timeout);
    timeout = setTimeout(()=>{
      func(event)
    },wait)
  }
}
const http = (url,data,type) =>{
  //如果有用户数据的话就携带参数
  if (getApp().globalData.appUserinfo && type != 1){
    data.uid = getApp().globalData.appUserinfo.uid;
    data.token = getApp().globalData.appUserinfo.token;
  }
  if(type == 1){
    data.token ='d08d2231c90e6fc61b47098960dafb54'
    data.uid = '538bdae37c48ff22bbbb9b579332acbd'
  }
  // let prefix = 'http://devapi.ezoonet.com/wechat/';
  let prefix = 'https://api.ezoonet.com/wechat/';
  //测试服需要的数据
  if(prefix.indexOf('dev') != -1 && url.indexOf('Login') != -1){
    data.is_test = 1
  }
  return new Promise((resolve, reject) => {
    wx.request({
      url: prefix + url,
      data: data,
      dataType: 'json',
      method: 'post',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: res => {
        //隐藏loding状态
        wx.hideLoading();
        if (res.data.code === 200) {
          resolve(res.data.data);
        }else if(res.data.code === 300) {
          //300的状态都跳转首页 状态过期
          wx.showToast({
            title: res.data.msg,
            image:"../../images/common/sigh.png",
            success:res=>{
              setTimeout(()=>{
                wx.reLaunch({
                  url: '../../pages/index/index',
                })
              },2000)
            }
          })
        }else if(res.data.code === 310){
          wx.showToast({
            title: '账号异常',
            success:res => {
              setTimeout( () => {
                wx.reLaunch({
                  url: '/pages/banuser/banuser',
                })
              },2000)
            }
          })
        } else if (res.data.code === 400){
          //400状态抛出
          reject(res.data)
        }
      },
      fail: res => {
        //网络错误
        wx.showToast({
          title:'网络错误',
          image: "../../images/common/sigh.png",
          success:res=>{
            setTimeout(()=>{
              wx.redirectTo({
                url: '/pages/unlink/unlink',
              })
            },2000)
          }
        })
      }
    })
  })
}
//判断图片是否是404 或者是没有图片
const judgeImg = val => { 
  const noimg = '/images/common/noimg.png'
  return noimg
}
module.exports = {
  http: http,
  debounce: debounce,
  judgeImg: judgeImg
}


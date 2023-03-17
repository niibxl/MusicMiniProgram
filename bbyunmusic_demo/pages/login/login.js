// pages/login/login.js
// 说明: 登录流程
//   1. 收集表单项数据
//   2. 前端验证
//     1) 验证用户信息(账号，密码)是否合法
//     2) 前端验证不通过就提示用户，不需要发请求给后端
//     3) 前端验证通过了，发请求(携带账号, 密码)给服务器端
//   3. 后端验证
//     1) 验证用户是否存在
//     2) 用户不存在直接返回，告诉前端用户不存在
//     3) 用户存在需要验证密码是否正确
//     4) 密码不正确返回给前端提示密码不正确
//     5) 密码正确返回给前端数据，提示用户登录成功(会携带用户的相关信息)
// 引入发请求的封装函数
import request from '../../utils/request'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    email: '',
    password: '',
  
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

  },

  // 表单项收集数据
  handleInput(event) {
    // let type = event.currentTarget.id//通过id传值,一般只需要传一个唯一值使用
    // console.log(type,event.detail.value);可以区分开手机号和密码并拿到各自的值。
    let type = event.currentTarget.dataset.type //通过data-key:value形式传值，适用于传入多个key：value,需要注意传入的数据在dataset下
    this.setData({
      // 在对象里面操作变量，用中括号
      // 传入的id刚好和data中key名一样，这样简写
      [type]: event.detail.value
    })
  },

  // 登陆的回调  前端验证
  async login() {
    // 拿到表单数据
    let { email, password } = this.data
    // 前端验证
    /*
    * 手机号验证：
    *   1. 内容为空
    *   2. 手机号格式不正确
    *   3. 手机号格式正确，验证通过
    * */
    //  email为空，取反则为true
    if (!email) {
      // 提示框的API
      wx.showToast({
        title: '邮箱号不能为空',
        icon: 'none'
      })
      // 后续代码不执行，直接return回去
      return
    }
    // 定义正则表达式
    let emailReg = /([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,5})+/;
    if (!emailReg.test(email)) {
      wx.showToast({
        title: '邮箱号格式错误',
        icon: 'none'
      })
      return;
    }

    if (!password) {
      wx.showToast({
        title: '密码不能为空',
        icon: 'none'
      })
      return;
    }
    //  邮箱地址错误，返回501
    //  密码错误，返回502
    //  服务器错误，返回500
    // 后端验证
    let result = await request('/login', { email, password,isLogin:true})  //登录时携带登录状态传给request
    if (result.code === 200) {
      wx.showToast({
        title: '登录成功'
      })
      // 将cookie存储到本地
      // 将用户信息存储到本地  需转化为json对象
      wx.setStorageSync('userInfo',JSON.stringify(result.profile))
      // 跳转到用户个人中心页面  
      //switchTab跳转到 tabBar 页面，并关闭其他所有非 tabBar 页面，在此处不适用，因为跳转后并不会执行onload钩子函数，无法将用户信息进行存储。
      //reLaunch关闭所有页面，打开到应用内的某个页面 会重新执行onload函数
      //另外也可以将switchTab放到onshow函数执行，因为其在跳转页面时也会执行
      wx.reLaunch({
        url:'/pages/personal/personal'
      })
    } else if (result.code === 501) {
      wx.showToast({
        title: '邮箱地址错误',
        icon: 'none'
      })
    }
    else if (result.code === 502){
      wx.showToast({
        title: '密码错误',
        icon: 'none'
      })
    }else{
      wx.showToast({
        title: '登录失败，请重新登录',
        icon: 'none'
      })
    }
},
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

},

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

},

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

},

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

},

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

}
})
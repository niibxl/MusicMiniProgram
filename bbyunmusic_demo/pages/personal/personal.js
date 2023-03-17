// pages/personal/personal.js
import request from "../../utils/request"
// 手指移动起始坐标、移动的坐标、移动的距离
let startY = 0
let moveY = 0
let moveDistance = 0
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 初始时的移动距离
    coverTransform: 'translateY(0)',
    coverTransition: '',
    userInfo:'',
    recentListenList:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    // 读取用户基本信息  读取的字段名userInfo要与存储时一致
    let userInfo = wx.getStorageSync('userInfo')
    if(userInfo){
      // 更新userInfo的状态
      this.setData({
        // 读取时要将其重新转为JS对象
        userInfo:JSON.parse(userInfo)
      })
      // 获取用户播放记录
      this.getUserRecentRecord(this.data.userInfo.userId)
    }
  },
  // 获取用户播放记录的功能函数
  async getUserRecentRecord(userId){
    let recentListenListData = await request('/user/record',{uid:userId,type:0})
    // 没有唯一值可以作为key，自己创建key
    let index = 0
    let recentListenList = recentListenListData.allData.map(item=>{
      item.id = index++
      return item
    })
    this.setData({
      recentListenList
    })
  },
  // 手指滑动事件
  handleTouchStart(event) {
    // 手指滑动时取消过渡效果
    this.setData({
      coverTransition: ``
    })
    // 获取手指起始坐标 可能会有多根手指滑动，以第一根手指为准
    startY = event.touches[0].clientY
  },
  handleTouchMove(event) {
    moveY = event.touches[0].clientY
    moveDistance = moveY - startY
    if (moveDistance <= 0) {
      return
    }
    if (moveDistance >= 80) {
      moveDistance = 80
    }
    // 动态更新的coverTransform状态值
    this.setData({
      coverTransform: `translateY(${moveDistance}rpx)`
    })
  },
  handleTouchEnd() {
    // 动态更新的coverTransform状态值
    this.setData({
      coverTransform: `translateY(0rpx)`,
      coverTransition: `transform 1s linear`
    })
  },
  // 点击头像区域跳转到登录界面
  goLogin() {
    wx.navigateTo({
      url: '/pages/login/login'
    })
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
// pages/recommendSong/recommendSong.js
import request from '../../utils/request'
import PubSub from "pubsub-js";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    day: '',
    month: '',
    // 注意初始化数据的类型是数组还是对象，要看对应的后端接口返回的数据来决定
    recommendList: {},
    index: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    // 判断用户登录状态
    let userInfo = wx.getStorageSync('userInfo')
    if (!userInfo) {
      wx.showToast({
        title: '请先登录',
        icon: none,
        success: () => {
          // 跳转至登录界面
          wx.reLauch({
            url: '/pages/login/login'
          })
        }
      })
    }
    // 更新日期
    this.setData({
      day: new Date().getDate(),
      // 外国月份计算比中国慢一个月
      month: new Date().getMonth() + 1
    })
    // 获取推荐列表数据
    this.getRecommendList()

    // 订阅来自songDetail页面发布的消息
    PubSub.subscribe('switchType', (msg, type) => {
      // 第一个参数是事件名，第二个参数是传送的数据
      // console.log(msg,type);
      let { recommendList, index } = this.data
      if (type === 'pre') {
        (index === 0) && (index = recommendList.length)
        index -= 1 
      } else {
        (index === recommendList.length -1 ) && (index = -1)
        index += 1
      }

      // 更新下表
      this.setData({
        index
      }

      )
      let musicId = recommendList[index].id

      // 将musicId回传给songDetail页面
      PubSub.publish('musicId', musicId)

    })
  },

  // 获取推荐列表数据
  async getRecommendList() {
    let recommendListData = await request('/recommend/songs')
    this.setData({
      recommendList: recommendListData.data.dailySongs
    })
  },

  // 跳转至songDetail页面
  toSongDetail(event) {
    // 拿到点击item后传过来的song
    let song = event.currentTarget.dataset.song
    let index = event.currentTarget.dataset.index
    // 把index更新到data中
    wx.navigateTo({
      // 路由跳转传参：只能传query参数
      // 不能直接将song对象作为参数传递，长度过长，会被自动截取
      // url:'/pages/songDetail/songDetail?song=' + JSON.stringify(song)
      url: '/pages/songDetail/songDetail?musicId=' + (song.id)
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
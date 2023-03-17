// pages/video/video.js
import request from '../../utils/request'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    videoGroupList: [],//导航标签数据
    navId: '',//导航标识
    videoList: [],//视频列表标识
    videoId:'',//视频id标识
    videoUpdateTime:[],//记录video播放时长
    isTriggered: false //标识下拉刷新是否被触发
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.getVideoGroupData()
  },
  // 点击搜索跳转到search页面
  toSearch(){
    wx.navigateTo({
      url: '/pages/search/search',
    })
  },
  // 切换导航的回调
  navChange(event) {
    // 通过id向event传参若传的是number会自动转化为string，需要转化一下
    // 通过data-key:value则不会这样
    // 或者>>>0  右移零位，会强制将非number类型转化为number
    let navId = event.currentTarget.id
    this.setData({
      navId: navId * 1,
      // 切换时将原先的videoList重置为空
      videoList:[]
    })
    // 显示加载中  
    wx.showLoading({
      title:'加载中'
    })
    // 动态获取视频列表  传入当前的navId
    this.getVideoList(this.data.navId)

  },
  // 获取视频导航栏数据
  async getVideoGroupData() {
    let videoGroupData = await request('/video/group/list')
    this.setData({
      // slice截取0-13个数据就好
      videoGroupList: videoGroupData.data.slice(0, 14),
      // 设置一上来选中第一个导航
      navId: videoGroupData.data[0].id
    })
    // 获取视频数据(确保有navId后再调用)
    this.getVideoList(this.data.navId)
  },
  // 获取视频数据的回调
  async getVideoList(navId) {
    let videoListData = await request('/video/group', { id: navId })
    // 关闭加载提示
    wx.hideLoading()
    // 以下6行为原来的代码
    // console.log(videoListData);
    // let index = 0
    // let videoList = videoListData.datas.map(item => {
    //   item.id = index++
    //   return item
    // } )
    // 以下为更新后的代码
    let videoList = []
    videoListData.datas.forEach(i => {
      videoList.push({
        id: i.data.vid,
        title: i.data.title,
        creator: i.data.creator,
        commentCount: i.data.commentCount,
        praisedCount: i.data.praisedCount,
        coverUrl: i.data.coverUrl,
        videoUrl: ''
      })
    })

    for (const i of videoList) {
       //promise用了then则不需要用await
       await request('/video/url', {id: i.id}).then(r => {
        i.videoUrl = r.urls[0].url
    });
    }
    this.setData({
      isTriggered: false ,//关闭下拉刷新
      videoList
    })
  },

  // 点击视频播放/继续播放视频的回调
  handlePlay(event){
    let vid = event.currentTarget.id
    // this.vid !== vid && this.videoContext && this.videoContext.stop()
    // this.vid = vid
    // 更新data中videoId的状态数据
    this.setData({
      videoId:vid
    })
    // 创建控制video标签的实例对象
    this.videoContext = wx.createVideoContext(vid)
    // 判断当前视频是否有播放过
    let {videoUpdateTime} = this.data
    let videoItem = videoUpdateTime.find(item => item.vid === vid)
    if(videoItem){
      this.videoContext.seek(videoItem.currentTime)
    }
  },
  // 监听视频播放进度的回调
  handleTimeUpdate(event){
    let videoTimeObj = {vid:event.currentTarget.id,currentTime:event.detail.currentTime}
    let {videoUpdateTime} = this.data
    let videoItem = videoUpdateTime.find(item => item.vid === videoTimeObj.vid)
    if(videoItem){
      videoItem.currentTime = event.detail.currentTime
    }else{
      videoUpdateTime.push(videoTimeObj)
    }

    this.setData({
      videoUpdateTime 
    })
  },
  //播放结束后的回调
  handleEnd(event){
    // 移除记录播放时长数组中当前视频的播放对象
    let {videoUpdateTime} = this.data
    videoUpdateTime.splice(videoUpdateTime.findIndex(item => item.vid === event.currentTarget.id),1)
    this.setData({
      videoUpdateTime
    })
  },
  // 下拉刷新的回调
  handleRefresher(){
    //获取最新视频数据
    this.getVideoList(this.data.navId);
  }
  ,
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
  onShareAppMessage({from}) {
    console.log(from);
    if(from === 'button'){
      return{
        title:'来自button的转发',
        page:'/pages/video/video',
        imageUrl:'/static/images/jay.png'
      }
    }else{
      console.log(from);
      return{
        title:'来自menu的转发',
        page:'/pages/video/video',
        imageUrl:'/static/images/jay.png'
      }
    }
  }
})
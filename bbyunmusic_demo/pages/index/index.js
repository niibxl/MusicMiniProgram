// index/index.js
import request from '../../utils/request'
Page({
  /**
   * 页面的初始数据
   */
  data: {
    // 轮播图数据
    bannerList:[],
    // 推荐歌单数据
    recommend:[],
    // 排行榜数据
    topList:[],
  },
  /**
   * 生命周期函数--监听页面加载
   */
  // ？？？在此改成普通函数后this可用，改成箭头函数后this是undefined，为啥是反过来的？
  onLoad : async function (options)  {
    // 发起网络请求的API
    // wx.request({
    //   // 小程序里需要写完整的url
    //   url: 'http://localhost:3000/banner',
    //   data: {type:2},
    //   // 不写method默认是get
    //   method: 'GET',
    //   success: (result) => {
    //     console.log("请求成功！",result);
    //   },
    //   fail: (err) => {
    //     console.log("请求失败!",err);
    //   },
    // });
    
    //调用封装的功能函数   因其是异步任务，使用await
    let bannerListData = await request('/banner',{type:2})
    // console.log('结果数据：',bannerListData.banners);
    // console.log(this);//this有效
    this.setData({
      bannerList:bannerListData.banners
    })

    // 设置推荐歌单数据的渲染
    let recommendData = await request('/personalized',{limit:12})
    this.setData({
      recommend:recommendData.result
    })

    // 获取排行榜数据
    // 需求分析：
    //   1.需要根据idx的值获取对应的数据
    //   2.idx的取值范围是0-20，实际需要0-4
    //   3.需要发送5次请求
      let index = 0
      let resultArr = []
      while(index < 5){
        let topListData = await request('/toplist/detail',{idx:index++})
        // splice会修改原数组，可以对指定的数组进行增删改
        // slice不会修改原数组
        let topListItem = {name:topListData.list[index].name,tracks:topListData.list[index].tracks.slice(0,3)}
        resultArr.push(topListItem)
        // 更新topList的状态
        this.setData({
          topList:resultArr
        })
      }

  },
  // 点击每日推荐跳转至歌曲推荐页面
  toRecommendSong(){
    wx.navigateTo({
      url:'/pages/recommendSong/recommendSong'
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
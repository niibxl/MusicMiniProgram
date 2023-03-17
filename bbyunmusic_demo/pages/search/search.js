import request from '../../utils/request'
let isSend = false
Page({

  /**
   * 页面的初始数据
   */
  data: {
    placeholderContext:'',
    hotList:[],
    searchContent:'',
    searchList:[],
    historyList:[]

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    // 请求placeholder默认内容
    this.getPlaceholderContent()
    // 请求热搜榜列表的内容
    this.getHotList()

    // 获取历史记录
    this.getSearchHistory()
    // 
  },
  // 获取本地历史记录的功能函数
  getSearchHistory(){
    let historyList = wx.getStorageSync('searchHistory')
    if(historyList){
      this.setData({
        historyList
      })
    }
  },
  // 请求placeholder默认内容
  async getPlaceholderContent(){
    let placeholderData =  await request('/search/default')
    this.setData({
      placeholderContext:placeholderData.data.showKeyword
    })
  },

  // 请求热搜榜列表的内容
  async getHotList(){
    let hotListData = await request('/search/hot/detail')
    this.setData({
      hotList:hotListData.data
    })
  },
  // 搜索框内容模糊匹配
   handleSearch(event){
    console.log(event);
    // 拿到用户搜索输入的内容
    let searchData = event.detail.value.trim()
    this.setData({
      searchContent:searchData
    })
    if(isSend){
      return
    }
    isSend = true
    this.getSearchList()
    // 函数节流
    setTimeout(()=>{
      isSend = false
    },300)

  },
  // 获取搜索数据的功能函数
  async getSearchList(){
    if(!this.data.searchContent){
      this.setData({
        searchList:[]
      })
      return
    }
    let {searchContent,historyList} = this.data
    let searchListData =await request('/search',{keywords:searchContent,limit:10})
    this.setData({
      searchList:searchListData.result.songs
    })

    // 将搜索的关键字添加到历史记录
    // 若本来就有其记录，先删除后再添加到第一个，若没有就直接添加到第一个
    if(historyList.indexOf(searchContent) !== -1){
      historyList.splice(historyList.indexOf(searchContent),1)
    }
    historyList.unshift(searchContent)
 
    // 存储到本地
    wx.setStorageSync('searchHistory',historyList)
  },

  // 点击❌清除表单内容
  cleanSearchContent(){
    this.setData({
      searchContent:'',
      searchList:[]
    })
  },
  // 点击删除图标后删除历史记录和本地存储
  deleteHistory(){
    // 使用模态框API确认
    wx.showModal({
      content:'确认要删除历史记录吗？',
      success:(res)=>{
        console.log(res);
        if(res.confirm){
          this.setData({
            historyList:[],
          })
          wx.removeStorageSync('searchHistory')
        }
      }
    }
    )
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
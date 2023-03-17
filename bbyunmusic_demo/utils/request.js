import config from "./config"
// 封装功能函数，用于发送ajax请求。
// 设置好形参和形参的默认值
export default (url,data={},method='GET') => {
    // new promise 初始化promise实例的状态是pending，调用resolve和reject来改变状态。
    return new Promise((resolve,reject) => {
        // 此处是异步任务
        wx.request({
            url:config.host + url,
            data,
            method,
            // 设置header携带cookies
            header:{
                // 拿到的cookies有多个，只需要找到包含MUSIC_U的就好
                // indexOf方法会先找第一个，若不符合返回-1，要使它一直找到符合的才返回给item
                // 保证get到的cookies有值，不然使用find方法可能报错，所以用三元表达式区分情况
                cookie:wx.getStorageSync('cookies') ? wx.getStorageSync('cookies').find(item => item.indexOf('MUSIC_U')!==-1):''
            },
            success:(res) => {
                // 若为登录请求，存入cookies
                if(data.isLogin){
                    console.log("登录成功",res);
                    wx.setStorage({
                        key:'cookies',
                        data:res.cookies
                    })
                }
                // 此处res包含有cookies,data,header等内容。
                console.log('请求成功：',res);
                console.log(res.cookies);
                
                // 若成功，修改promise的状态为resolved,并把异步数据res.data传出去
                resolve(res.data)
            },
            fail:(err) => {
                console.log('请求失败：',err);
                // 若失败，修改promise的状态为rejected
                reject(err)
            }
        })
    })
}
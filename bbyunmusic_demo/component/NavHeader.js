// component/NavHeader.js
Component({
  /**
   * 组件的属性列表,由组件外部传入的数据，相当于vue中的prop
   */
  properties: {
    // 动态数据在此声明，使用时传入值。
    title:{
      type:String,
      // 没传title值时的默认值
      value:'我是title默认值'
    },
    nav:{
      type:String,
      value:'我是nav默认值'
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {

  }
})

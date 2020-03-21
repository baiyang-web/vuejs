// 负责提供小函数以及vue中常用的过滤器及函数
import dayjs from 'dayjs' // 引入处理日期插件
import relativeTime from 'dayjs/plugin/relativeTime' // 引入相对时间的插件
import 'dayjs/locale/zh-cn' // 引入中文语言包
dayjs.extend(relativeTime) // 写完这个方法 dayjs就有了from方法
// 导出默认对象
export default {
  install (Vue) {
    // 该方法会在vue.use时调用
    // 执行此代码时 Vue.prototype.$notify 应该已经挂载完成
    // 给Vue的原型链赋值一个函数 自定义一个函数名
    Vue.prototype.$bnotify = (params) => Vue.prototype.$notify({ duration: 800, ...params })
    // 自定义一个函数名
    Vue.prototype.$bsleep = sleep // 定义原型属性 $bsleep 这样所有组件就都可以使用这个方法
    // Vue.filter(名称，函数) 起一样名不影响
    Vue.filter('relTime', relTime) // 注册全局过滤器
  }
}
// 定义一个休眠函数 传入500默认值 如果给值就用给的，不给就用500ms默认值
function sleep (time = 500) {
  return new Promise(function (resolve, reject) {
    setTimeout(() => resolve(), time)
  })
}
// 定义一个转化日期的方法
function relTime (date) {
  return dayjs().locale('zh-cn').from(date) // from中的值是日期  dayjs().from(date) 当前时间距离传入时间多久
}

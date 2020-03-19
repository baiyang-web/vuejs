// 负责提供小函数以及vue中常用的过滤器及函数
// 导出默认对象
export default {
  install (Vue) {
    // 该方法会在vue.use时调用
    // 执行此代码时 Vue.prototype.$notify 应该已经挂载完成
    // 给Vue的原型链赋值一个函数 自定义一个函数名
    Vue.prototype.$bnotify = (params) => Vue.prototype.$notify({ duration: 800, ...params })
  }
}

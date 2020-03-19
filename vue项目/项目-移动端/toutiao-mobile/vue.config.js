// 导出一个对象
module.exports = {
  // 需要更改less中变量的配置
  css: {
    loaderOptions: {
      // 所有的关于样式的loader相关的选项
      less: {
        modifyVars: {
          // 直接覆盖变量 变量名不需要@
          blue: '#3296fa'
        }
      }
    }
  }
}

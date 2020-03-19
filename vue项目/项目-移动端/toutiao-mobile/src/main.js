import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import '@/permission' // 权限拦截模式
import Vant from 'vant' // 引入vant组件库
import plugin from '@/utils/plugin' // 引入插件
import 'vant/lib/index.less' // 引入vant组件的样式
import '@/styles/index.less' // 引入自定义的全局样式 覆盖vant的样式
import 'amfe-flexible'
Vue.use(Vant) // 注册Vant的所有组件
Vue.use(plugin) // 需要写在vant全局使用组件方法的后面 因为 plugin里面的方法 this.$notify是vant组件库里面的方法 所以必须等到vant注册完毕
Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')

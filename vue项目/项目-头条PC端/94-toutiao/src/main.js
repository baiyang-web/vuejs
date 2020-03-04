import Vue from 'vue'
import App from './App.vue'
import router from './router'
import ElementUI from 'element-ui' // 引入模块
import 'element-ui/lib/theme-chalk/index.css' // 引入样式
import '@/permission'
import '@/styles/index.less' // 引入样式
import axios from '@/utils/request' // 引入axios
import Components from '@/components'
Vue.config.productionTip = false
Vue.use(ElementUI)
Vue.use(Components)
Vue.prototype.$axios = axios
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')

import Vue from 'vue'
import Vuex from 'vuex'
import * as auth from '@/utils/auth' // 这样就能够使用auth文件中的方法
Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    // 用来放置需要共享的状态
    user: auth.getUser(), // 就是我们token信息的对象
    // 要改token 只能通过mutations
    photo: null // 存放头像
  },
  mutations: {
    // 修改token
    updateUser (state, payload) {
      state.user = payload.user // 定义载荷中的数据
      // 更新vuex的时候 也应该 将最新的数据 存入本地缓存
      auth.setUser(payload.user) // 保持 vuex和本地存储的同步
    },
    // 删除token
    delUser (state) {
      state.user = {} // 将vuex中的token设置为空对象
      // 缓存数据也需要更新
      auth.delUser() // 删除本地缓存中的token
    },
    updatePhoto (state, payload) {
      state.photo = payload.photo // 在载荷中传入photo
    }
  },
  actions: {
  },
  modules: {
  }
})

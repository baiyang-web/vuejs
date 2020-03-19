// 设置导航守卫
import router from '@/router' // 引入路由实例
import store from '@/store' // 引入store对象

// 前置守卫 每当路由发生变化 前置守卫就会执行
router.beforeEach(function (to, from, next) {
  // 需要判断你的请求地址 和你的token
  // 如果是 /user为起始 需要进行对token的判断
  if (to.path.startsWith('/user') && !store.state.user.token) {
    // 需要拦截请求 让它去登录
    next({
      path: '/login', // 要跳转的地址
      query: {
        // path 与 fullPath的区别是 fullPath会带 ?后面的参数 是一个完整路径
        redirectUrl: to.fullPath // 告诉登录页 登录之后进行访问
      }
    })
  } else {
    // 其他的直接放行
    next()
  }
})

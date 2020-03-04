// 处理路由权限
import router from '@/router'
// 注册全局前置守卫
router.beforeEach(function(to,from,next){
    // next() 表示放过
    // 判断你要去的页面是不是以 /home为开头
    if (to.path.startsWith('/home')) {
        const token = window.localStorage.getItem('user-token')
        if (token) {
            next()
        }
        else {
            next('/login') // 回登录页 去拿钥匙
        }
    }
    else {
      // 如果不是去主页相关
      next () // 直接放过
    }
})
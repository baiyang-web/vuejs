import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '@/views/home'
import Login from '@/views/login'
import secondRouter from '@/views/home/secondRouter'
Vue.use(VueRouter)

const routes = [
  {
   path: '/',
   redirect: '/home'
  },
  {
    path: '/home',
    name: 'Home',
    component: Home,
    // children二级路由
    children: [{
      path:'',  // 什么都不写 默认是 一级路由的地址 '/home'
      component: secondRouter
    }]
  },
 {
   path:'/login',
   component: Login,
   name:'login'
 }
  // {
  //   path: '/about',
  //   name: 'About',
  //   // route level code-splitting
  //   // this generates a separate chunk (about.[hash].js) for this route
  //   // which is lazy-loaded when the route is visited.
  //   component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  // }
]

const router = new VueRouter({
  routes
})

export default router

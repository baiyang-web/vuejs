// 设置请求管理工具
import axios from 'axios'
import JSONbig from 'json-bigint' // 引入大数字处理插件
import store from '@/store' // 引入vuex的store实例对象
import router from '@/router'
// axios.defaults 是对原有默认值进行修改
// axios.create() 相当于new了 一个 新的axios实例
const instance = axios.create({
  baseURL: 'http://ttapi.research.itcast.cn/app/v1_0', // 请求的基地址
  transformResponse: [function (data) {
  // data就是后端响应回来的字符串 对数据进行处理
    return data ? JSONbig.parse(data) : {}
  }]
})
// token的注入 应该是在请求之前 也就是请求拦截器
instance.interceptors.request.use(function (config) {
  // 成功的时候 读取配置信息 统一注入token
  if (store.state.user.token) {
    config.headers.Authorization = `Bearer ${store.state.user.token}` // 将token统一注入到headers中
  }
  return config
}, function (error) {
  // 直接返回 promise 错误
  return Promise.reject(error)
})
// 用响应拦截器 处理 返回结果的数据
instance.interceptors.response.use(function (response) {
  // response 实际上已经被 axios 默认包了一层数据 data 是我们之前进行处理过的数据
  try {
    // 如果成功则返回 如果两层数据可以获取 就返回两层
    return response.data.data
  } catch (error) {
    // 如果不行 就只返回一层
    return response.data
  }
}, async function (error) {
  // 如果请求失败 或者 失效 或者其它错误 会进入到响应拦截器额错误区域
  // 只要是401 就是token失效 (应该用导航守卫将没有token的拦截在外面)
  if (error.response && error.response.status === 401) {
    // 给个变量 定义一下
    const path = {
      path: '/login', // 地址
      query: {
        // 需要传递的query参数
        redirectUrl: router.currentRoute.fullPath // 后面是固定写法 表示登录页需要跳转的地址
      }
    }
    // token失效后利用refreshToken去延长用户的登录信息 最长有效期14天
    if (store.state.user.refresh_token) {
      // 如果refresh_token存在 我们需要用refresh 换取新的token 需要调用刷新token的接口
      try {
        // await表示强制把异步代码改为同步代码 需要在其function方法前面加上 async
        // 上面刚定义了一个instance方法 这里不用 必须要用axios 因为 现在的token已经失效 如果用instance 还是会将失效的token注入到headers中
        const result = await axios({
          url: 'http://ttapi.research.itcast.cn/app/v1_0/authorizations', // 这里需要填入完整地址 因为我们用的是axios 上面的基地址是instance的
          method: 'put',
          headers: { Authorization: `Bearer ${store.state.user.refresh_token}` } // 在请求头中注入refresh_token
        })
        // await 后面 就是 promise成功执行的逻辑
        // 如果上面的代码成功执行 就表示此事已经获取了最新的token 此时应该更新vuex中的失效的token
        store.commit('updateUser', {
          // 传入载荷payload数据
          user: {
            token: result.data.data.token,
            refresh_token: store.state.user.refresh_token
          }
        })
        // 把之前错误的请求再次发送出去 这里需要用instance
        return instance(error.config) // 相当于执行之前出错401错误的请求 返回这个请求的目的 是继续执行这个请求执行链下面的内容
      } catch (error) {
        // 如果失败 重新登录 但是在此之前需要删除掉已经失效的token 以及 refresh_token
        store.commit('delUser')
        // 重新跳转到登录页面
        router.push(path)
      }
    } else {
      // 如果没有refresh_token 直接跳转到登录页面 也要提前删除token
      store.commit('delUser')
      router.push(path)
    }
  }
  // 直接返回失败
  return Promise.reject(error) // 返回执行链的catch
})
export default instance

// 对于 axios 进行二次封装
// 配置拦截器
import axios from 'axios'
import router from '@/router'
import JsonBig from 'json-bigint'
axios.defaults.baseURL = 'http://ttapi.research.itcast.cn/mp/v1_0' // 配置公共请求地址

// 对数字进行处理
// transformResponse 中要返回处理的结果
axios.defaults.transformResponse = [function (data) {
    // 这里对id进行处理 当id超出大数字的时候 会出现转换不正确的问题 所以需要借助第三方工具
    return data ? JsonBig.parse(data) : {}
}]
// 请求拦截器
axios.interceptors.request.use(function (config) {
    // 获取钥匙
    const token = localStorage.getItem('user-token')
    config.headers.Authorization = `Bearer ${token}`
    return config
},
    // 失败时会有一个错误 直接reject错误即可
    function (error) {
        return Promise.reject(error) // axios 支持promise
    }
)

//响应拦截器
axios.interceptors.response.use(function (response) {
    return response.data ? response.data : {}
},
    function (error) {
        if (error.response.status === 401) {
            localStorage.removeItem('user-token')  // 把钥匙删除
            router.push('/login')
        }
        return Promise.reject(error)
    }
)
export default axios
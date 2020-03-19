// 专门处理用户相关请求
import request from '@/utils/request' // 引入请求模块
// 导出一个方法
export function login (data) {
  return request({
    // 配置选项
    url: '/authorizations', // 请求地址
    method: 'post',
    data // es6简写
  })
}

// 专门处理用户相关请求
import request from '@/utils/request' // 引入请求模块

// 用户登录
export function login (data) {
  return request({
    // 配置选项
    url: '/authorizations', // 请求地址
    method: 'post',
    data // es6简写
  })
}

// 关注用户
export function followUser (data) {
  return request({
    url: '/user/followings',
    method: 'post',
    data
  })
}

// 取消关注
export function unfollowUser (autid) {
  return request({
    url: `/user/followings/${autid}`,
    method: 'delete'
  })
}

// 获取用户个人信息 粉丝数
export function getUserInfo () {
  return request({
    url: '/user'
  })
}

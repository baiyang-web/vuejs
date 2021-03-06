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

// 获取用户的个人资料
export function getUserProfile () {
  return request({
    url: '/user/profile'
  })
}

// 修改用户头像
export function updatePhoto (data) {
  return request({
    url: '/user/photo',
    method: 'patch',
    data // 里面放body参数
  })
}

// 保存用户信息
export function saveUserInfo (data) {
  return request({
    url: '/user/profile',
    method: 'patch',
    data: { ...data, photo: null }
  })
}

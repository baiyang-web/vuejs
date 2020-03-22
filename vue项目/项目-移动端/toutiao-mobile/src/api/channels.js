import store from '@/store'
// 处理频道数据
import request from '@/utils/request'
const YONGHU = 'yonghu' // 登录用户的key
const YOUKE = 'youke' // 游客用户的key
// 获取我的频道数据 这里需要对此方法进行优化 因为python端 编辑用户接口有问题
export function getMyChannels () {
  return new Promise(function (resolve, reject) {
    const key = store.state.user.token ? YONGHU : YOUKE // key根据当前的登录状态来判断
    const str = localStorage.getItem(key) // 通过缓存key获取缓存中用户的频道数据
    if (str) {
      // 本地缓存有数据
      resolve({ channels: JSON.parse(str) })
    } else {
      request({
        url: '/user/channels'
      }).then(result => {
        // 获取请求结果
        localStorage.setItem(key, JSON.stringify(result.channels))
        resolve(result)
      })
    }
  })
}
// 获取全部频道
export function getAllChannels () {
  return request({
    url: '/channels'
  })
}

// 处理文章模块的请求数据
import request from '@/utils/request'
// 获取文章推荐数据
export function getArticles (params) {
  return request({
    // 这里必须用完整地址 因为之前设置的baseURL是 v1_0
    url: 'http://ttapi.research.itcast.cn/app/v1_1/articles',
    params: { with_top: 1, ...params } // 合并数据
  })
}
// 封装一个不感兴趣文章接口
export function dislikeArticle (data) {
  return request({
    url: '/article/dislikes', // 接口地址
    method: 'post',
    data // 用来存放body参数
  })
}
// 封装一个举报文章接口
export function reportArticle (data) {
  return request({
    url: '/article/reports', // 接口地址
    method: 'post',
    data
  })
}
// 获取联想搜索建议接口
export function getSuggestion (params) {
  return request({
    url: '/suggestion', // 搜索建议地址
    params // 把query参数放置进去
  })
}
// 搜索文章接口
export function searchArticle (params) {
  return request({
    url: '/search',
    params
  })
}

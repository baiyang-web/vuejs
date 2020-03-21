<template>
  <div class="more-action">
    <van-cell-group v-if="!isReport">
      <van-cell @click="$emit('dislike')">不感兴趣</van-cell>
      <van-cell is-link @click="isReport=true">反馈垃圾内容</van-cell>
      <van-cell>拉黑作者</van-cell>
    </van-cell-group>
    <van-cell-group v-else>
      <van-cell icon="arrow-left" @click="isReport=false">返回</van-cell>
      <!-- 注册举报项的点击事件 -->
      <van-cell @click="$emit('report', item.value)" v-for="item in reports" :key="item.value">{{item.label}}</van-cell>
    </van-cell-group>
  </div>
</template>

<script>
import { reports } from '@/api/constants' // 引入常亮变量
import eventbus from '@/utils/eventbus'
export default {
  data () {
    return {
      isReport: false, // 是否举报
      reports // 定义一个变量 这里用es6简写
    }
  },
  created () {
    // 一初始化就要监听
    eventbus.$on('delArticle', () => (this.isReport = false)) // 一执行删除功能 就把弹层中反馈组件重置为初始状态
  }
}
</script>

<style lang="less" scoped>
.more-action {
  border-radius: 4px;
}
</style>

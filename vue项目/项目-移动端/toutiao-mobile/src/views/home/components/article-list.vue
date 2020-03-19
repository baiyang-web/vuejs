<template>
<!-- 放置div的目的 形成滚动条 方便后期操作 -->
  <div class="scroll-wrapper">
      <van-list v-model="upLoading" :finished="finished" @load="onLoad"></van-list>
  </div>
</template>

<script>
export default {
  data () {
    return {
      upLoading: false, // 是否开启上拉加载 默认值false
      finished: false // 是否已经完成说有数据的加载
    }
  },
  methods: {
    onLoad () {
      setTimeout(() => {
        this.finished = true // 表示数据全部加载完毕
      }, 1000)
    }
  }
}
</script>

<style>

</style>

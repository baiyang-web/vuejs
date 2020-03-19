<template>
  <div class="container">
  <!-- 放置tabs组件 -->
   <van-tabs>
  <van-tab :title="item.name" v-for="item in channels" :key="item.id">
  <!-- 封装一个article-list组件 -->
      <article-list :channel_id="item.id"></article-list>
  </van-tab>
</van-tabs>
<!-- 在tabs下放置图标 编辑频道的图标 -->
<span class="bar_btn">
  <van-icon name="wap-nav"></van-icon>
</span>
  </div>
</template>

<script>
import articlelist from './components/article-list'
import { getMyChannels } from '@/api/channels'
export default {
  components: {
    'article-list': articlelist
  },
  data () {
    return {
      channels: [] // 接收频道数据
    }
  },
  methods: {
    async  getChannels () {
      const data = await getMyChannels() // 接收返回的数据结果
      this.channels = data.channels // 将数据赋值给data中的数据
    }
  },
  created () {
    // 直接获取频道数据
    this.getChannels()
  }
}
</script>

<style lang="less" scoped>
.van-tabs {
  height: 100%;
  display: flex;
  flex-direction: column;
  /deep/ .van-tabs__wrap {
    height: 36px;
    padding-right: 36px;
    .van-tab {
      line-height: 36px;
    }
    .van-tabs__line {
      background-color: #3296fa;
      height: 2px;
    }
  }
  /deep/ .van-tabs__content{
    flex: 1;
    overflow: hidden;
  }
  /deep/ .van-tab__pane{
    height: 100%;
    .scroll-wrapper{
      height: 100%;
      overflow-y: auto;
    }
  }
}
.bar_btn {
  width: 36px;
  height: 35px;
  position: absolute;
  top: 0;
  right: 0;
  &::before {
    content: "";
    width: 100%;
    height: 100%;
    position: absolute;
    z-index: 999;
    box-shadow: 0 0 10px #999;
    transform: scale(1, 0.6);
  }
  .van-icon-wap-nav {
    width: 100%;
    height: 100%;
    background: #fff;
    text-align: center;
    line-height: 35px;
    position: relative;
    z-index: 1000;
    &::before {
      font-size: 20px;
    }
  }
}
</style>

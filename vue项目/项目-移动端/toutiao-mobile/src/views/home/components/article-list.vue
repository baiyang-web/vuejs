<template>
<!-- 放置div的目的 形成滚动条 方便后期操作 -->
  <div class="scroll-wrapper">
    <!-- 文章列表 -->
    <!-- 放置下拉刷新组件 -->
    <van-pull-refresh @refresh="onRefresh" v-model="downLoading" :success-text="successText">
        <van-list finished-text="无" v-model="upLoading" :finished="finished" @load="onLoad"></van-list>
      <!-- 这里放置cell单元格组件 -->
      <van-cell-group>
           <!-- item.art_id 此时是一个大数字的对象 v-for 的key需要用字符串或者数字代理 -->
      <van-cell v-for="item in articles" :key="item.art_id.toString()">
      <div class="article_item">
      <!-- 标题 -->
              <h3 class="van-ellipsis">{{ item.title }}</h3>
              <!-- 根据当前的封面类型决定显示单图 三图 还是无图 -->
              <!-- 三图图片 -->
              <div class="img_box" v-if="item.cover.type === 3">
                <!-- 图片组件用的是 vant的组件库中的图片组件 需要使用该组件 进行图片的懒加载 -->
                <van-image class="w33" fit="cover" :src="item.cover.images[0]" />
                <van-image class="w33" fit="cover" :src="item.cover.images[1]" />
                <van-image class="w33" fit="cover" :src="item.cover.images[2]" />
              </div>
              <!-- 单图 暂时隐藏掉单图-->
               <div class="img_box" v-if="item.cover.type === 1">
                 <!-- 单图取第一个 -->
                <van-image class="w100" fit="cover" :src="item.cover.images[0]" />
              </div>
              <!-- 作者信息 -->
              <div class="info_box">
                <span>{{ item.aut_name }}</span>
                <span>{{ item.comm_count }}评论</span>
                <span>{{ item.pubdate }}</span>
                <span class="close">
                  <van-icon name="cross"></van-icon>
                </span>
              </div>
      </div>
      </van-cell>
      </van-cell-group>
       <!-- 循环内容 -->
    </van-pull-refresh>
  </div>

</template>

<script>
import { getArticles } from '@/api/articles'
export default {
  data () {
    return {
      successText: '', // 刷新成功的文本
      downLoading: false, // 是否正在下拉刷新
      upLoading: false, // 是否开启上拉加载 默认值false
      finished: false, // 是否已经完成说有数据的加载
      articles: [], // 文章列表
      timestamp: null // 定义时间戳属性 存储历史时间戳
    }
  },
  props: {
    channel_id: {
      required: true, // 写这个属性的意义代表props必须传
      type: Number,
      default: null // 默认值
    }
  },
  methods: {
    // 定义一个上拉加载方法
    async onLoad () {
      // 放置休眠函数
      await this.$bsleep()
      const data = await getArticles({ channel_id: this.channel_id, timestamp: this.timestamp || Date.now() }) // 短路表达式
      this.articles.push(...data.results) // results后端接口数据 将数据追加到队尾
      this.upLoading = false // 关闭加载状态
      // 将历史时间戳 给timestamp 赋值之前进行判断 判断历史时间是否为0
      if (data.pre_timestamp) {
        // 如果存在历史时间戳
        this.timestamp = data.pre_timestamp
      } else {
        // 没有数据请求的情况
        this.finished = true
      }
    },
    // 定义一个下拉刷新方法
    async onRefresh () {
      // 放置休眠函数
      await this.$bsleep()
      const data = await getArticles({ channel_id: this.channel_id, timestamp: Date.now() }) // 永远传最新的时间戳
      this.downLoading = false
      // 判断最新的时间戳能否换来数据 如果能换来数据 就把新数据整个替换旧数据 如果不能 就给个提示 暂时没有更新
      if (data.results.length) {
        // 如果有返回数据 需要将articles数据全部替换
        this.articles = data.results
        // 此时 之前的全部数据已经被覆盖了
        if (data.pre_timestamp) {
          this.finished = false // 重新启动列表 让其可以继续上拉加载
          this.timestamp = data.pre_timestamp // 记录历史时间戳给变量
        }
        this.successText = `更新了${data.results.length}条数据`
      } else {
        // 给个提示
        this.successText = '当前已是最新数据'
      }
    }
  }
}
</script>

<style lang="less" scoped>
.article_item {
  h3 {
    font-weight: normal;
    line-height: 2;
  }
  .img_box {
    display: flex;
    justify-content: space-between;
    .w33 {
      width: 33%;
      height: 90px;
    }
    .w100 {
      width: 100%;
      height: 180px;
    }
  }
  .info_box {
    color: #999;
    line-height: 2;
    position: relative;
    font-size: 12px;
    span {
      padding-right: 10px;
      &.close {
        border: 1px solid #ddd;
        border-radius: 2px;
        line-height: 15px;
        height: 12px;
        width: 16px;
        text-align: center;
        padding-right: 0;
        font-size: 8px;
        position: absolute;
        right: 0;
        top: 7px;
      }
    }
  }
}
</style>

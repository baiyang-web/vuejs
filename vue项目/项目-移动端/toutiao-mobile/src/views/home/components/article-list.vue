<template>
<!-- 放置div的目的 形成滚动条 方便后期操作 -->
<!-- 阅读记忆 上次阅读到哪里 回来之后不变 -->
  <div class="scroll-wrapper" @scroll="remember" ref="myScroll">
    <!-- 文章列表 -->
    <!-- 放置下拉刷新组件 -->
    <van-pull-refresh v-model="downLoading" @refresh="onRefresh" :success-text="successText">
        <van-list finished-text="没有新数据" v-model="upLoading" :finished="finished" @load="onLoad" class="info">
      <!-- 这里放置cell单元格组件 -->
      <van-cell-group>
           <!-- item.art_id 此时是一个大数字的对象 v-for 的key需要用字符串或者数字代理 -->
           <!-- 给个to属性 跳到对应地址 -->
      <van-cell :to="`/article?artId=${item.art_id.toString()}`" v-for="item in articles" :key="item.art_id.toString()">
      <div class="article_item">
         <!-- 标题 -->
              <h3 class="van-ellipsis">{{ item.title }}</h3>
              <!-- 根据当前的封面类型决定显示单图 三图 还是无图 -->
              <!-- 三图图片 -->
              <div class="img_box" v-if="item.cover.type === 3">
                <!-- 图片组件用的是 vant的组件库中的图片组件 需要使用该组件 进行图片的懒加载 -->
                <van-image lazy-load class="w33" fit="cover" :src="item.cover.images[0]" />
                <van-image lazy-load class="w33" fit="cover" :src="item.cover.images[1]" />
                <van-image lazy-load class="w33" fit="cover" :src="item.cover.images[2]" />
              </div>
              <!-- 单图 暂时隐藏掉单图-->
               <div class="img_box" v-if="item.cover.type === 1">
                 <!-- 单图取第一个 -->
                <van-image lazy-load class="w100" fit="cover" :src="item.cover.images[0]" />
              </div>
              <!-- 作者信息 -->
              <div class="info_box">
                <span>{{ item.aut_name }}</span>
                <span>{{ item.comm_count }}评论</span>
                <!-- 使用过滤器 -->
                <span>{{ item.pubdate | relTime}}</span>
                <span class="close" v-if="user.token" @click.stop="$emit('showAction', item.art_id.toString())">
                  <van-icon name="cross"></van-icon>
                </span>
              </div>
      </div>
      </van-cell>
      </van-cell-group>
      </van-list>
       <!-- 循环内容 -->
    </van-pull-refresh>
  </div>

</template>

<script>
// 引入获取文章模块
import { getArticles } from '@/api/articles'
import { mapState } from 'vuex'
import eventbus from '@/utils/eventbus' // 引入监听事件
export default {
  data () {
    return {
      successText: '', // 刷新成功的文本
      downLoading: false, // 是否正在下拉刷新
      upLoading: false, // 是否开启上拉加载 默认值false
      finished: false, // 是否已经完成说有数据的加载
      articles: [], // 文章列表
      timestamp: null, // 定义时间戳属性 存储历史时间戳
      scrollTop: 0 // 定义滚动的位置
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
      this.downLoading = false // 手动关闭下拉刷新状态
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
    },
    // 记录滚动事件
    remember (event) {
      // 函数防抖 一定时间内点击多少次只执行最后一次
      clearTimeout(this.timer)
      this.timer = setTimeout(() => {
        // 记录当前滚动的位置
        this.scrollTop = event.target.scrollTop
      }, 500)
    }
  },
  // 计算属性
  computed: {
    ...mapState(['user']) // 将user对象映射到计算属性中
  },
  // 初始化函数
  created () {
  // 监听删除文章事件
    eventbus.$on('delArticle', (artId, channelId) => {
      // 判断传过来的频道是否等于自身的频道
      if (channelId === this.channel_id) {
        // 方法findIndex查找索引
        const index = this.articles.findIndex(item => item.art_id.toString() === artId)
        if (index > -1) {
          // 因为下标是从0开始的 所以需要让其大于-1
          this.articles.splice(index, 1) // 删除对应下标的数据
        }
        // 如果把当前页面数据全部删除 重新调用上拉加载方法
        if (this.articles.length === 0) {
          this.onLoad()
        }
      }
    })
    // 监听切换页签事件
    eventbus.$on('changeTab', id => {
      if (id === this.channel_id) {
      //  this.$nextTick() 因为 vue是异步渲染 所以执行该代码时已经完成了上一次的渲染
        this.$nextTick(() => {
          if (this.scrollTop && this.$refs.myScroll) {
            // 当滚动距离不为0时 且滚动元素存在的情况下 才会滚动
            this.$refs.myScroll.scrollTop = this.scrollTop // 添加到固定的滚动位置
          }
        })
      }
    })
  },
  // 触发激活事件
  activated () {
    if (this.$refs.myScroll && this.scrollTop) {
      this.$refs.myScroll.scrollTop = this.scrollTop // 将记录到的位置 滚动到 对应位置
    }
  }
}
</script>

<style lang="less" scoped>
// .info {
//   height: 10px;
// }
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

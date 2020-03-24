<template>
  <div class="container">
 <van-nav-bar @click-left="$router.back()" title="文章详情" left-arrow></van-nav-bar>
  <div class="detail">
      <h3 class="title">{{article.title}}</h3>
      <div class="author">
        <van-image round width="1rem" height="1rem" fit="fill" src="https://img.yzcdn.cn/vant/cat.jpeg" />
        <div class="text">
          <p class="name">{{article.aut_name}}</p>
          <!-- 放置一个过滤器 -->
          <p class="time">{{article.pubdate | relTime}}</p>
        </div>
        <!-- 点击事件 -->
        <van-button :loading="followLoading" @click="follow" round size="small" type="info">{{article.is_followed ? '已关注' : '+关注'}}</van-button>
      </div>
      <div class="content" v-html="article.content">

      </div>
      <div class="zan">
        <van-button round size="small" :class="{active: article.attitude === 1}" plain icon="like-o">点赞</van-button>
        &nbsp;&nbsp;&nbsp;&nbsp;
        <van-button round size="small" :class="{active: article.attitude === 0}" plain icon="delete">不喜欢</van-button>
      </div>
       <!-- 放置comment组件 到 detail内部 因为有padding-->
      <Comment />
    </div>
    <!-- 放置一个遮罩层 -->
    <van-overlay :show="loading">
     <!-- 加载进度条 -->
     <div class="loading-container">
       <van-loading></van-loading>
     </div>
    </van-overlay>
</div>
</template>

<script>
import { getArticleInfo } from '@/api/articles'
import { followUser, unfollowUser } from '@/api/user'
import Comment from './components/comment' // 引入评论组件
export default {
  // 注册组件
  components: {
    Comment
  },
  data () {
    return {
      article: {}, // 接收文章详情数据
      followLoading: false, // 是否正在点击关注
      loading: false // 遮罩层状态
    }
  },
  methods: {
    // 获取文章详情数据
    async getArticle () {
      this.loading = true // 打开遮罩层
      // 获取地址参数
      const { artId } = this.$route.query // 解构读取query参数
      this.article = await getArticleInfo(artId) // 得到文章结果
      this.loading = false // 关闭遮罩层
    },
    //
    async follow () {
      this.followLoading = true
      try {
        // 调用关注与未关注方法 存在就代表已关注 需要取消关注 反之亦然
        if (this.article.is_followed) {
          await unfollowUser(this.article.aut_id) // 后端数据 传入作者id
        } else {
          await followUser({ target: this.article.aut_id })
        }
        // 如果成功 修改对应数据状态
        this.article.is_followed = !this.article.is_followed // 改为相反的状态
        // 给个提示
        this.$bnotify({ type: 'success', message: '关注成功' })
      } catch (error) {
        this.$bnotify({ message: '操作失败' })
      }
    }
  },
  created () {
    this.getArticle() // vue实例化完成时调用
  }
}
</script>

<style lang="less">
.container {
  height: 100%;
  overflow-y: auto;
  box-sizing: border-box;
}
.loading-container {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.van-overlay {
  background: none;
}
.detail {
  padding: 46px 10px 44px;
  .title {
    font-size: 18px;
    line-height: 2;
  }
  .zan{
    text-align: center;
    padding: 10px 0;
    .active{
      border-color:red;
      color: red;
    }
  }
  .author {
    padding: 10px 0;
    display: flex;
    position:sticky;
    background-color: #fff;
    top:46px;
    .text {
      flex: 1;
      padding-left: 10px;
      line-height: 1.5;
      .name {
        font-size: 14px;
        margin: 0;
      }
      .time {
        margin: 0;
        font-size: 12px;
        color: #999;
      }
    }
  }
  .content {
    padding: 20px 0;
    overflow: hidden;
    white-space: pre-wrap;
    word-break: break-all;
    /deep/ img{
      max-width:100%;
      background: #f9f9f9;
    }
    /deep/ code{
      white-space: pre-wrap;
    }
  }
}
</style>

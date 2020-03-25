<template>
  <div class="comment">
    <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad">
      <div class="item van-hairline--bottom van-hairline--top" v-for="comment in comments" :key="comment.com_id.toString()">
        <van-image
          round
          width="1rem"
          height="1rem"
          fit="fill"
          :src="comment.aut_photo"
        />
        <div class="info">
          <p>
            <span class="name">{{comment.aut_name}}</span>
            <span style="float:right">
              <span class="van-icon van-icon-good-job-o zan"></span>
              <span class="count">{{comment.like_count}}</span>
            </span>
          </p>
          <p>{{comment.content}}</p>
          <p>
            <span class="time">{{comment.pubdate | relTime}}</span>&nbsp;
            <!-- 点击回复标签 弹出面板 -->
            <van-tag plain @click="openReply(comment.com_id.toString())">{{comment.reply_count}} 回复</van-tag>
          </p>
        </div>
      </div>
    </van-list>
    <!-- 底部输入框 -->
    <div class="reply-container van-hairline--top">
      <van-field v-model="value" placeholder="写评论...">
        <van-loading v-if="submiting" slot="button" type="spinner" size="16px"></van-loading>
        <span class="submit" v-else slot="button" @click="submit">提交</span>
      </van-field>
    </div>
    <!-- 放置评论的评论 弹出面板 -->
    <!-- 回复 -->
    <!-- 需要在关闭面板的时候,将评论id设置为空 -->
    <van-action-sheet @closed="reply.commentId=null" v-model="showReply" :round="false" class="reply_dialog" title="回复评论">
        <!-- 关闭第一次自动执行load事件  immediate-check  是否在初始化时立即执行滚动位置检查-->
      <van-list @load="getReply" :immediate-check="false" v-model="reply.loading" :finished="reply.finished" finished-text="没有更多了">
        <div class="item van-hairline--bottom van-hairline--top" v-for="item in reply.list" :key="item.com_id.toString()">
          <van-image round width="1rem" height="1rem" fit="fill" :src="item.aut_photo" />
          <div class="info">
            <p><span class="name">{{item.aut_name}}</span></p>
            <p>{{item.content}}</p>
            <p><span class="time">{{item.pubdate | relTime}}</span></p>
          </div>
        </div>
      </van-list>
    </van-action-sheet>
  </div>
  <!-- 都不输入框 -->
</template>

<script>
import { getComments, commentOrReply } from '@/api/articles'
export default {
  data () {
    return {
      // 上拉加载中
      loading: false,
      // 全部加载完毕
      finished: false,
      // 输入的内容
      value: '',
      // 控制提交中状态数据
      submiting: false,
      // 评论数据
      comments: [],
      // 偏移量 分页依据
      offset: null,
      // 控制评论的评论面板是否显示
      showReply: false,
      // 放置面板加载信息
      reply: {
        loading: false, // 评论加载状态
        finished: false,
        offset: null,
        list: [], // 存放评论的评论的数据
        commentId: null // 存放评论id
      }
    }
  },
  methods: {
    // 上拉加载
    async onLoad () {
      const { artId } = this.$route.query
      const data = await getComments({
        type: 'a', // a (文章的评论)
        source: artId, // 查询的谁的评论
        offset: this.offset // 赋值当前的偏移量
      })
      this.comments.push(...data.results) // 将评论数据追加到后面
      this.loading = false
      // end_id 是所有评论或回复的最后一个id  last_id 是本次返回结果的最后一个评论id 所以如果二者相等
      this.finished = data.end_id === data.last_id // id相等表示没有下一页数据
      if (!this.finished) {
        // 表示还有数据
        this.offset = data.last_id
      }
    },
    // 打开回复面板
    openReply (commentId) {
      this.showReply = true
      this.reply.commentId = commentId // 把传过来的参数id赋值给当前id
      this.reply.list = [] // 清空之前的数据
      this.reply.finished = false // 将finish打开
      this.reply.loading = true // 手动打开加载状态
      this.getReply() // 弹出评论的评论的层时 主动的去请求一次数据
    },
    // 获取评论的评论
    async getReply () {
      const data = await getComments({
        type: 'c', // c (评论的评论)
        source: this.reply.commentId, // 获取谁的评论的评论
        offset: this.reply.offset
      })
      this.reply.list.push(...data.results)
      this.reply.loading = false // 关闭加载状态
      this.reply.finished = data.last_id === data.end_id
      if (!this.reply.finished) {
        // 表示还有数据
        this.reply.offset = data.last_id
      }
    },
    // 提交评论
    async submit () {
      if (this.$store.state.user.token) {
        // token存在 表示已经登录
        if (!this.value) return false
        this.submiting = true // 打开提交状态
        await this.$bsleep(800) // 封装的休眠方法
        try {
          // 提交评论核心内容
          const data = await commentOrReply({
            target: this.reply.commentId ? this.reply.commentId : this.$route.query.artId, // 要么是文章id 要么是评论id
            content: this.value, // 评论内容
            art_id: this.reply.commentId ? this.$route.query.artId : null // 如果对评论进行评论 需要传参数 否则不传
          })
          // 如果id存在 表示对评论进行评论
          if (this.reply.commentId) {
            // 评论内容 最新数据从前添加
            this.reply.list.unshift(data.new_obj)
            const comment = this.comments.find(item => item.com_id.toString() === this.reply.commentId) // 找到对应的评论的id
            comment && comment.reply_count++ // 找到的话 把回复数量+1
          } else {
            // 表示对文章进行评论
            this.comments.unshift(data.new_obj)
          }
          this.value = '' // 清空评论内容
        } catch (error) {
          this.$bnotify({ message: '评论失败' })
        }
        this.submiting = false // 状态关闭
      } else {
        try {
          // 否则没登录
          await this.$dialog.confirm({
            message: '如果想要评论,你需要去登录'
          })
          // 点击了确定 需要跳到登录
          this.$router.push({
            path: '/login',
            query: {
              redirectUrl: this.$route.fullPath // fullPath 完整地址
            }
          })
        } catch (error) {
          console.log('点击了取消')
        }
      }
    }
  }
}
</script>

<style lang='less' scoped>
.reply_dialog {
  height: 100%;
  max-height: 100%;
  display: flex;
  overflow: hidden;
  flex-direction: column;
  .van-action-sheet__header {
    background: #3296fa;
    color: #fff;
    .van-icon-close {
      color: #fff;
    }
  }
  .van-action-sheet__content{
    flex: 1;
    overflow-y: auto;
    padding: 0 10px 44px;
  }
}
.comment {
  margin-top: 10px;
  /deep/ .item {
    display: flex;
    padding: 10px 0;
    .info {
      flex: 1;
      padding-left: 10px;
      .name{
        color:#069;
      }
      .zan{
        vertical-align:middle;
        padding-right:2px;
      }
      .count{
        vertical-align:middle;
        font-size:10px;
        color: #666;
      }
      .time{
        color: #666;
      }
      p {
        padding: 5px 0;
        margin: 0;
      }
    }
  }
  /deep/ .van-button:active::before {
    background: transparent;
  }
}
.reply-container {
  position: fixed;
  left: 0;
  bottom: 0;
  height: 44px;
  width: 100%;
  background: #f5f5f5;
  z-index: 9999;
  .submit {
    font-size: 12px;
    color: #3296fa;
  }
}
</style>

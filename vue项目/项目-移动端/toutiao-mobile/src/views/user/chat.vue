<template>
  <div class="container">
   <van-nav-bar @click-left="$router.back()" title="小智同学" left-arrow fixed></van-nav-bar>
   <div class="chat-list" ref="myList">
      <div class="chat-item" :class="{left: item.name === 'xztx', right: item.name !== 'xztx'}" v-for="(item,index) in list" :key="index">
        <!-- 如果是小智说的 头像应该在左边 -->
        <van-image v-if="item.name === 'xztx'" fit="cover" round :src="xz" />
        <div class="chat-pao">{{item.msg}}</div>
        <!-- 如果不等于小智 头像右边 -->
        <van-image  v-if="item.name !== 'xztx'" fit="cover" round :src="photo" />
      </div>
    </div>
    <div class="reply-container van-hairline--top">
      <van-field v-model.trim="value" placeholder="说点什么...">
        <van-loading v-if="loading" slot="button" type="spinner" size="16px"></van-loading>
        <span v-else @click="send" slot="button" style="font-size:12px;color:#999">提交</span>
      </van-field>
    </div>
</div>
</template>

<script>
import Vue from 'vue'
import xz from '@/assets/xz.jpg' // 引入一张图片
import { mapState } from 'vuex'
import io from 'socket.io-client' // 引入socke.io
export default {
  data () {
    return {
      value: '',
      loading: false,
      xz, // 赋值图片地址
      list: [] // 存储聊天记录
    }
  },
  computed: {
    ...mapState(['photo', 'user']) // 引入变量
  },
  // 初始化钩子函数
  created () {
    this.socket = io('http://ttapi.research.itcast.cn', {
      query: {
        token: this.user.token
      }
    })
    this.socket.on('connect', () => {
      this.list.push({ msg: '你好!', name: 'xztx' }) // 加name是为了区分这句话是谁说的
    })
    // 这里监听回复消息
    this.socket.on('message', data => {
      this.list.push({ ...data, name: 'xztx' }) // 添加到列表中
      this.scrollBottom() // 接收消息之后
    })
  },
  methods: {
    // 发送消息方法
    async send () {
      if (!this.value) return false
      this.loading = true // 打开显示状态
      await this.$bsleep(500) // 休眠函数
      const obj = {
        msg: this.value, // 输入的内容
        timestamp: Date.now() // 给个事件戳
      }
      this.socket.emit('message', obj) // 发送消息
      this.list.push(obj)
      this.value = ''
      this.loading = false
      this.scrollBottom() // 发送消息之后
    },
    // 定义一个将内容滚动到底部的方法
    scrollBottom () {
    //  this.$nextTick => Vue的API方法 => 表示 会在数据 更新之后 并且完成了渲染之后执行
    // 这里采用组件实例的方法
      Vue.nextTick(() => {
        this.$refs.myList.scrollTop = this.$refs.myList.scrollHeight // 将滚动条滚动到最底部
      })
    },
    // 在页面销毁之前触发
    beforeDestroy () {
      this.socket.close() // 直接关闭连接
    }
  }
}
</script>

<style lang="less" scoped>
.container {
  height: 100%;
  width: 100%;
  position: absolute;
  left: 0;
  top: 0;
  box-sizing: border-box;
  background:#fafafa;
  padding: 46px 0 50px 0;
  .chat-list {
    height: 100%;
    overflow-y: scroll;
    .chat-item{
      padding: 10px;
      .van-image{
        vertical-align: top;
        width: 40px;
        height: 40px;
      }
      .chat-pao{
        vertical-align: top;
        display: inline-block;
        min-width: 40px;
        max-width: 70%;
        min-height: 40px;
        line-height: 38px;
        border: 0.5px solid #c2d9ea;
        border-radius: 4px;
        position: relative;
        padding: 0 10px;
        background-color: #e0effb;
        word-break: break-all;
        font-size: 14px;
        color: #333;
        &::before{
          content: "";
          width: 10px;
          height: 10px;
          position: absolute;
          top: 12px;
          border-top:0.5px solid #c2d9ea;
          border-right:0.5px solid #c2d9ea;
          background: #e0effb;
        }
      }
    }
  }
}
.chat-item.right{
  text-align: right;
  .chat-pao{
    margin-left: 0;
    margin-right: 15px;
    &::before{
      right: -6px;
      transform: rotate(45deg);
    }
  }
}
.chat-item.left{
  text-align: left;
  .chat-pao{
    margin-left: 15px;
    margin-right: 0;
    &::before{
      left: -5px;
      transform: rotate(-135deg);
    }
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
}
</style>

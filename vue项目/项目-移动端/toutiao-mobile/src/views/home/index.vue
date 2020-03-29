<template>
  <div class="container">
  <!-- 放置tabs组件 -->
   <van-tabs v-model="activeIndex" @change="changeTab">
  <van-tab :title="item.name" v-for="item in channels" :key="item.id">
  <!-- 封装一个article-list组件 -->
      <article-list :channel_id="item.id" @showAction="openAction"></article-list>
  </van-tab>
</van-tabs>
<!-- 在tabs下放置图标 编辑频道的图标 -->
<span class="bar_btn" @click="showChannelEdit = true">
  <van-icon name="wap-nav"></van-icon>
</span>
<!-- 放置一个弹层组件 -->
<van-popup v-model=" showMoreAction" style="width: 80%">
  <!-- $event 是事件参数 自定义事件中 $event 就是自定义事件传出的第一个参数 -->
  <more-action @dislike="dislikeOrReport('dislike',$event)" @report="dislikeOrReport('report',$event)"></more-action>
</van-popup>
<van-action-sheet :round="false" title="编辑频道" v-model="showChannelEdit">
<!-- 放置频道组件 -->
<channel-edit :channels="channels"
@selectChannel="selectChannel"
:activeIndex="activeIndex"
@delChannel="delChannel"
@addChannel="addChannel"
></channel-edit>
</van-action-sheet>
  </div>
</template>

<script>
import articlelist from './components/article-list'
import { getMyChannels, delChannel, addChannel } from '@/api/channels'
import moreAction from './components/more-action'
import { dislikeArticle, reportArticle } from '@/api/articles' // 引入不感兴趣与举报方法
import eventbus from '@/utils/eventbus' // 公共事件处理器
import ChannelEdit from './components/channel-edit' // 引入编辑频道组件
export default {
  components: {
    'article-list': articlelist,
    'more-action': moreAction,
    'channel-edit': ChannelEdit
  },
  data () {
    return {
      channels: [], // 接收频道数据
      showMoreAction: false, // 是否显示弹层 默认不显示组件
      articleId: null, // 用来接收 点击的文章的id
      activeIndex: 0, // 当前默认激活的页面0
      showChannelEdit: false // 是否显示频道编辑组件
    }
  },
  methods: {
    async  getChannels () {
      const data = await getMyChannels() // 接收返回的数据结果
      this.channels = data.channels // 将数据赋值给data中的数据
    },
    // 此方法会在article-list组件触发 showAction的时候 触发
    openAction (artId) {
      this.showMoreAction = true // 开启弹层
      // 存储id
      this.articleId = artId
    },
    // 合并写法 代码重复率较高
    // operatetype 是操作类型 如果是 dislike就是不感兴趣 如果是 report 就是举报
    async dislikeOrReport (operateType, type) {
      // 调用不感兴趣文章接口
      try {
        // 三元表达式
        operateType === 'dislike' ? await dislikeArticle({
          target: this.articleId // 不感兴趣的id
        }) : await reportArticle({ target: this.articleId, type }) // 这里的type通过 上面的$event传出来
        // 下面是成功之后的逻辑
        this.$bnotify({
          type: 'success',
          message: '操作成功'
        })
        // this.channels[this.activeIndex].id 是当前激活的频道数据
        eventbus.$emit('delArticle', this.articleId, this.channels[this.activeIndex].id)
        // 关闭弹层
        this.showMoreAction = false
      } catch (error) {
        this.$bnotify({
          message: '操作失败'
        })
      }
    },
    // 不感兴趣文章
    // async dislike () {
    //   try {
    //     if (this.articleId) {
    //       await dislikeArticle({
    //         target: this.articleId
    //       })
    //       this.$bnotify({
    //         type: 'success',
    //         message: '操作成功'
    //       })
    //       eventbus.$emit('delArticle', this.articleId, this.channels[this.activeIndex].id)
    //       // 关闭弹层
    //       this.showMoreAction = false
    //     }
    //   } catch (error) {
    //     this.$bnotify({
    //       message: '操作失败'
    //     })
    //   }
    // },
    // // 举报文章
    // async reportArticle (type) {
    //   try {
    //   // 调用举报文章接口
    //     await reportArticle({ target: this.articleId, type })
    //     this.$gnotify({
    //       type: 'success',
    //       message: '操作成功'
    //     })
    //     // await下方认为举报成功
    //     // 同样的也要讲举报的文章删除掉
    //     eventbus.$emit('delArticle', this.articleId, this.channels[this.activeIndex].id)
    //     this.showMoreAction = false // 此时关闭弹层
    //   } catch (error) {
    //     // 默认是红色
    //     this.$gnotify({
    //       message: '操作失败'
    //     })
    //   }
    // }
    selectChannel (index) {
      this.activeIndex = index // 将对应频道的索引 设置给当前激活的标签
      this.showChannelEdit = false // 关闭弹层
    },
    // 删除频道的方法
    async delChannel (id) {
      try {
        await delChannel(id) // 调用方法 删除缓存中的数据
        const index = this.channels.findIndex(item => item.id === id) // 找到对应的索引
        if (index <= this.activeIndex) {
          this.activeIndex = this.activeIndex - 1
        }
        // 找到索引之后 删除对应的频道
        this.channels.splice(index, 1)
      } catch (error) {
        this.$bnotify({ message: '删除频道数据' })
      }
    },
    // 添加频道的方法
    async addChannel (channel) {
      await addChannel(channel) // 传入参数 写入缓存
      this.channels.push(channel) // 从后添加数据
    },
    // 切换页签事件
    changeTab () {
      // 广播中传出一个参数 传当前谁被激活了 传出当前激活索引的id 传出去article-list组件需要进行监听
      eventbus.$emit('changeTab', this.channels[this.activeIndex].id)
    }
  },
  created () {
    // 直接获取频道数据
    this.getChannels()
  }
}
</script>

<style lang="less" scoped>
// 处理弹出编辑模板的样式
.van-action-sheet {
  max-height: 100%;
  height: 100%;
  .van-action-sheet__header {
    background: #3296fa;
    color: #fff;
    .van-icon-close {
      color: #fff;
    }
  }
}
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

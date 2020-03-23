<template>
<div class="container">
 <van-nav-bar @click-left="$router.back()" title="搜索中心" left-arrow></van-nav-bar>
  <!-- 导航 -->
  <!-- 搜索组件 -->
    <van-search @search="searchMsg" v-model.trim="q" placeholder="请输入搜索关键词" shape="round" />
    <van-cell-group class="suggest-box" v-if="q">
      <van-cell @click="toResult(item)" icon="search" v-for="(item,index) in suggestList" :key="index">
       {{item}}
      </van-cell>
    </van-cell-group>
    <div class="history-box" v-else>
      <!-- 当历史记录存在的时候才显示 -->
      <div class="head" v-if="historyList.length">
        <span>历史记录</span>
        <!-- 清空所有历史记录操作 -->
        <van-icon name="delete" @click="clear"></van-icon>
      </div>
      <van-cell-group>
        <van-cell @click="toResult(item)" v-for="(item,index) in historyList" :key="index">
          <a class="word_btn">{{item}}</a>
          <!-- 注册点击删除事件 并阻止默认冒泡事件 -->
          <van-icon @click.stop="delHistory(index)" class="close_btn" slot="right-icon" name="cross" />
        </van-cell>
      </van-cell-group>
    </div>
</div>

</template>

<script>
import { getSuggestion } from '@/api/articles'
const key = 'history' // 此key用来作为历史纪律在本地缓存中的key
export default {
  name: 'search',
  data () {
    return {
      q: '', // 关键词的数据
      historyList: [], // 定义历史记录数据
      suggestList: [] // 联想的搜索建议
    }
  },
  // 监听关键词数据q的变化 通过防抖或者节流的方式来降低频率
  watch: {
    // 节流方法
    q () {
      if (!this.timer) {
        this.timer = setTimeout(async () => {
          this.timer = null // 先将标记设置为空
          if (!this.q) {
            this.suggestList = []
            // 如果没有搜索任何东西 直接结束 不再执行下面的代码
            return false
          }
          const data = await getSuggestion({ q: this.q })
          this.suggestList = data.options // options后端给的参数  将返回的值给当前的联想建议
        })
      }
    }
  },
  methods: {
    // 删除历史
    delHistory (index) {
      this.historyList.splice(index, 1) // 删除对应的历史记录数据
      // 数据同步到本地
      localStorage.setItem(key, JSON.stringify(this.historyList))
    },
    // 可以用同一个方法 下面的toResult
    // // 跳转到搜索结果页
    // toSearchResult (text) {
    //   this.$router.push({ path: '/search/result', query: { q: text } })
    // },
    // 清空历史记录
    async clear () {
      try {
        await this.$dialog.confirm({
          title: '提示',
          message: '您确定要删除所有的历史记录吗'
        })
        this.historyList = [] // 清空数据
        localStorage.setItem(key, '[]') // 写入本地缓存
      } catch (error) {
      // 失败不需要进行处理
      }
    },
    // 搜索数据
    searchMsg () {
      if (!this.q) return false
      this.historyList.push(this.q) // 将搜索内容添加到历史记录
      this.historyList = [...new Set(this.historyList)] // 去重
      localStorage.setItem(key, JSON.stringify(this.historyList))
      this.$router.push({ path: '/search/result', query: { q: this.q } })
    },
    // 跳转到结果页
    toResult (text) {
      this.historyList.push(text) // 把点击的记录也加到历史记录中
      this.historyList = [...new Set(this.historyList)] // 去重
      localStorage.setItem(key, JSON.stringify(this.historyList))
      this.$router.push({ path: '/search/result', query: { q: text } })
    }
  },
  // 读取数据
  created () {
    this.historyList = JSON.parse(localStorage.getItem(key) || '[]') // 短路表达式
  }
}
</script>

<style lang="less" scoped>
.history-box {
  padding: 0 20px;
  .head{
    line-height: 36px;
    color: #999;
    .van-icon{
      font-size: 16px;
      float: right;
      margin-top: 10px;;
    }
  }
  .van-cell{
    padding: 10px 0;
  }
  .word_btn{
    color:#3296fa;
  }
  .close_btn{
    margin-top:5px;
    color: #999;
  }
}
.suggest-box{
  /deep/ .van-cell{
    padding: 10px 20px;
    color: #999;
    p{
      span{
        color: red;
      }
    }
  }
}
</style>

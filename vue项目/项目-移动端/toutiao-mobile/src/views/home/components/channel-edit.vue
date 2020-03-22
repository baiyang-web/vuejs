<template>
  <div class="channel-edit">
    <div class="channel">
      <div class="tit">
        我的频道：
        <span class="tip">点击可进入频道</span>
        <van-button v-if="!editing" @click="editing=true" size="mini" type="info" plain>编辑</van-button>
        <van-button v-else @click="editing=false" size="mini" type="danger" plain>完成</van-button>
      </div>
      <!-- 频道循环选项 -->
      <van-grid class="van-hairline--left">
          <!-- 循环渲染我的频道 -->
        <van-grid-item v-for="(item,index) in channels" :key="item.id">
            <!-- 点击频道项的时候把当前点击的频道id传出去 也可以传索引 这里用到子传父的方法-->
          <span class="f12" @click="$emit('selectChannel',index)" :class="{red: index === activeIndex}">{{item.name}}</span>
          <van-icon class="btn" name="cross" v-if="index!==0 && editing" @click="$emit('delChannel',item.id)"></van-icon>
        </van-grid-item>
      </van-grid>
    </div>
    <!-- 可选频道 -->
    <div class="channel">
      <div class="tit">可选频道：</div>
      <van-grid class="van-hairline--left">
        <van-grid-item v-for="item in optionalChannels" :key="item.id">
          <span class="f12">{{item.name}}</span>
          <!-- btn代表+号图标 注册点击事件 触发自定义事件 并且需要传出一个频道对象 -->
          <van-icon class="btn" name="plus" @click="$emit('addChannel',item)"></van-icon>
        </van-grid-item>
      </van-grid>
    </div>
  </div>
</template>

<script>
import { getAllChannels } from '@/api/channels'
export default {
  data () {
    return {
      editing: false, // 正在编辑状态 用这个状态来控制是否显示 删除图标
      allChannels: [] // 定义一个变量 接收全部的数据
    }
  },
  props: {
    channels: {
      required: true, // 代表必须传递
      type: Array, // 类型是数组
      default: () => [] // 返回一个空数组
    },
    activeIndex: {
      required: true,
      type: Number,
      default: 0
    }
  },
  methods: {
    async getAll () {
      const data = await getAllChannels()
      this.allChannels = data.channels // 直接把频道数据赋值给频道
    }
  },
  created () {
    this.getAll() // 调用组件方法
  },
  // 计算属性
  computed: {
    optionalChannels () {
      // 全部频道 - 我的频道 算出可选频道 o是形参 起什么名都可以
      return this.allChannels.filter(item => !this.channels.some(o => o.id === item.id))
    }
  }
}
</script>

<style lang='less' scoped>
.channel-edit {
  .channel {
    padding: 10px;
    .tit {
      line-height: 3;
      .tip {
        font-size: 10px;
        color: #999;
      }
    }
    .van-button {
      float: right;
      margin-top: 7px;
    }
    .btn {
      position: absolute;
      bottom: 0;
      right: 0;
      background: #ddd;
      font-size: 12px;
      color: #fff;
    }
    .f12 {
      font-size: 12px;
      color: #555;
    }
    .red {
      color: red;
    }
  }
}
</style>

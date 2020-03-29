<template>
  <div class="container">
<!-- 导航组件 采用vant组件的导航 fixed表示固定在顶部 -->
<!-- 当页面地址是 /user的时候 应该隐藏掉导航内容 否则不进行隐藏 -->
   <van-nav-bar @click-right="$router.push('/search')" title="头条" right-text="搜索" fixed v-if="$route.path !== '/user'"></van-nav-bar>
<!-- 判断当前的地址 如果是 /user 就给一个 noTop类名 -->
    <div class="my-wrapper" :class="{noTop: $route.path === '/user'}">
    <!-- 使用keep-alive组件包裹 一旦被包裹 路由容器里的组件就不会被销毁 -->
    <keep-alive>
     <router-view></router-view>
    </keep-alive>
    </div>
    <!-- 放置标签栏组件 -->
    <!-- route表示开启路由模式 pc端为router -->
   <van-tabbar route>
    <van-tabbar-item icon="wap-home-o" to="/">首页</van-tabbar-item>
    <van-tabbar-item icon="chat-o" to="/question">问答</van-tabbar-item>
    <van-tabbar-item icon="tv-o" to="/video">视频</van-tabbar-item>
    <van-tabbar-item icon="user-circle-o" to="/user">个人</van-tabbar-item>
   </van-tabbar>
  </div>
</template>

<script>
export default {

}
</script>

<style lang="less" scoped>
.container{
  width: 100%;
  height: 100%;
  position: relative;
  // 控制二级路由容器的高宽
  .my-wrapper{
    width: 100%;
    height: 100%;
    overflow: hidden;
    padding-top: 46px;
    padding-bottom: 50px;
    box-sizing: border-box;
    &.noTop{
      padding-top: 0;
    }
  }
}
</style>

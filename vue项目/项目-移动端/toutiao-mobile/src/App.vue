<template>
  <div id="app">
    <!-- 如果不包裹 就不缓存实例 -->
    <keep-alive>
  <router-view v-if="$route.meta.isAlive"></router-view>
    </keep-alive>
    <router-view v-if="!$route.meta.isAlive"></router-view>
  </div>
</template>

<style lang="less">

</style>

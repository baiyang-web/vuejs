<template>
  <!-- 使用elementUI 面包屑  且设置分隔符 -->
  <el-breadcrumb separator=">">
  <el-breadcrumb-item to="/home">首页</el-breadcrumb-item>
  <el-breadcrumb-item>
  <!-- 动态内容 给一个具名插槽 -->
   <slot name="title"></slot>
  </el-breadcrumb-item>
</el-breadcrumb>
</template>

<script>
export default {

}
</script>

<style>

</style>
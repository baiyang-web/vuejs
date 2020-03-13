<template>
	<el-container>
		<!-- 根据折叠状态进行变化 style对象语法 -->
		<el-aside :style="{width: collapse ? '64px' : '230px'}" style="transition:all 0.3s; background:#2e2f32">
			<!-- 左侧导航组件 -->
		<nav-left :collapse="collapse"></nav-left>
		</el-aside>
		<el-container>
			<el-header>
			 <!-- 顶部操作栏组件 -->
			 <header-top></header-top>
			</el-header>
			<el-main style="padding:0">
				<!-- 这里应该放置二级路由容器 -->
				<router-view></router-view>
			</el-main>
		</el-container>
	</el-container>
</template>

<script>
import eventBus from '@/utils/eventBus'
export default {
	data() {
		return {
			collapse: false // 默认是展开状态
		}
	},
	created() {
		// 切换折叠状态
      eventBus.$on('changeCollapse',() => {
		  this.collapse = !this.collapse // 只要取反 就能和头部的组件的状态对上
	  })
	}
}
</script>

<style>
</style>
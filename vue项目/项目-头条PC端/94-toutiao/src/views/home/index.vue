<template>
	<el-container>
		<el-aside style="width:230px;background:#2e2f32">
			<!-- 左侧导航组件 -->
		<nav-left></nav-left>
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

export default {
	
}
</script>

<style>
</style>
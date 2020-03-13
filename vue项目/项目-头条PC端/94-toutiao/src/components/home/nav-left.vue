<template>
	<div class="nav-left">
		<!-- 头部的图片 -->
		<div class="title">
            <!-- 如果img是动态的 需要把地址转换成变量 -->
            <!-- 如果是折叠 用小图 如果是展开 用大图 -->
			<img :src="collapse ? smallImg : bigImg" alt />
		</div>
		<!-- 导航菜单 并开启路由模式 -->
		<el-menu :collapse="collapse" router background-color="#323745" text-color="#adafb5">
			<!-- index进行页面跳转 -->
			<el-menu-item index="/home">
				<!-- 放置图标 -->
				<i class="el-icon-s-home"></i>
				<span>首页</span>
			</el-menu-item>
			<!-- 放置二级菜单 -->
			<!-- 给两个二级菜单设置不同的index值，避免两个选项同时触发 -->
			<el-submenu index="1">
				<!-- 具名插槽 -->
				<template slot="title">
					<i class="el-icon-s-grid"></i>
					<span>内容管理</span>
				</template>
				<!-- 匿名插槽 -->
				<el-menu-item index="/home/publish">发布文章</el-menu-item>
				<el-menu-item index="/home/articles">内容列表</el-menu-item>
				<el-menu-item index="/home/comment">评论列表</el-menu-item>
				<el-menu-item index="/home/material">素材管理</el-menu-item>
			</el-submenu>

			<el-submenu index="2">
				<template slot="title">
					<i class="el-icon-s-opportunity"></i>
					<span>粉丝管理</span>
				</template>
				<el-menu-item index="/home/picture">图文数据</el-menu-item>
				<el-menu-item index="/home/fansinfo">粉丝概况</el-menu-item>
				<el-menu-item index="/home/fansphoto">粉丝画像</el-menu-item>
				<el-menu-item index="/home/fanslist">粉丝列表</el-menu-item>
			</el-submenu>
			<el-menu-item index="/home/account">
				<i class="el-icon-user-solid"></i>
				<span>账户信息</span>
			</el-menu-item>
		</el-menu>
	</div>
</template>

<script>
export default {
	props: ['collapse'], // 接收父组件传出来的变量
	data() {
		return {
			bigImg: require('../../assets/img/logo_admin.png'),
			smallImg: require('../../assets/img/toutiao.png')
		}
	}
}
</script>

<style lang="less" scoped>
.nav-left {
	background-color: #2e2f32;
	// width: 230px;
	height: 100vh;
	.title {
		text-align: center;
		padding: 10px 0;
		img {
			height: 35px;
		}
	}
	.el-menu {
		border-right: none;
	}
}
</style>
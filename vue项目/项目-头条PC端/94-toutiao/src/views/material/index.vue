<template>
	<el-card v-loading="loading">
		<!-- 放置面包屑 -->
		<bread-crumb slot="header">
			<template slot="title">评论管理</template>
		</bread-crumb>
		<!-- 用el-row方便对样式进行统一设置 -->
		<el-row type="flex" justify="end">
			<!-- el-upload进行文件上传 -->
			<!-- show-file-list	是否显示已上传文件列表 -->
			<!-- http-request 覆盖默认的上传行为，可以自定义上传的实现 -->
			<!-- 上传组件要求必须传action属性 不传就会报错 -->
			<el-upload :show-file-list="false" :http-request="uploadImg" action>
				<el-button size="small" type="primary">上传图片</el-button>
			</el-upload>
		</el-row>
		<!-- 放置标签页 用一个标签来控制两个页面 -->
		<el-tabs v-model="activeName" @tab-click="changeTabs">
			<el-tab-pane label="全部素材" name="all">
				<div class="img-list">
					<!-- 使用v-for对list里的数据进行循环 -->
					<el-card class="img-card" v-for="(item,index) in list" :key="item.id">
						<!-- 放置图片 -->
						<img :src="item.url" alt="" @click="selectImg(index)">
						<!-- 对图标样式进行设置 -->
						<el-row class="operate" type="flex" align="middle" justify="space-around">
							<!-- 放置两个图标   -->
							<i
								@click="collectOrcancel(item)"
								:style="{color: item.is_collected ? 'red' : 'black'}"
								class="el-icon-star-on"
							></i>
							<i @click="delMaterial(item)" class="el-icon-delete-solid"></i>
						</el-row>
					</el-card>
				</div>
			</el-tab-pane>
			<el-tab-pane label="收藏素材" name="collect">
				<div class="img-list">
					<!-- 与上面一样进行循环 -->
					<el-card class="img-card" v-for="(item,index) in list" :key="item.id">
						<img :src="item.url" alt="" @click="selectImg(index)">
					</el-card>
				</div>
			</el-tab-pane>
		</el-tabs>
		<!-- 设置分页组件 -->
		<el-row style="height:80px" type="flex" align="middle" justify="center">
			<el-pagination
				background
				layout="prev, pager, next"
				:total="page.total"
				:current-page="page.currentPage"
				:page-size="page.pageSize"
				@current-change="changePage"
			></el-pagination>
		</el-row>
		<!-- 放置一个dialog组件 -->
		<el-dialog @opened="openEnd" :visible="dialog" @close="dialog=false">
			<!-- 放置一个走马灯组件 -->
			<el-carousel ref="myCarousel" indicator-position="outside" height="400px">
				<!-- 对数据list进行循环 -->
				<el-carousel-item v-for="item in list" :key="item.id">
					<img style="width:100%;height:100%" :src="item.url" alt="">
				</el-carousel-item>
			</el-carousel>
		</el-dialog>
	</el-card>
</template>

<script>
export default {
	data() {
		return {
			activeName: 'all', // 当前激活的页签 默认全部素材
			list: [],
			loading: false,
			page: {
				total: 0, // 总页数
				currentPage: 1, // 当前页码
				pageSize: 2 // 当前能够显示几页
			},
			dialog: false, // 控制显示或隐藏
			diaIndex: -1 // 点击索引
		}
	},
	methods: {
		openEnd() {
			this.$refs.myCarousel.setActiveItem(this.diaIndex) // 设置index 让其能够预览点击的图片
		},
		// 点击图片时调用
		selectImg(index) {
			this.diaIndex = index // 对索引进行赋值
			this.dialog = true // 打开索引
		},
		// 删除素材
		delMaterial(row) {
			this.$confirm('是否删除', '提示').then(() => {
				this.$axios({
					url: `/user/images/${row.id}`,
					method: 'delete'
				})
					.then(() => {
						this.getMaterial()
					})
					.catch(() => {
						this.$message.error('删除失败')
					})
			})
		},
		// 取消或者收藏素材
		collectOrcancel(row) {
			this.$axios({
				url: `/user/images/${row.id}`,
				method: 'put',
				data: {
					collect: !row.is_collected
				}
			})
				.then(() => {
					this.getMaterial()
				})
				.catch(() => {
					this.$message.error('操作失败')
				})
		},
		// 文件上传方法
		uploadImg(params) {
			const data = new FormData() // 实例化一个Formdata对象
			data.append('image', params.file) // 添加参数
			this.$axios({
				url: '/user/images',
				method: 'post',
				data // es6简写方法  data: data 相同时只写一个就可以
			})
				.then(() => {
					this.getMaterial() // 上传文件成功 重新拉取数据
				})
				.catch(error => {
					this.$message.error('上传图片失败')
				})
		},
		// 页码进行切换的时候执行
		changePage(newPage) {
			this.page.currentPage = newPage // 赋值最新页码
			// 重新拉取页面数据
			this.getMaterial()
		},
		// 获取评论数据
		getMaterial() {
			this.loading = true
			this.$axios({
				url: '/user/images',
				// 请求参数
				params: {
					collect: this.activeName === 'collect', // 看当前点击的是哪个标签页
					page: this.page.currentPage,
					per_page: this.page.pageSize
				},
				data: {} // data参数 放的是body参数
			}).then(result => {
				this.list = result.data.results
				this.page.total = result.data.total_count // 对总数进行赋值
				this.loading = false
			})
		},
		// 定义一个页面改变方法
		changeTabs() {
			// 改变标签页的时候使其还原到初始页
			this.page.currentPage = 1
			// 重新拉取数据
			this.getMaterial()
		}
	},
	// 钩子函数 实例化完成时启动 获取数据
	created() {
		this.getMaterial()
	}
}
</script>

<style lang="less">
.img-list {
	display: flex;
	flex-wrap: wrap;
	justify-content: center;
	.img-card {
		width: 220px;
		height: 240px;
		margin: 20px 40px;
		position: relative;
		img {
			height: 160px;
			width: 180px;
		}
		.operate {
			position: absolute;
			left: 0;
			bottom: 0;
			width: 100%;
			background: #f4f5f6;
			height: 30px;
			i {
				font-size: 20px;
			}
		}
	}
}
</style>
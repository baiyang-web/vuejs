<template>
	<el-card class="articles">
		<!-- 放置面包屑组件 -->
		<bread-crumb slot="header">
			<template slot="title">文章列表</template>
		</bread-crumb>
		<!-- 搜素工具栏 筛选 -->
		<!-- 放置一个表单容器 -->
		<el-form style="padding-left:50px">
			<el-form-item label="文章状态">
				<el-radio-group v-model="searchForm.status">
					<el-radio :label="5">全部</el-radio>
					<el-radio :label="0">草稿</el-radio>
					<el-radio :label="1">待审核</el-radio>
					<el-radio :label="2">审核通过</el-radio>
					<el-radio :label="3">审核失败</el-radio>
				</el-radio-group>
			</el-form-item>
			<el-form-item label="频道类型">
				<!-- 下拉选项 -->
				<el-select placeholder="请选择频道" v-model="searchForm.channel_id">
					<el-option v-for="item in channels" :key="item.id" :label="item.name" :value="item.id"></el-option>
				</el-select>
			</el-form-item>
			<!-- 设置日期 -->
			<el-form-item label="日期范围">
				<el-date-picker
					v-model="searchForm.dateRange"
					value-format="yyyy-MM-dd"
					type="daterange"
					start-placeholder="开始日期"
					end-placeholder="结束日期"
				></el-date-picker>
			</el-form-item>
		</el-form>
		<!-- 文章的主体结构 flex布局 -->
		<el-row class="total" type="flex" align="middle">
			<span>共找到20条符合条件的内容</span>
		</el-row>
		<!-- 列表内容 -->
		<div class="article-item" v-for="item in list" :key="item.id.toString()">
			<!-- 左侧内容 -->
			<div class="left">
				<img :src="item.cover.images.length ? item.cover.images[0] : defaultImg" alt />
				<div class="info">
					<span>{{item.title}}</span>
					<!-- 这里采用两个过滤器分别进行处理 -->
					<el-tag :type="item.status | filterType" class="tag">{{item.status | filterStatus}}</el-tag>
					<span class="date">{{item.pubdate}}</span>
				</div>
			</div>
			<!-- 右侧内容 -->
			<div class="right">
				<span @click="toPublish(item.id.toString())">
					<i class="el-icon-edit">修改</i>
				</span>
				<span @click="delMaterial(item.id.toString())">
					<i class="el-icon-delete">删除</i>
				</span>
			</div>
		</div>
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
	</el-card>
</template>

<script>
export default {
	data() {
		return {
			page: {
				total: 0, // 总页数
				currentPage: 1, // 当前页码
				pageSize: 10 // 当前能够显示几页
			},
			// 定义一个表单
			searchForm: {
				status: 5,
				channel_id: null,
				dateRange: []
			},
			channels: [],
			list: [],
			defaultImg: require('../../assets/img/default.gif')
		}
	},
	// watch 监听对象的深度检测方案
	watch: {
		searchForm: {
			deep: true,
			handler() {
				this.page.currentPage = 1 // 只要条件变化 就变成第一页
				this.changeCondition()
			}
		}
	},
	// 过滤器
	filters: {
		filterStatus(value) {
			switch (value) {
				case 0:
					return '草稿'
				case 1:
					return '待审核'
				case 2:
					return '已发表'
				case 3:
					return '审核失败'
			}
		},
		filterType(value) {
			switch (value) {
				case 0:
					return 'warning'
				case 1:
					return 'info'
				case 2:
					return ''
				case 3:
					return 'danger'
			}
		}
	},
	methods: {
		// 点击修改跳转页面
		toPublish(id) {
			this.$router.push(`/home/publish/${id}`)
		},
		// 删除文章
		delMaterial(id) {
			this.$confirm('是否删除', '提示').then(() => {
				this.$axios({
					url: `/articles/${id}`,
					method: 'delete'
				})
					.then(() => {
						this.changeCondition()
					})
					.catch(() => {
						this.$message.error('删除文章失败')
					})
			})
		},
		changePage(newPage) {
			this.page.currentPage = newPage // 赋值最新页码
			this.changeCondition() //直接调用改变事件的方法
		},
		//   改变分类
		changeCondition() {
			const params = {
				page: this.page.currentPage,
				per_page: this.page.pageSize,
				status:
					this.searchForm.status === 5
						? null
						: this.searchForm.status, //5是我们自己虚构的
				channel_id: this.searchForm.channel_id, // 表单数据
				begin_pubdate:
					this.searchForm.dateRange &&
					this.searchForm.dateRange.length
						? this.searchForm.dateRange[0]
						: null,
				end_pubdate:
					this.searchForm.dateRange &&
					this.searchForm.dateRange.length > 1
						? this.searchForm.dateRange[1]
						: null
			}
			// 通过接口传入
			this.getArticels(params) // 直接调用获取文章列表
		},
		// 获取频道数据
		getChannels() {
			this.$axios({
				url: '/channels'
			}).then(result => {
				this.channels = result.data.channels
			})
		},
		// 获取文章列表
		getArticels(params) {
			this.$axios({
				url: '/articles',
				params
			}).then(result => {
				this.list = result.data.results // 获取文章列表
				this.page.total = result.data.total_count // 总数
			})
		}
	},
	created() {
		// 调用获取频道数据
		this.getChannels()
		this.getArticels()
	}
}
</script>

<style lang="less">
.articles {
	.total {
		height: 60px;
		border-bottom: 1px dashed #ccc;
	}
	// 对文章循环项进行样式的编写
	.article-item {
		display: flex;
		justify-content: space-between;
		padding: 20px 0;
		border-bottom: 1px solid #ccc;
		.left {
			display: flex;
			img {
				width: 180px;
				height: 100px;
				border-radius: 4px;
			}
			.info {
				display: flex;
				flex-direction: column;
				height: 100px;
				justify-content: space-around;
				margin-left: 10px;
				.date {
					color: #999;
					font-size: 12px;
				}
				.tag {
					width: 60px;
					text-align: center;
				}
			}
		}
		.right {
			span {
				font-size: 15px;
				margin-right: 8px;
				cursor: pointer;
				user-select: none;
			}
		}
	}
}
</style>
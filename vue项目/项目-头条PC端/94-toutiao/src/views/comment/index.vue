<template>
	<el-card v-loading="loading">
		<!-- 自定义组件 -->
		<bread-crumb slot="header">
			<template slot="title">评论管理</template>
		</bread-crumb>
		<el-table :data="list">
			<el-table-column prop="title" label="标题" width="600"></el-table-column>
			<!-- table中不显示布尔值 需要对齐进行格式化 -->
			<el-table-column :formatter="formatterContent" prop="comment_status" label="评论状态"></el-table-column>
			<el-table-column prop="total_comment_count" label="总评论数"></el-table-column>
			<el-table-column prop="fans_comment_count" label="粉丝评论数"></el-table-column>
			<el-table-column label="操作">
				<!-- 作用域插槽 -->
				<template slot-scope="obj">
					<el-button size="small" type="text">修改</el-button>
					<el-button
						@click="openOrclose(obj.row)"
						size="small"
						type="text"
					>{{obj.row.comment_status ? '关闭' : '打开'}}评论</el-button>
				</template>
			</el-table-column>
		</el-table>
		<!-- 放置一个分页组件 -->
		<el-row style="height:80px" type='flex' align="middle" justify="center">
			<el-pagination background layout="prev, pager, next" 
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
            list: [],
            loading: false
		}
	},
	methods: {
        // 页码改变事件
        changePage(newPage) {
         this.page.currentPage = newPage // 赋值最新页码
         // 重新拉取页面数据
         this.getComment()
        },
		// 获取评论数据
		getComment() {
            this.loading = true // 打开遮罩层
			this.$axios({
				url: '/articles',
				// 请求参数
				params: {
                    response_type: 'comment',
                    page: this.page.currentPage,
                    per_page: this.page.pageSize
				}
			}).then(result => {
                this.list = result.data.results
                this.page.total = result.data.total_count // 对总数进行赋值
                this.loading = false    //   请求完毕  再关闭遮罩层
			})
		},
		// 定义格式化函数
		formatterContent(row, column, cellValue, index) {
			return cellValue ? '正常' : '关闭'
		},
		// 打开或者关闭评论方法
		openOrclose(row) {
			const mesg = row.comment_status ? '关闭' : '打开'
			this.$confirm(`是否确定${mesg}评论`, '提示').then(() => {
				// 调用接口
				this.$axios({
					url: '/comments/status',
					method: 'put',
					params: {
						article_id: row.id.toString() // 要求参数的文章id 将BigNumber类型转化为字符串
					},
					data: {
						allow_comment: !row.comment_status // 和评论状态相反
					}
				})
					.then(() => {
						this.$message.success(`${mesg}评论成功`)
					})
					.catch(() => {
						this.$message.error(`${mesg}评论失败`)
					})
			})
		}
	},
	// 钩子函数
	created() {
		// 调用方法 重新获取数据
		this.getComment()
	}
}
</script>

<style>
</style>
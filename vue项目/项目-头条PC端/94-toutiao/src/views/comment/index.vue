<template>
	<el-card>
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
					<el-button @click="openOrclose(obj.row)" size="small" type="text">{{obj.row.comment_status ? '关闭' : '打开'}}评论</el-button>
				</template>
			</el-table-column>
		</el-table>
	</el-card>
</template>

<script>
export default {
	data() {
		return {
			list: []
		}
    },
    methods:{
        // 获取评论数据
    getComment () {
        this.$axios({
            url: '/articles',
            // 请求参数
            params: {
            response_type: 'comment'
            }
        }).then(result => {
            this.list = result.data.results
        })
    },
    // 定义格式化函数
     formatterContent (row, column, cellValue, index) {
        return cellValue ? '正常' : '关闭'
     },
     // 打开或者关闭评论方法
     openOrclose (row) {
       const mesg = row.comment_status ? '关闭' : '打开'
       this.$confirm(`是否确定${mesg}评论`,'提示').then(() => {
           // 调用接口
           this.$axios({
               url: '/comments/status',
               method: 'put',
               params: {
               article_id: row.id
               },
               data: {
              allow_comment: !row.comment_status  // 和评论状态相反
               }
           }).then(() => {
               this.$message.success(`${mesg}评论成功`)
           }).catch(() => {
              this.$message.error(`${mesg}评论失败`)
           })
       })
     }
    },
    // 钩子函数
    created () {
        // 调用方法 重新获取数据
      this.getComment()
    }
}
</script>

<style>
</style>
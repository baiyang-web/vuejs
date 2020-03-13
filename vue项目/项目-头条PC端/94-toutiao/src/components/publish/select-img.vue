<template>
	<!-- 通过页签形式来显示 -->
	<el-tabs v-model="activeName">
		<el-tab-pane label="素材库" name="material">
			<!-- 查询全部素材 用v-for循环遍历list数据 -->
			<div class="select-image-list">
				<el-card v-for="item in list" :key="item.id" class="img-card">
                    <!-- 显示素材图片 -->
					<img @click="clickImg(item.url)" :src="item.url" alt />
				</el-card>
			</div>
			<!-- 放置分页组件 -->
			<el-row type="flex" justify="center" align="middle" style="height:80px">
				<el-pagination
					background
					layout="prev, pager, next"
					:total="page.total"
					:current-page="page.currentPage"
					:page-size="page.pageSize"
					@current-change="changePage"
				></el-pagination>
			</el-row>
		</el-tab-pane>
        <el-tab-pane label="上传素材" name="upload">
            <!-- 放置一个上传组件 action属性必须给 要不会报错 -->
            <!-- http-request 自定义上传 -->
           <el-upload action="" class="upload-img" :http-request="uploadImg">
             <i class="el-icon-plus"></i>
           </el-upload>
        </el-tab-pane>
	</el-tabs>
</template>

<script>
export default {
	data() {
		return {
			activeName: 'material',
			list: [],
			page: {
				total: 0, // 总页数
				currentPage: 1, // 当前页码
				pageSize: 10 // 当前能够显示几页
			}
		}
	},
	methods: {
		getImg() {
			this.$axios({
				url: '/user/images',
				params: {
					collect: false, // 查询全部的素材 所以这里给一个false
					page: this.page.currentPage,
					per_page: this.page.pageSize
				}
			}).then(result => {
				this.list = result.data.results
				this.page.total = result.data.total_count // 将总数值赋值给页码变量
			})
        },
        // 改变页码
		changePage(newPage) {
			this.page.currentPage = newPage
			this.getImg() // 重新拉取数据
        },
        // 点击图片时触发
        clickImg(url) {
            // 子传父
           this.$emit('selectOne',url) // 将url参数传出去
        },
        // 上传素材
        uploadImg(params) {
			const data = new FormData() // 实例化一个Formdata对象
			data.append('image', params.file) // 添加参数
			this.$axios({
				url: '/user/images',
				method: 'post',
				data // es6简写方法  data: data 相同时只写一个就可以
			})
				.then(result => {
                //   如果成功了 继续往外传参数
                this.$emit('selectOne',result.data.url) 
				})
				.catch(() => {
					this.$message.error('上传素材失败')
				})
		},
	},
	// 钩子函数
	created() {
		this.getImg()
	}
}
</script>

<style lang="less" scoped>
.select-image-list {
	display: flex;
	flex-wrap: wrap;
	justify-content: space-around;
	.img-card {
		width: 150px;
		height: 150px;
		margin: 20px 0;
		img {
			width: 100%;
			height: 100%;
		}
	}
}
.upload-img {
	display: flex;
	justify-content: center;
	i {
		font-size: 20px;
		padding: 50px;
		border: 2px dashed #ccc;
		border-radius: 4px;
	}
}
</style>
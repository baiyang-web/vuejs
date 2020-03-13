<template>
	<el-card>
		<bread-crumb slot="header">
			<template slot="title">发布文章</template>
		</bread-crumb>
		<!-- 放置一个表单组件 -->
		<el-form
			ref="myForm"
			:model="publishForm"
			:rules="publishRules"
			style="margin-left:50px"
			label-width="100px"
		>
			<el-form-item label="标题" prop="title">
				<el-input v-model="publishForm.title" placeholder="请输入您的标题" style="width:60%"></el-input>
			</el-form-item>
			<el-form-item label="内容" prop="content">
				<quill-editor v-model="publishForm.content" style="height:270px"></quill-editor>
			</el-form-item>
			<el-form-item label="封面" prop="cover" style="margin-top:120px">
				<!-- 单选框组 -->
				<el-radio-group v-model="publishForm.cover.type" @change="changeType">
					<el-radio :label="1">单图</el-radio>
					<el-radio :label="3">三图</el-radio>
					<el-radio :label="0">无图</el-radio>
					<el-radio :label="-1">自动</el-radio>
				</el-radio-group>
			</el-form-item>
			<cover-img :list="publishForm.cover.images" @selectTwo="receiveImg"></cover-img>
			<el-form-item label="频道" prop="channel_id">
				<el-select placeholder="请选择频道" v-model="publishForm.channel_id">
					<!-- 对谁循环就在谁的下面写v-for -->
					<el-option v-for="item in channels" :label="item.name" :key="item.id" :value="item.id"></el-option>
				</el-select>
			</el-form-item>
			<el-form-item>
				<el-button @click="publish(false)" type="primary">发表</el-button>
				<el-button @click="publish(true)">存入草稿</el-button>
			</el-form-item>
		</el-form>
	</el-card>
</template>

<script>
export default {
	data() {
		return {
			channels: [], // 接收频道数据
			// 发布表单数据
			publishForm: {
				title: '', // 文章标题
				content: '', // 文章内容
				cover: {
					type: 0,
					images: []
				},
				channel_id: null // 频道id
			},
			// 表单校验规则
			publishRules: {
				title: [
					{
						required: true,
						message: '文章标题不能为空',
						trigger: 'blur'
					},
					{
						min: 5,
						max: 30,
						message: '标题应该在5-30字符之间',
						trigger: 'blur'
					}
				],
				content: [
					{
						required: true,
						message: '文章内容不能为空',
						trigger: 'blur'
					}
				],
				channel_id: [
					{
						required: true,
						message: '频道内容不能为空',
						trigger: 'blur'
					}
				]
			}
		}
	},
	// 监听路由参数的变化
	watch: {
		$route:function (to, from) {
			if (to.params.articleId) {
				// 如果id存在 获取文章数据
				this.getArticelId(to.params.articleId)
			} else {
				// 如果不存在 应该设置表单数据为空
				this.publishForm = {
					title: '',
					content: '',
					cover: {
						type: 0,
						images: []
					},
					channel_id: null // 频道id
				}
			}
		}
	},
	methods: {
		// 接收 cover-img
		receiveImg(url, index) {
			this.publishForm.cover.images.splice(index, 1, url) // 删除替换元素
			// splice(索引，要删除的个数，替换的个数)
		},
		// 改变事件类型
		changeType() {
			// 根据type的值对 images进行控制
			if (this.publishForm.cover.type === 1) {
				// 单图模式
				this.publishForm.cover.images = ['']
			} else if (this.publishForm.cover.type === 3) {
				// 三图模式
				this.publishForm.cover.images = ['', '', '']
			} else {
				this.publishForm.cover.images = [] // 无图或自动时 给个空数组
			}
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
		getArticelId(id) {
			this.$axios({
				url: `/articles/${id}`
			}).then(result => {
				this.publishForm = result.data // 将数据赋值给表单数据
			})
		},
		// 定义一个发布方法
		publish(draft) {
			this.$refs.myForm.validate().then(() => {
				const { articleId } = this.$route.params // 如果id 不为空 就是修改 如果为空就是发布新文章
				this.$axios({
					url: articleId ? `/articles/${articleId}` : '/articles', // 根据场景决定用什么地址
					method: articleId ? 'put' : 'post', // 根据是否上传了参数来决定是提交还是修改
					params: { draft },
					data: this.publishForm
				})
					.then(() => {
						this.$message.success('操作成功')
						// 编程式语言
						this.$router.push('/home/articles') // 跳转到文章内容列表
					})
					.catch(() => {
						this.$message.error('操作失败!!!')
					})
			})
		}
	},
	// 钩子函数 在实例化完成时执行
	created() {
		// 获取频道数据
		this.getChannels()
		// 获取文章数据
		const { articleId } = this.$route.params
		articleId && this.getArticelId(articleId) // 如果前面的数据存在才会执行后面的方法
	}
}
</script>

<style>
</style>
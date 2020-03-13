<template>
	<el-card>
		<!-- 账户信息 -->
		<bread-crumb slot="header">
			<template slot="titile">账户信息</template>
		</bread-crumb>
		<!-- 放置一个表单容器 -->
		<el-form ref="myForm" :model="formData" :rules="formRules" label-width="100px">
			<!-- 表单域 -->
			<el-form-item prop="name" label="用户名">
				<el-input v-model="formData.name" style="width:30%"></el-input>
			</el-form-item>
			<el-form-item label="简介">
            <el-input v-model="formData.intro" style="width:30%"></el-input>
            </el-form-item>
			<el-form-item label="邮箱" prop="email">
            <el-input v-model="formData.email" style="width:30%"></el-input>
            </el-form-item>
			<el-form-item label="手机号">
            <el-input v-model="formData.mobile" style="width:30%"></el-input>
            </el-form-item>
			<el-form-item>
          <el-button type="primary" @click="saveInfo">保存</el-button>
            </el-form-item>
		</el-form>
        <!-- 头像 -->
        <!-- show-file-list 为false 表示不显示上传的文件列表 -->
        <el-upload action="" :http-request="uploadImg" :show-file-list="false">
          <img :src="formData.photo ? formData.photo : defaultImg" alt="" class="head-upload">
        </el-upload>
	</el-card>
</template>

<script>
import eventBus from  '@/utils/eventBus' // 公共领域监听
export default {
	data() {
		return {
			formData: {
				name: '',
				intro: '',
				photo: '',
				email: '',
				mobile: ''
			},
			formRules: {
				name: [
					{
						required: true,
						message: '用户名不能为空',
						trigger: 'blur'
					},
					// min 字符最低 长度 max标识最大长度
					{
						min: 1,
						max: 7,
						message: '用户名的长度为1-7位',
						trigger: 'blur'
					}
				],
				email: [
					{
						required: true,
						message: '邮箱不能为空',
						trigger: 'blur'
					},
					{
						pattern: /^([a-zA-Z]|[0-9])(\w|-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/,
						message: '邮箱格式不正确',
						trigger: 'blur'
					}
				]
			},
			defaultImg: require('../../assets/img/5.jpg') // 头像变量
		}
    },
    methods: {
        // 获取用户个人资料
        getUserInfo() {
           this.$axios({
               url: '/user/profile'
           }).then(result => {
               this.formData = result.data
           })
        },
        saveInfo() {
             this.$refs.myForm.validate().then(() => {
                 this.$axios({
                     url: '/user/profile',
                     method: 'patch',
                     data: this.formData
                 }).then(() => {
					 this.$message.success('保存用户信息成功')
					 // 广播一个消息 updateUser
					 eventBus.$emit('updateUser')
                 }).catch(() => {
                     this.$message.error('保存用户信息失败')
                 })
             })
        },
        // 文件上传方法
		uploadImg(params) {
			const data = new FormData() // 实例化一个Formdata对象
			data.append('photo', params.file) // 添加参数
			this.$axios({
				url: '/user/photo',
				method: 'patch',
				data // es6简写方法  data: data 相同时只写一个就可以
			})
				.then(result => {
					this.formData.photo = result.data.photo  // 拿到新的头像地址  但是头部组件还没有实时更新
					eventBus.$emit('updateUser')
				})
		}
    },
    created() {
        this.getUserInfo()  // 调用方法
    }
}
</script>

<style>
 .head-upload {
    position: absolute;
    right: 350px;
    top:160px;
    width: 200px;
    height: 200px;
    border-radius: 50%;
  }
</style>
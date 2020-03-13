<template>
	<div class="bg">
		<el-card class="card">
			<div class="title">
				<img src="../../assets/img/logo_index.png" alt />
			</div>
			<el-form ref="loginref" :model="loginForm" :rules="loginRules" style="margin-top:20px">
				<el-form-item prop="mobile">
					<el-input v-model="loginForm.mobile" placeholder="请输入手机号"></el-input>
				</el-form-item>

				<el-form-item prop="code">
					<el-input v-model="loginForm.code" placeholder="请输入验证码" style="width:60%"></el-input>
					<el-button plain style="float:right">发送验证码</el-button>
				</el-form-item>

				<el-form-item prop="checked">
					<el-checkbox v-model="loginForm.checked">我已阅读同意用户协议和隐私条款</el-checkbox>
				</el-form-item>

				<el-form-item>
					<el-button @click="login" type="primary" plain style="width:100%">登录</el-button>
				</el-form-item>
			</el-form>
		</el-card>
	</div>
</template>

<script>
export default {
	data() {
		return {
			loginForm: {
				mobile: '',
				code: '',
				checked: false
			},
			loginRules: {
				// required 如果为true表示该字段必填
				mobile: [
					{ required: true, message: '您的手机号不能为空' },
					{
						pattern: /^1[3-9]\d{9}$/,
						message: '您的手机号格式不正确'
					}
				],
				code: [
					{ required: true, message: '您的验证码不能为空' },
					{
						pattern: /^\d{6}$/,
						message: '验证码应该是六位数字'
					}
				],
				checked: [
					{
						// validator 自定义校验
						validator (rule, value, callback) {
							// rule 校验规则
							// value 当前的校验的字段的值
							// callback 回调函数 不论成功或者失败都要执行
							// new Error(错误信息) 就是我们提示的错误信息
							value
								? callback()
								: callback(new Error('您需要同意我们的条款'))
						}
					}
				]
			}
		}
	},
	methods: {
		login() {
			//    this.$refs.loginForm 获取的就是el-form的对象实例 validate自定义验证表单
			this.$refs.loginref.validate().then(() => {
				this.$axios({
					url: '/authorizations',
					data: this.loginForm,
					method: 'post'
				})
					.then(result => {
						// 获取token
						window.localStorage.setItem(
							'user-token',
							result.data.token
						)
						this.$router.push('/home')
					})
					.catch(() => {
						// element-ui 自带的方法 $message 之所以可以用this，因为在main.js中已经进行了全局应用
						this.$message.error('验证码错误')
					})
			})
		}
	}
}
</script>

<style lang="less" scoped>
.bg {
	background-image: url('../../assets/img/3.jpg');
	height: 100vh;
	background-size: cover;
	display: flex;
	justify-content: center;
	align-items: center;
	.card {
		width: 440px;
		height: 340px;
		border-radius: 5px;
		.title {
			text-align: center;
			img {
				height: 50px;
			}
		}
	}
}
</style>

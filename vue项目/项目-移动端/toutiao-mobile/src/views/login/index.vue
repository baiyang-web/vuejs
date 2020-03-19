<template>
  <div class="container">
 <van-nav-bar @click-left="$router.back()" title="登录" left-arrow></van-nav-bar>
 <!-- 登录布局 用vant组件里的 field输入框组件 -->
 <van-cell-group>
   <!-- 登录手机号 -->
  <van-field @blur="checkMobile" :error-message="errMsg.mobile" v-model.trim="loginForm.mobile" label="手机号" placeholder="请输入手机号"></van-field>
  <!-- 验证码 -->
  <van-field @blur="checkCode" :error-message="errMsg.code" v-model.trim="loginForm.code" label="验证码" placeholder="请输入验证码">
    <!-- 插槽内容 -->
    <van-button slot="button" size="small" type="primary">发送验证码</van-button>
  </van-field>
</van-cell-group>
<!-- 登录按钮 -->
<div class="box">
  <van-button @click="login" type="info" round block size="small">登录</van-button>
</div>
</div>
</template>

<script>
import { login } from '@/api/user'
import { mapMutations } from 'vuex'
export default {
  data () {
    return {
      // 表单数据
      loginForm: {
        mobile: '13911111111', // 手机号
        code: '246810' // 验证码
      },
      errMsg: {
        mobile: '', // 手机错误消息
        code: '' // 验证码错误消息
      }
    }
  },
  methods: {
    ...mapMutations(['updateUser']), // 可以导入需要的方法  直接把updateUser方法映射到当前的methods方法中
    // 定义检查手机号方法
    checkMobile () {
      // 判断手机号是否为空 !代表如果手机号为空的时候 给个错误提示
      if (!this.loginForm.mobile) {
        this.errMsg.mobile = '手机号不能为空'
        return false
      } else if (!/^1[3-9]\d{9}$/.test(this.loginForm.mobile)) {
        // 如果手机号不满足正则
        this.errMsg.mobile = '手机号格式不正确'
        return false
      } else {
        this.errMsg.mobile = '' // 代表通过校验 此时没有任何提示
        return true
      }
    },
    // 定义一个检查验证码的方法
    checkCode () {
      if (!this.loginForm.code) {
        this.errMsg.code = '验证码不能为空'
        return false
      } else if (!/^\d{6}$/.test(this.loginForm.code)) {
        this.errMsg.code = '验证码错误'
        return false
      } else {
        this.errMsg.code = ''
        return true
      }
    },
    // 登录校验
    async login () {
      // 校验有个小bug  什么都不输入的情况下点击登录按钮 当手机号校验没有通过的情况下 验证码校验也就不再执行 所以这里需要用变量定义一下
      // 原写法
      // if (this.checkMobile() && this.checkCode()) {
      // }
      const validateMobile = this.checkMobile()
      const validateCode = this.checkCode()
      if (validateMobile && validateCode) {
        // 如果两个都是true 就表示校验通过
        console.log('校验通过')
        try {
          const result = await login(this.loginForm) // 直接传入数据
          this.updateUser({ user: result }) // 更新当前的token 和 refresh_token
          // 判断是否有需要跳转的页面 如果有 就跳转 如果没有 不用管 直接跳转到主页
          const { redirectUrl } = this.$route.query // query 查询参数 是?后面的参数
          this.$router.push(redirectUrl || '/') // 短路表达式 前面成功后面不执行 前面失败 执行后面的
        } catch (error) {
          this.$bnotify({ message: '手机号或验证码错误' })
        }
      }
    }
  }
}
</script>

<style>
.box {
  padding: 20px;
}
</style>

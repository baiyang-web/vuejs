<template>
	<!-- elmentUI布局组件 el-row 和 el-col -->
	<el-row align="middle" type="flex" class="headertop">
		<!-- 等分为两列 -->
		<!-- 左侧列 -->
		<el-col class="left" :span="12">
			<!-- 添加图标 -->
			<i class="el-icon-s-fold"></i>
			<span>江苏传智播客教育科技股份有限公司</span>
		</el-col>
		<!-- 右侧列 -->
		<el-col class="right" :span="12">
			<!-- align属性设置垂直对齐方式 justify设置 水平对齐属性 -->
			<el-row type="flex" justify="end" align="middle">
			    <!-- <img :src="userInfo.photo" alt=""> -->
			    <img src="http://img1.imgtn.bdimg.com/it/u=3342336259,3460647712&fm=26&gp=0.jpg" alt="">
				<!-- 下拉菜单 -->
				<el-dropdown trigger="click" @command="clickMenu">
					<!-- <span>{{userInfo.name}}</span> -->
					<span class="yangshi">白杨</span>
					<el-dropdown-menu slot="dropdown">
						<el-dropdown-item command="info">个人信息</el-dropdown-item>
						<el-dropdown-item command="git">git地址</el-dropdown-item>
						<el-dropdown-item command="lgout">退出</el-dropdown-item>
					</el-dropdown-menu>
				</el-dropdown>
			</el-row>
		</el-col>
	</el-row>
</template>

<script>
export default {
    data () {
        return {
            userInfo:{} // 用户个人信息
        }
    },
    methods: {
     clickMenu (command) {
        if (command === "info") {
          // 证明点击了个人信息
        }
        else if (command === "git") {
          // 跳转到git仓库
          window.location.href = "https://github.com/baiyang-web/vuejs" 
        }
        else {
            window.localStorage.removeItem("user-token")
            this.$router.push("/login")
        }
     },
     // 钩子函数
     created () {
        // 取钥匙 token
        const token  = localStorage.getItem("user-token")
        // 获取用户个人信息
        this.$axios({
            url: "/user/profile",
            // headers里放置请求头参数
            headers: {
                Authorization: `Bearer ${token}`
            }
        }).then(result => {
            // 加载成功 进行赋值
            this.userInfo = result.data.data
        })
     }
    }
}
</script>

<style lang="less" scoped>
  .headertop {
      height: 60px;
      .left {
          i {
              font-size: 20px;
          }
      }
      .right {
          img {
              width: 40px;
              height: 40px;
              border-radius: 50%;
              margin-right: 4px;
          }
          .yangshi {
            background-color: skyblue;
            font-size: 20px;
            // border: 1px solid blue;
            color: #fff;
            // border-radius: 5px;
          }
      }
  }
</style>
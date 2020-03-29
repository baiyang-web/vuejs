<template>
  <div class="container">
 <van-nav-bar @click-right="saveUser" @click-left="$router.back()" title="编辑资料" left-arrow right-text="保存"></van-nav-bar>
  <van-cell-group>
      <van-cell is-link title="头像"  center>
        <van-image
          slot="default"
          width="1.5rem"
          height="1.5rem"
          fit="cover"
          round
          @click="showPhoto=true"
          :src="user.photo"
        />
      </van-cell>
      <van-cell is-link title="名称" @click="showName=true" :value="user.name" />
      <van-cell is-link title="性别" @click="showGender=true" :value="user.gender === 0 ? '男' : '女' "/>
      <van-cell is-link title="生日" @click="showDate" :value="user.birthday" />
    </van-cell-group>
    <!-- 头像弹层 -->
     <!-- 弹层组件 -->
    <van-popup v-model="showPhoto" style="width:80%">
      <!-- 内容 -->
      <!-- 1 本地相册选择图片 -->
      <!-- 2 拍照 -->
       <van-cell @click="fileMsg" is-link title="本地相册选择图片"></van-cell>
       <van-cell is-link title="拍照"></van-cell>
    </van-popup>
     <!-- 昵称弹层 -->
     <!-- :close-on-click-overlay="false" 点击背景关闭弹窗 功能被禁用掉 -->
    <van-popup v-model="showName" style="width:80%" :close-on-click-overlay="false">
       <!-- 编辑用户昵称  双向绑定用户的昵称-->
       <van-field :error-message="nameMsg" v-model.trim="user.name" type='textarea'  rows="4"></van-field>
       <!-- 放置按钮 来关闭确定弹层 -->
       <van-button block type="info" size="large" @click="btnName">确定</van-button>
    </van-popup>
    <!-- 性别弹层 捕获点击上拉菜单选项的事件 -->
    <van-action-sheet @select="selectItem" :actions="actions" v-model="showGender" cancel-text="取消"></van-action-sheet>
    <!-- 生日弹层 -->
    <van-popup v-model="showBirthDay" position="bottom">
      <!-- 选择出生日期  出生日期应该小于现在时间-->
      <!-- type表示 当前的日期类型 年月日 -->
      <!-- confirm  点击完成按钮时触发的事件  cancel  点击取消按钮时触发的事件-->
      <van-datetime-picker
           v-model="currentDate"
           type="date"
          :min-date="minDate"
          :max-date="maxDate"
          @confirm="confirmDate"
          @cancel="showBirthDay=false"
         />
    </van-popup>
    <!-- 放置一个input标签用来上传图片 -->
    <input ref="myFile" @change="upload" type="file" style="display:none">
</div>
</template>

<script>
import dayjs from 'dayjs'
import { getUserProfile, updatePhoto, saveUserInfo } from '@/api/user' // 引入方法
import { mapMutations } from 'vuex'
export default {
  data () {
    return {
      showPhoto: false, // 显示头像弹层:
      showName: false, // 显示昵称弹层
      showGender: false, // 显示性别弹层
      showBirthDay: false, // 控制生日弹层
      minDate: new Date(1900, 1, 1), // 生日组件 选择的最小日期
      maxDate: new Date(), // 最大时间 当前时间
      currentDate: new Date(), // 当弹出层时 显示的时间 是今天
      actions: [{ name: '男' }, { name: '女' }], // 数组 表示弹层中的选项
      nameMsg: '', // 错误信息
      user: {
        // 放置个人资料信息
        name: '', // 用户昵称
        gender: 1, // 性别默认值
        birthday: '1997-12-21', // 生日默认值
        photo: '' // 用户头像
      }
    }
  },
  methods: {
    ...mapMutations(['updatePhoto']), // 引入方法
    // 关闭弹层
    btnName () {
      if (this.user.name.length < 1 || this.user.name.length > 7) {
        // 控制长度
        this.nameMsg = '' // 清空错误信息
        this.showName = false
      }
    },
    // 上拉菜单
    selectItem (item, index) {
      this.user.gender = index
      this.showGender = false
    },
    // 显示生日弹层
    showDate () {
      this.showBirthDay = true // 显示生日弹层
      this.currentDate = new Date(this.user.birthday)
    },
    // 确定生日
    confirmDate () {
      this.user.birthday = dayjs(this.currentDate).format('YYY-MM-DD')
      this.showBirthDay = false // 关闭弹层
    },
    // 获取用户个人资料
    async getProfile () {
      this.user = await getUserProfile()
    },
    // 打开选择文件的对话框 触发点击input标签的动作
    fileMsg () {
      this.$refs.myFile.click()
    },
    // 修改头像
    async upload (params) {
      const data = new FormData()
      data.append('photo', this.$refs.myFile.files[0]) // 第二个参数为 选择的图片文件
      const result = await updatePhoto(data) // 上传头像
      this.user.photo = result.photo // 成功上传的头像设置给当前数据
      // 修改头像成功之后 将修改成功的头像 设置给当前的vuex
      this.updatePhoto({ photo: result.photo })
      this.showPhoto = false // 关闭弹层
    },
    // 保存用户信息
    async saveUser () {
      try {
        await saveUserInfo(this.user) // 传入个人信息资料
        this.$bnotify({ type: 'success', message: '保存成功' })
      } catch (error) {
        this.$bnotify({ message: '保存失败' })
      }
    }
  },
  created () {
    this.getProfile() // 获取用户资料
  }
}
</script>

<style>

</style>

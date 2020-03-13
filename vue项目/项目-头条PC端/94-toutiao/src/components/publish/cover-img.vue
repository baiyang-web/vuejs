<template>
	<div class="cover-image">
		<div v-for="(item,index) in list" :key="index" @click="openDialog(index)" class="cover-image-item">
			<img :src="item ? item : defaultImg" alt="">
		</div>
		<!-- 放置弹层组件 dialog -->
		<el-dialog :visible="dialogVisible" @close="dialogVisible=false">
          <select-img @selectOne="receiveImg"></select-img>
        </el-dialog>
	</div>
</template>

<script>
export default {
	props: ['list'], // 接收传递的参数
	data() {
		return {
            defaultImg: require('../../assets/img/pic_bg.png'), // 默认图片 需要先将其转化为变量
            dialogVisible: false, // 控制弹层的显示或者隐藏
            selectIndex: -1 // 用来记录当前点击了哪个索引
		}
	},
	methods: {
       openDialog(index) {
         this.dialogVisible = true // 开启弹层
         this.selectIndex = index // 记录你当前点击的是哪一张图片
       },
       receiveImg(url) {
        // 再次进行传递 二次传递需要把之前记录的要更改的索引 传出去
          this.$emit('selectTwo',url,this.selectIndex)
          // 关闭弹层
          this.dialogVisible = false
       }
    }
}
</script>

<style lang="less" scoped>
.cover-image {
	display: flex;
	margin: 20px 100px;
	.cover-image-item {
		display: flex;
		border: 1px solid #ccc;
		width: 250px;
		height: 250px;
		padding: 20px;
		justify-content: space-between;
		img {
			width: 100%;
			height: 100%;
		}
	}
}
</style>
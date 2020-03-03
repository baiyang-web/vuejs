<template>
	<!-- 二级路由的默认组件 -->
	<div class="secondRouter">
			<!-- <el-carousel :interval="4000" type="card" height="300px">
				<el-carousel-item v-for="item in list" :key="item">
				 <img :src="item" alt="">
				</el-carousel-item>
			</el-carousel> -->
	</div>
</template>

<script>
export default {
    data () {
        return {
            list: [
               "http://img1.imgtn.bdimg.com/it/u=2230678824,2894042693&fm=26&gp=0.jpg",
               "http://img.pconline.com.cn/images/upload/upc/tx/photoblog/1708/07/c5/54896113_1502091881041.jpg",
               "http://goss1.veer.com/creative/vcg/veer/612/veer-300758904.jpg",
               "http://img2.imgtn.bdimg.com/it/u=1197744312,2566549646&fm=26&gp=0.jpg"
            ]
        }
    }
}
</script>

<style>
.secondRouter {
	/* // css中的 calc算法 vh代表当前可视高度 */
	height: calc(100vh - 60px);
	background-image: url('http://n.sinaimg.cn/sinacn20200201s/88/w1080h608/20200201/81c6-intiarp8126179.jpg');
	background-size: cover;
}
</style>
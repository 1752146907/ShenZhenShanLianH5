<template>
	<div>
		<navBar title="加入社区"></navBar>
		<div class="title">关注官方社区</div>
		<div class="sub">最新动态抢先看，有货、有料、有惊喜</div>
		<div class="main">
			<div class="main-item" @click="handleCommunity(1)">
				<div class="main-item-box">
					<img src="./image/logo.png" alt="">
					<p>UTD公众号</p>
				</div>
			</div>
			<div class="main-item" @click="handleCommunity(2)">
				<div class="main-item-box">
					<img src="./image/weixin.png" alt="">
					<p>UTD生态微信群</p>
				</div>
			</div>
			<div class="main-item" @click="handleCommunity(3)">
				<div class="main-item-box">
					<img src="./image/weibo.png" alt="">
					<p>UTD生态微博</p>
				</div>
			</div>
		</div>
		<!--图片预览-->
		<!--<van-overlay :show="showImagePreview" @click="showImagePreview = false"></van-overlay>
		<img v-if="showImagePreview && showIndex == 1" class="mask-code" src="./image/code-logo.png" />
		<img v-if="showImagePreview && showIndex == 2" class="mask-code" src="./image/code-weixin.png" />-->
		<van-image-preview
				:startPosition="startPosition"
				v-model="showImagePreview"
				:images="ImagePreview"
				@change="onChange" />
	</div>
</template>

<style scoped>
	.van-overlay{
		z-index: 999 !important;
	}
</style>
<style src="./index.css" scoped></style>

<script>
	import navBar from '../../../component/navBar';
	import { Overlay, ImagePreview  } from 'vant';
	import application from '../../../common/application';

	export default {
		components: {
			navBar,
			Overlay,
			ImagePreview
		},
		data: () => ({
			showImagePreview: false,
			showIndex: 1,
			startPosition: 0,				// 图片预览索引
			ImagePreview: [
							 application.imageHost + 'image/code-logo.png',
							 application.imageHost + 'image/code-weixin.png'
						 ]
		}),
		created () {
		},
		mounted() {

		},
		// 设置路由钩子，存储页面来源
		beforeRouteEnter(to, from, next) {
			next(vm=>{          //  这里的vm指的就是vue实例，可以用来当做this使用
				sessionStorage.setItem('url_from', from.path);
			})
		},
		methods: {
			handleCommunity(index) {
				switch(index) {
					case 1:
						this.startPosition = 0;
						this.showImagePreview = true;
						this.showIndex = index
						break;
					case 2:
						this.startPosition = 1;
						this.showImagePreview = true;
						this.showIndex = index
						break;
					default:
						window.location.href = 'https://weibo.com/William988'
				}
			}
		}
	}
</script>

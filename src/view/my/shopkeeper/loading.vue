<template>
	<div>
		<navBar :title="name"></navBar>
		<!--资产划转 退到资产明细-->
		<span v-if="type == 'integral'" @click="handleCencal" style='position: fixed;top: 0px;left: 0px;width: 44px;height: 44px;z-index: 100'></span>
		<div class="shopkeeper" v-if="type == 'shopkeeperLoading'">
			<img style="width: 216px;margin-top: 132px;" src="./image/status01.png" alt="">
			<p class="shopkeeper-title">认购成功</p>
			<p class="shopkeeper-sub">
<!--				系统正在为您开通店主权益-->
			</p>
<!--			<img src="./image/bg.png" alt="">-->
		</div>
		<div class="shopkeeper" v-if="type == 'integral'">
			<img style="width: 216px;margin-top: 132px;" src="./image/status01.png" alt="">
			<p class="shopkeeper-title">转账申请已提交</p>
			<p class="shopkeeper-sub">
				客服小姐姐将在一个工作日内为您审核~
			</p>
<!--			<img src="./image/bg.png" alt="">-->
		</div>
		<div class="from-submit" v-if="type == 'integral'" @click="handleCencal">确定</div>
	</div>
</template>

<style src="./loading.css" scoped></style>

<script>
	import mixins from '../../../common/mixin';
	import navBar from '../../../component/navBar';
	import { Toast, Dialog } from 'vant';

	export default {
		components: {
			navBar,
			Dialog,
			Toast
		},
		mixins: [mixins],
		data: () => ({
			type: '',
			name: ''
		}),
		created () {
			this.name = this.$route.query.name;
			this.type = this.$route.query.type;
		},
		// 设置路由钩子，存储页面来源
		beforeRouteEnter(to, from, next) {
			next(vm=>{          //  这里的vm指的就是vue实例，可以用来当做this使用
				sessionStorage.setItem('url_from', from.path);
			})
		},
		mounted () {
		},
		methods: {
			handleCencal: function () {
				this.$router.go(-2);
			}
		}
	}
</script>

<template>
	<div v-if="isLoadSuccess">
		<div class="shopkeeperImg" >
			<i class="bar-back van-icon van-icon-arrow-left" style="font-size: 20px;" @click="shopkeeperImg"><!----></i>

		缤纷集店主
		</div>
		<div class="shopkeeper-list-select">
			<div class="shopkeeper-select">
				<div class="shopkeeper-select-color"><router-link to='/creation'>创世店主</router-link></div>
			<div><router-link to='/family'>家庭店主</router-link></div>
			</div>
		</div>
		<div class="shopkeeper">
			<div>
				<router-view></router-view>
			</div>
		</div>
		<!--图片预览-->
	</div>
</template>

<style src="./index.css" scoped>

</style>

<script>
	import mixins from '../../../common/mixin';
	import navBar from '../../../component/navBar';
	import { Toast, Dialog, Popup } from 'vant';

	export default {
		components: {
			navBar,
			Dialog,
			Toast,
			Popup
		},
		mixins: [mixins],
		data: () => ({
			isLoadSuccess: false,			// 页面是否完成加载
			warrant: {},					// 加载回来的数据
			account: '',					// 登录用户手机
			showImagePreview: false  		// 是否显示图片预览
		}),

		created () {

		},
		// 设置路由钩子，存储页面来源
		beforeRouteEnter(to, from, next) {
			next(vm=>{          //  这里的vm指的就是vue实例，可以用来当做this使用
				sessionStorage.setItem('url_from', from.path);
			})
		},
		mounted () {
			this.handleLoad();
			this.account = this.$route.query.account;
		},
		methods: {

			//	预览图片
			onChange(index) {
				this.showImagePreview = true;
			},
			// 初始化信息
			handleLoad: function() {
				this.request({
					url: 'api/warrant',
					method: 'GET',
					data: {
					    type:1
					},
					success: (response) => {

						this.warrant = response;
						this.isLoadSuccess = true;


					},
					error: (response) => {

					},
					complete: (response) => {
						Toast.clear();
					}
				});
			},
			// 手机号码加密
			handlePhoneEncryption: function(phone, phone2) {
				var tel = phone;
				var tel2 = phone2;
				tel = "" + tel;
				tel2 = "" + tel2;
				var reg=/(\d{3})\d{4}(\d{4})/;
				var tell1 = tel.replace(reg, "$1****$2");
				var tell2 = tel2.replace(reg, "$1****$2");

				this.account = tell1;
				this.warrant.superior.phone = tell2;
			},
            shopkeeperImg:function () {
                this.$router.replace({
                    path: '/plus',

                });
            },
			handleSubmit: function() {
				// 余额充足就正常支付，不足就跳去钱包首页充值
				if(Number(this.warrant.wallet.astir_currency) < Number(this.warrant.amount)) {
                    Dialog.alert({
                        title: '支付失败',
                        message: '可用' + this.warrant.currency.short + '不足',
                        confirmButtonColor: '#456DE7'
                    }).then(() => {
                        // on confirm
                        // this.$router.push({
                        //  path: '/walletRecharge',
                        //  query: {
                        //   title: this.warrant.currency.short,
                        //   id: this.warrant.currency.id
                        //  }
                        // });
                    });
                } else {
					// 余额充足 抢购
					Dialog.confirm({
						title: '支付',
						message: '应付' + this.warrant.amount + this.warrant.currency.short,
						confirmButtonColor: '#456DE7'
					}).then(() => {
						// on confirm
						this.handleShopping();
					}).catch(() => {
						// on cancel
					});
				}
			},
			handleShopping: function() {
				this.request({
					url: 'api/warrant',
					method: 'POST',
					data: { },
					success: (response) => {
						this.$toast.center('认购成功');

                        this.$router.replace({
                            path: '/shopkeeperLoading',
                            query: {
                                name: '缤纷集店主',
                                type: 'shopkeeperLoading'
                            }
                        });
					},
					error: (response) => {
					},
					complete: () => {
					}
				});
			}
		}
	}
</script>

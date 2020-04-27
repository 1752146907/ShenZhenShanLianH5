<template>
   <div class="my">
       <div class="my-title">我的</div>
       <div class="my-info">
           <img src="./image/avatar.png" alt="">
           <div><span>{{userInfo.account}}</span></div>
       </div>
       <div class="my-item address" @click="takeSkip">
           <img src="./image/write.png" alt="">
           <div><span>收货地址</span></div>
           <i class="van-icon van-icon-arrow" style="color: #333333; font-size: 18px;"><!----></i>
       </div>
       <div class="my-item" @click="">
           <img src="./image/service.png" alt="">
           <div><span>联系客服</span></div>
           <i class="van-icon van-icon-arrow" style="color: #333333; font-size: 18px;"><!----></i>
       </div>

       <Footer :active="2" />
   </div>
</template>
<style src="./index.css" scoped></style>
<script>
    import { Toast } from 'vant';
    import mixins from '../../../../common/mixin';
    import Footer from '../component/footer/footer';


    export default {
        components: {
            Toast,
            Footer
        },
        mixins: [mixins],

        data: () => ({
			userInfo: {}
        }),
        // 设置路由钩子，存储页面来源
        beforeRouteEnter(to, from, next) {
            next(vm=>{          //  这里的vm指的就是vue实例，可以用来当做this使用
                sessionStorage.setItem('url_from', from.path);
            })
        },
        created () {

        },
        mounted() {
			this.handleGetUserInfo();
        },
        methods: {
            takeSkip:function () {
              this.$router.push({
                  path:"/plus/shopx/address"
              })
            },
			// 初始化用户信息
			handleGetUserInfo: function() {
				this.request({
					url: 'api/user',
					method: 'GET',
					data: { },
					success: (response) => {
						this.userInfo = response;
						// 手机号加密
						var tel = this.userInfo.account;
						this.userInfo.tel = this.userInfo.account;
						tel = "" + tel;
						var reg=/(\d{3})\d{4}(\d{4})/;
						this.userInfo.account = tel.replace(reg, "$1****$2");
					},
					error: (response) => {

					},
					complete: (response) => {
						
					}
				});
			}
        }
    }
</script>

<style scoped>

</style>

<template>
	<div class="integral-content">
		<navBar title="资产划转"></navBar>
		<div class="more" @click="handleRecord"><img src="../image/integral_ico.png"/></div>

		<div class="integral">
			<div class="integral-box">
				<div class="from">
					<img src="../image/bfj_logo.png"/> <b>缤纷集UTD数量</b><div class="available"> <countTo :startVal='0' :decimals="2" :endVal='Number(freezeIntegral ? freezeIntegral : 0)' :duration='1'></countTo></div>
				</div>
			</div>
			<div class="arrowhead-icon">
				<span class="arrowhead"></span>
				<van-icon name="arrow-down"/>
			</div>
			<div class="integral-box">
				<div class="from">
					<img src="../image/utd_logo.png"/>
					<input type="number" v-model="integralNumber" placeholder="输入划转数量" >
					<span @click="handleAll" style="color:rgba(41, 66, 151, 1)">全部</span>
				</div>
			</div>
		</div>
		<div class="incoming">
			<p><countTo :startVal='0' :decimals="2" :endVal='Number(integralNumber)' :duration='1'></countTo></p>
			<span>到账数量</span>
		</div>
		<div class="tisp">
			<p>最小划转数量为: 1.00 UTD。</p>
			<p>账户间的划转不收取手续费。</p>
			<p>划转资产实时到账，划转过程不可逆。</p>
			<p>请务必确认电脑及浏览器安全，防止信息被篡改或泄露。</p>
		</div>
		<div class="from-submit" @click="handleSublim">划转</div>

	</div>
</template>

<style src="./index.css" scoped></style>

<script>
    import { Toast } from 'vant';
    import mixins from '../../../common/mixin';
    import navBar from '../../../component/navBar';
    import countTo from 'vue-count-to';

    export default {
        components: {
            Toast,
            navBar,
            countTo
        },
        mixins: [mixins],
        data: () => ({
            integralNumber: null,
            freezeIntegral: null
        }),
        created () {
            this.handleGetUserInfo();
        },
        // 设置路由钩子，存储页面来源
        beforeRouteEnter(to, from, next) {
            next(vm=>{          //  这里的vm指的就是vue实例，可以用来当做this使用
                sessionStorage.setItem('url_from', from.path);
            })
        },
        methods: {
            // 初始化用户信息
            handleGetUserInfo: function() {
                this.request({
                    url: 'api/user',
                    method: 'GET',
                    data: { },
                    success: (response) => {
                        this.freezeIntegral = Number(response.binfenji.current_integral);
                    },
                    error: (response) => {

                    },
                    complete: (response) => {
                        Toast.clear();
                    }
                });
            },
            // 选择全部
            handleAll: function() {
                this.integralNumber = Number(this.freezeIntegral);
            },
            // 提交划转
            handleSublim: function() {
                if(Number(this.integralNumber) <= 0) {
                    this.$toast.center('划转数量过小');
                    return false;
                }
                this.request({
                    url: 'api/transfer',
                    method: 'POST',
                    data: {
                        nums: Number(this.integralNumber)
                    },
                    success: (response) => {
                        this.$toast.center('划转成功');

                        this.freezeIntegral -=  Number(this.integralNumber);
                        this.integralNumber = 0;

                        this.handleBack();
                        // this.$router.replace({
                        //     path: '/shopkeeperLoading',
                        //     query: {
                        //         name: '资产划转',
                        //         type: 'integral'
                        //     }
                        // });
                    },
                    error: (response) => {

                    },
                    complete: () => {
                        Toast.clear();
                    }
                });
            },
            // 划转记录
            handleRecord: function() {
                this.$router.push({
                    path: '/myRecord',
                    query: {}
                });
            }
        }
    }
</script>

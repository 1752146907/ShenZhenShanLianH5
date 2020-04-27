<template>
	<div>
		<navBar title="自治委员会"/>
		<div class="committee">
			<div class="committeeCard">
				<div class="committeeCard-box">
					<span class="code" >{{isCommittee ? '编号：' + committeeCode : ''}}</span>
					<img v-if="!isCommittee" src='./image/committeecard.png' alt="">
					<img v-else src='./image/committeecard_active.png' alt="">
				</div>
			</div>
			<div class="lable">
				<div class="lable-box">
					<div class="lable-item has-border" @click="handleOrangeBook">
						<div class="right">
							橙皮书
						</div>
						<div class="arr">
							<van-icon color="#333333" size="18px" name="arrow" />
						</div>
					</div>
					<div class="lable-item has-border">
						<div class="right">
							成员数量
						</div>
						<div class="arr">
							<span>{{committee_member}}人</span>
						</div>
					</div>
					<div class="lable-item has-border" @click="">
						<div class="right">
							{{isCommittee? '锁仓':'未锁仓'}}
						</div>
						<div class="arr">
							<span><countTo :startVal='0' :decimals="2" :endVal='Number(userInfo.lock_number? userInfo.lock_number:0)' :duration='1'></countTo> UTD</span>
						</div>
					</div>
					<div class="lable-item" @click="handleIncomeList">
						<div class="right">
							收益
						</div>
						<div class="arr">
							<span><countTo :startVal='0' :decimals="2" :endVal='Number(income)' :duration='1'></countTo> UTD</span>
							<van-icon v-if="isCommittee" color="#333333" size="18px" name="arrow" />
						</div>
					</div>
				</div>
			</div>
			<div class="join" v-if="!isCommittee" @click="showPopup">
				立即加入
			</div>
			<div class="join" v-if="isCommittee" @click="showPopup">
				加入社区
			</div>
		</div>
		<van-popup
				v-if="!isCommittee"
				v-model="popup"
				round
				position="bottom"
				:style="{ height: '308px' }"
		>

			<div class="defrayal-one">
				<div class="defrayal">
					<p>UTD支付</p >
					<p @click="hidePopup">取消</p >
				</div>
			</div>
			<div class="defrayal-one">
				<div class="identifier">
					<p>可用余额</p >
					<p><countTo :startVal='0' :decimals="2" :endVal='Number(available)' :duration='1'></countTo>UTD</p >
				</div>
			</div>
			<div class="defrayal-two defrayal-one">
				<div class="payoff">
					<p>支付费用</p >
					<p><countTo :startVal='0' :decimals="2" :endVal='Number(order.amount)' :duration='1'></countTo> UTD</p >
				</div>
				<div class="identifying" v-if="handle">
					<input type="text" @blur="scrollBack" @input="handleGetStatus" v-model="code" placeholder="请输入验证码"/>
					<p class="text" @click="handleGetCode" v-if="!isCode">获取验证码</p>
					<p class="identifying-right" v-else>{{codeTime}}S</p>
				</div>

			</div>

			<div class="affirm" v-if="!isActivw">{{usable}}</div>
			<div class="affirm-active" v-else @click="handleJoinCommittee">确认支付</div>

		</van-popup>
		<Popup v-model="popup" v-if="isCommittee" class="community-info">
			<img src="./image/communityinfo.png" alt="">
		</Popup>
	</div>
</template>

<style src="./index.css" scoped></style>

<script>
	import { Toast, Dialog, Popup} from 'vant';
	import mixins from '../../../common/mixin';
	import navBar from '../../../component/navBar';
    import countTo from 'vue-count-to';

	export default {
		components: {
			navBar,
			Toast,
			Dialog,
			Popup,
            countTo
		},
		mixins: [mixins],
		data: () => ({
			userInfo: {},
			popup: false,			// 弹出层显示状态
			isActivw: false,		// 是否激活支付按钮
			code: '',				// 验证码
			isCode: false,         // 是否显示发生验证码
			codeTime: 60,          // 手机倒计时
			isCommittee: false,	// 是否是委员会成员
			committeeCode: '',		// 委员会编码
            account:{},           //用户信息
            income:0,             //收益
            mobile:"",             //用户电话
            order:""  ,             //订单编号
            available:"",           //可用余额
            handle:true,            //判断短信验证
            usable:"确认支付",       //点击按钮文字
            committee_member:""       //成员人数

        }),
		created () {
            this.account = decodeURIComponent((this.$route.query.account));
            this.mobile =(JSON.parse(this.account));


		},
		mounted() {
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
					url: 'api/committee',
					method: 'GET',
					data: {
					    type:1
					},
					success: (response) => {
						this.userInfo = response;
						// console.log(response);

						this.committee_member = response.committee_member;
						if(response.status === 2){
						    this.income = response.profit;
                            this.isCommittee = true;
                            this.committeeCode = response.code;

						}

						//判断短信验证码显示隐藏
						if(Number(response.wallet.astir_currency) < Number(response.amount) ){
                           this.handle = false;
                           this.usable = "可用余额不足"
						}
						else {
                            this.handle = true;
                            this.usable = "确认支付"
						}
                        //可用余额判断
						if(response.wallet.astir_currency === null){
                            this.available = 0
                        }else {
                            this.available =  response.wallet.astir_currency;
						}



					},
					error: (response) => {

					},
					complete: (response) => {
						Toast.clear();
					}
				});
			},
			showPopup: function () {
			    if(this.isCommittee === false){
                    //自治委立即抢购
                    this.request({
                        url: 'api/committee',
                        method: 'POST',
                        data: {
                            type:1
                        },
                        success: (response) => {
                        	this.order = response;
                        },
                        error: (response) => {

                        },
                        complete: (response) => {

                        }
                    });
				}

				this.popup = true;
			},
			hidePopup: function () {
				this.popup = false;
			},
			// 加入自治委员会
			handleJoinCommittee: function () {
                //短信验证
                this.request({
                    url: 'api/forgetPassword',
                    method: 'POST',
                    data: {
                        mobile:this.mobile.mobile,
                        code:this.code
                    },
                    success: (response) => {
                         //自治委下单
                        this.request({
                            url: 'api/committee',
                            method: 'PUT',
                            data: {
                                type:1
                            },
                            success: (response) => {
                                this.popup = false;
                                this.request({
									url: 'api/committee',
									method: 'GET',
									data: {
										type:1
									},
									success: (response) => {
										this.userInfo = response;

										this.committee_member = response.committee_member;
										if(response.status === 2){
											this.income = response.profit;
											this.isCommittee = true;
											this.committeeCode = response.code;

										}
										this.$toast.center('成功加入自治委员会！');
									},
									error: (response) => {

									},
									complete: (response) => {
										Toast.clear();
									}
								})



                            },
                            error: () => {
                                this.popup = false;
                                this.code = '';
                            },
                            complete: () => {
                            }
                        })
                    },
                    error: (response) => {

                    },
                    complete: (response) => {
                    }
                });
			},
			// 获取输入框状态
			handleGetStatus: function (value) {

				if(this.code.length > 6) {
					this.code = this.code.slice(0, 6)
					Toast("验证码为6位数字");
					return;
				}

				if(this.code.length > 0) {
					this.isActivw = true;
				} else{
					this.isActivw = false;
				}
			},
			// book: function () {
			// 	console.log(this.userInfo.tel);
			// },
			// 发送验证码
			handleGetCode: function () {
				Toast.loading({
					mask: true,
					message: '发送中...'
				});

				this.request({
					url: 'api/sendMobileCode',
					data: {
						mobile: this.mobile.mobile
					},
					success: (response) => {
						this.isCode = !this.isCode;

						let timer = setInterval(() => {
							if(this.codeTime > 0) {
								this.codeTime = this.codeTime - 1;
							} else {
								this.codeTime = 60;
								this.isCode = !this.isCode;

								clearInterval(timer)
							}
						}, 1000);

						// 关闭提示
						Toast.clear();
					},
					error: (response) => {
					},
					complete: () => {

					}
				});
			},
			//橙皮书
			handleOrangeBook: function () {
				location.href = 'https://mp.weixin.qq.com/s/Q--Mdb3vdNag72pmqg7ZPA';
			},

			//处理软键盘导致弹框里的按钮响应区域错位
			scrollBack: function () {
				setTimeout(function() {
					var scrollHeight = document.documentElement.scrollTop || document.body.scrollTop || 0;
					window.scrollTo(0, Math.max(scrollHeight - 1, 0));
				}, 100);
			},

			//进入收益列表
			handleIncomeList: function () {
				if(!this.isCommittee){
					return;
				}
				this.$router.push({
					path: '/plus/committee/income',
					query: {

					}
				});
			}
		}
	}
</script>

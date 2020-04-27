<template>
	<div class="my">
		<div class="my-top"></div>
		<div class="plus-head">
			<img src="../home/image/utd.png">
			<p>我的</p>
			<div>
				<div class="more" @click="handleMenu" >
					<barOverlay />
				</div>
			</div>
		</div>

		<div class="handle">

			<div class="wall-image">
			<img src="./image/author.png" alt="">
			</div>
			<div class="handle-right">
				<div class="handle-right-author">{{userInfo.account}}</div>
				<!-- 用户身份注释
				<div v-if="userInfo.old != null">
					<p v-if="userInfo.is_node == 2">创世店主</p>
					<p v-if="userInfo.is_node == 1">创世节点</p>
				</div>
				<p v-else>普通用户</p>
				-->
			</div>
		</div>
		<div class="lable">
			<div class="lable-box">

				<div class="lable-item" @click="handleIdentity">
					<div class="left">
						<img src="./image/menber03.png" alt="">
					</div>
					<div class="right">
						实名认证
					</div>
					<div class="arr">
						<span v-if="userInfo.status == 1">未认证</span>
						<span v-if="userInfo.status == 2">待审核</span>
						<span v-if="userInfo.status == 3">已认证</span>
						<span v-if="userInfo.status == 4" style="color: #ff4040;">审核拒绝</span>
						<van-icon color="rgba(26, 26, 26, 0.3)" size="18px" name="arrow" />
					</div>
				</div>
				<div class="lable-item" @click="handleMyPassword">
					<div class="left">
						<img src="./image/menber04.png" alt="">
					</div>
					<div class="right">
						修改密码
					</div>
					<div class="arr">
						<van-icon color="rgba(26, 26, 26, 0.3)" size="18px" name="arrow" />
					</div>
				</div>
			</div>
			<div class="community">
			<div class="lable-item" @click="handleCommunityIndex">
				<div class="left">
					<img src="./image/menber06.png" alt="">
				</div>
				<div class="right">
					UTD社区
				</div>
				<div class="arr">
					<van-icon color="rgba(26, 26, 26, 0.3)" size="18px" name="arrow" />
				</div>
			</div>
			</div>
			<div class="assignment" v-if="taskList.length > 0">
                <div class="hortation">
					获取更多UTD奖励
				</div>
				<div class="invitation"
					 v-for="(item, index) in taskList"
					 :key="index"
					  @click="handleTaskDetail(item.type)">
					<div class="left">
						<img :src="taskContent[item.type - 1].image" alt="">
					</div>
					<div class="invitation-text invitation-content">
						<span>{{taskContent[item.type - 1].title}}</span><br>
						{{taskContent[item.type - 1].sub}}
					</div>
					<div class="arr">
						<van-icon color="rgba(26, 26, 26, 0.3)" size="18px" name="arrow" />
					</div>
				</div>
			</div>
		</div>
		<div class="from-box-submit">
			<div class="from-submit" @click="handleExit">退出登录</div>
		</div>
	</div>
</template>

<style src="./index.css" scoped></style>

<script>
	import { Toast, Dialog } from 'vant';
	import mixins from '../../common/mixin';
    import Footer from '../../component/footer/footer';
	import barOverlay from '../../component/barOverlay/index';

	export default {
		components: {
			Toast,
			Dialog,
            Footer,
			barOverlay
		},
		mixins: [mixins],
		data: () => ({
			userInfo: {},				// 用户信息
			taskList: [],				// 任务列表
			taskContent: [{
				image: require('./image/menber07.png'),
				title: '邀请有礼',
				sub: '每邀请一位奖励50UTD'
			}, {
				image: require('./image/menber08.png'),
				title: '首单任务',
				sub: '活动期内完成缤纷集首单奖励200UTD'
			}],							// 任务列表内容
            isShowMenu: false,       // 是否显示菜单
            UTDEX_WhitePaper: 'http://www.utdex.net/UTDEX_WhitePaper.pdf',     // PDF下载地址
		}),
		created () {
			this.handleGetUserInfo();
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
			// 展示按钮
            handleMenu: function() {
                this.isShowMenu = !this.isShowMenu;
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
						this.handleTaskList();
					}
				});
			},
			// 任务列表
			handleTaskList: function() {
				this.request({
					url: 'api/task',
					method: 'GET',
					data: { },
					success: (response) => {
						this.taskList = response;
					},
					error: (response) => {

					},
					complete: (response) => {
						Toast.clear();
					}
				})
			},
			// 跳转任务详情
			handleTaskDetail: function(type) {
            	if(type == 1) {
					this.$router.push({
						path: '/task/invite/index',
						query: {}
					});
				}
            	else if(type == 2) {
					this.$router.push({
						path: '/task/indexOrder',
						query: {

						}
					});
				}
			},
			// 退出登录
			handleExit: function() {
				Dialog.confirm({
					title: '温馨提示',
					message: '确认退出登录吗？'
				}).then(() => {
					this.request({
						url: 'api/login',
						method: 'DELETE',
						data: { },
						success: (response) => {
							this.$toast.center('退出成功');

							// 清除登录信息
							sessionStorage.clear();
							localStorage.clear();

							this.$router.push({
								path: '/home',
								query: {}
							});
						},
						error: (response) => {
						},
						complete: () => {
							Toast.clear();
						}
					});
				}).catch(() => {
					// on cancel
				});
			},
			// 修改密码
			handleMyPassword: function() {
				this.$router.push({
					path: '/myPassword',
					query: {}
				});
			},
			// 身份认证
			handleIdentity: function() {
				if(this.userInfo.status == 4) {						// 审核遭拒
					this.$router.push({
					    path: '/identityError',
					    query: {
							break: this.userInfo.audit ? this.userInfo.audit.break : ''
						}
					});
					return;
				}
				else if(this.userInfo.status == 2) {				// 已认证未审核
					this.$toast.center('正在审核，请耐心等待');
					return;
				}
				else if(this.userInfo.status == 3) {				// 审核通过
					this.$toast.center('您已通过认证');
					return;
				}
				this.$router.push({
					path: '/identity',
					query: {
						status: this.userInfo.status,
						datum: JSON.stringify(this.userInfo.datum),
						name: this.userInfo.name,
						id_card: this.userInfo.id_card
					}
				});
            },
			// 加入社区
			handleCommunityIndex: function () {
				this.$router.push({
					path: '/communityIndex',
					query: {

					}
				});
			}
		}
	}
</script>

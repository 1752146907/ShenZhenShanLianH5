<template>
	<div>
		<navBar title="身份认证"></navBar>
		<div class="info">
			<div class="info-item">
				<p>姓名</p>
				<input v-model="name" placeholder="请输入姓名" type="text">
			</div>
			<div class="info-item">
				<p>身份证号</p>
				<input v-model="id_card" style="text-transform:uppercase" @input="handleGetStatus" placeholder="请输入身份证号" type="text">
			</div>
			<p class="demo" @click="handleIdDemo(0)">示例</p>
			<div class="info-body margin-top-6">
				<van-uploader :max-size="5242880" @oversize="handleOversize" :after-read="handleAfterCardFront" v-if="JSON.parse(this.$route.query.datum).length == 0">
					<div v-if="card_front" class="info-body-preview" :style ='{backgroundImage: "url("+card_front+")"}'></div>
					<img v-else src="./image/identity01.jpg" alt="">
				</van-uploader>
				<van-image
						v-else
						width="335px"
						height="200px"
						fit="cover"
						:src="card_front"
						@click="onChange(0)"
				/>
			</div>
			<p class="demo" @click="handleIdDemo(1)">示例</p>
			<div class="info-body">
				<van-uploader :max-size="5242880" @oversize="handleOversize" :after-read="handleAfterCardVerso" v-if="JSON.parse(this.$route.query.datum).length == 0">
					<div v-if="card_verso" class="info-body-preview" :style ='{backgroundImage: "url("+card_verso+")"}'></div>
					<img v-else src="./image/identity02.jpg" alt="">
				</van-uploader>
				<van-image
						v-else
						width="335px"
						height="200px"
						fit="cover"
						:src="card_verso"
						@click="onChange(1)"
				/>
			</div>
			<p class="demo" @click="handleIdDemo(2)">示例</p>
			<div class="info-body">
				<van-uploader :max-size="5242880" @oversize="handleOversize" :after-read="handleAfterCardSign" v-if="JSON.parse(this.$route.query.datum).length == 0">
					<div v-if="card_sign" class="info-body-preview" :style ='{backgroundImage: "url("+card_sign+")"}'></div>
					<img v-else src="./image/identity03.jpg" alt="">
				</van-uploader>
				<van-image
						v-else
						width="335px"
						height="200px"
						fit="cover"
						:src="card_sign"
						@click="onChange(2)"
				/>
			</div>
			<div class="from-submit" v-if="status == 1 || status == 4" @click="handleChack">提交</div>
		</div>
		<!--图片预览-->
		<van-image-preview
				v-model="showImagePreview"
				:images="imagesPreviewArr"
				:startPosition="startPosition"
				@change="onChange"
		/>
		<!--预览拍照事例-->
		<van-image-preview
				v-model="isShowIdDemo"
				:images="showIdDemoArr"
				:startPosition="startDemoArr"
				@change="handleIdDemo"
		/>
		<!--提交确弹框-->
		<div class="chack-show" v-if="chackIsShow">
			<div class="title">
				<p>身份认证信息唯一</p>
				<p>认证通过后不可修改</p>
			</div>
			<div class="body">缤纷集用户，请确认绑定手机号与官网注册手机号一致</div>
			<div class="footer">
				<div class="footer-left" @click="chackIsShow = false">取消</div>
				<div class="footer-right" @click="handleCardFront">确认</div>
			</div>
		</div>
		<van-overlay
				:show="chackIsShow"
				@click="chackIsShow = false"
				duration="0.5"
				z-index="999"
		/>
	</div>
</template>

<style src="./index.css" scoped></style>

<script>
	import { Toast, Dialog, ImagePreview, Overlay } from 'vant';
	import mixins from '../../../common/mixin';
	import reqwest from 'reqwest';
    import application from '../../../common/application';
	import navBar from '../../../component/navBar';
	import ImageCompressor from 'image-compressor.js';

	export default {
		components: {
			Toast,
			ImagePreview,
			navBar,
			ImageCompressor,
			Dialog,
			Overlay
		},
		mixins: [mixins],
		data: () => ({
			name: '',						// 用户名称
			id_card: '',					// 身份证id
			card_front: '',				    // 身份证正面
			card_verso: '',				    // 身份证反面
			card_sign: '',				    // 身份证正反面
			cardImage: {},					// 要上传的身份证照片
			isShowIdDemo: false,			// 是否显示事例
			showIdDemoArr: [require('./image/id1.png'), require('./image/id2.png'), require('./image/id3.jpg')],		// 事例数组
			startDemoArr: 1,				// 事例索引
			chackIsShow: false,				// 提交确认弹框
			startPosition: 0,				// 图片预览索引
			showImagePreview: false,		// 是否显示图片预览
			imagesPreviewArr: []			// 预览数组
		}),
		created () {
			// 路由初始化赋值
			this.status = this.$route.query.status;
			this.name = this.$route.query.name;
			this.id_card = this.$route.query.id_card;
			// 如果存在认证图片，添加到预览数组
			if(this.$route.query.datum){
				if(JSON.parse(this.$route.query.datum).length > 0){
					this.card_front = this.$route.query.datum ? JSON.parse(this.$route.query.datum)[0].image_url : '';
					this.card_verso = this.$route.query.datum ? JSON.parse(this.$route.query.datum)[1].image_url : '';
					this.card_sign = this.$route.query.datum ? JSON.parse(this.$route.query.datum)[2].image_url : '';

					JSON.parse(this.$route.query.datum).map((data, index) => {
						this.imagesPreviewArr.push(data.image_url);
					})
				}
			}
		},
		// 设置路由钩子，存储页面来源
		beforeRouteEnter(to, from, next) {
			next(vm=>{          //  这里的vm指的就是vue实例，可以用来当做this使用
				sessionStorage.setItem('url_from', from.path);
			})
		},
		methods: {
			// 预览事例
			handleIdDemo(index) {
				this.startDemoArr = index;
				this.isShowIdDemo = true;
			},
			//	预览图片
			onChange(index) {
				this.showImagePreview = true;
				this.startPosition = index;
			},
			// 校验身份证号码
			handleCheckCode: function(val) {
				var p = /^[1-9]\d{5}(18|19|20)\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/;
				var factor = [ 7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2 ];
				var parity = [ 1, 0, 'X', 9, 8, 7, 6, 5, 4, 3, 2 ];
				var code = val.substring(17);
				if(p.test(val)) {
					var sum = 0;
					for(var i=0;i<17;i++) {
						sum += val[i]*factor[i];
					}
					if(parity[sum % 11] == code.toUpperCase()) {
						return true;
					}
				}
				return false;
			},
			// 校验信息
			handleChack: function() {
				if(this.name == "" || this.name == null) {
					this.$toast.center('用户名不能为空');
					return false;
				}
				if(this.handleCheckCode(this.id_card ? this.id_card : '0') == false) {
					this.$toast.center('身份证号不合法');
					return false
				}
				if(this.id_card == "") {
					this.$toast.center('身份证号不能为空');
					return false;
				}
				if(this.card_front == "") {
					this.$toast.center('身份证正面不能为空');
					return false;
				}
				if(this.card_verso == "") {
					this.$toast.center('身份证反面不能为空');
					return false;
				}
				if(this.card_sign == "") {
					this.$toast.center('手持身份证不能为空');
					return false;
				}

				this.chackIsShow = true;
			},
			// 上传身份证正面
			handleCardFront: function (){
				this.chackIsShow = false;
				this.request({
					url: 'api/file',
					method: 'POST',
					data: {
						image: this.card_front
					},
					success: (response) => {
						this.cardImage.card_front = response.url;
                        this.handleCardVerso();
					},
					error: (response) => {
					},
					complete: (response) => {
					}
				});
			},
			// 上传身份证反面
			handleCardVerso: function() {
				this.request({
					url: 'api/file',
					method: 'POST',
					data: {
						image: this.card_verso
					},
					success: (response) => {
						this.cardImage.card_verso = response.url;
                        this.handleCardSign();
					},
					error: (response) => {
					},
					complete: (response) => {
					}
				});
			},
			// 上传身份证正反面
			handleCardSign: function() {
				this.request({
					url: 'api/file',
					method: 'POST',
					data: {
						image: this.card_sign,
					},
					success: (response) => {
						this.cardImage.card_sign = response.url;
                        this.handleSubmit();
					},
					error: (response) => {
					},
					complete: (response) => {
					}
				});
			},
			// 提交认证信息
			handleSubmit: function() {
				this.request({
					url: 'api/user',
					method: 'POST',
					data: {
						name: this.name,
						id_card: this.id_card,
						card_front: this.cardImage.card_front,
						card_verso: this.cardImage.card_verso,
						card_sign: this.cardImage.card_sign
					},
					success: (response) => {
						this.$router.replace({
							path: '/identitySuccess',
							query: {

							}
						});
					},
					error: (response) => {
					},
					complete: (response) => {
						Toast.clear();
					}
				});
			},
			handleOversize: function(file) {
				this.$toast.center('图片不能超过5M');
			},
			// 身证文件上传
			handleAfterCardFront: function(file) {
				if(this.name == '' || this.name == undefined) {
					this.$toast.center('姓名不能为空');
					return;
				}
				if(this.handleCheckCode(this.id_card ? this.id_card : '0') == false) {
					this.$toast.center('请检查您的身份证号');
					return;
				}
				this.handleFaceIdFront(file);

				// this.card_front = file.content;
			},
			handleAfterCardVerso: function(file) {
				if(this.name == '' || this.name == undefined) {
					this.$toast.center('姓名不能为空');
					return;
				}
				if(this.handleCheckCode(this.id_card ? this.id_card : '0') == false) {
					this.$toast.center('请检查您的身份证号');
					return;
				}
				if(this.card_front == "" || this.card_front == undefined) {
					this.$toast.center('身份证正面不能为空');
					return false;
				}
				this.handleFaceIdBack(file);

				// this.card_verso = file.content;
			},
			handleAfterCardSign: function(file) {
				if(this.name == '' || this.name == undefined) {
					this.$toast.center('姓名不能为空');
					return;
				}
				if(this.handleCheckCode(this.id_card ? this.id_card : '0') == false) {
					this.$toast.center('请检查您的身份证号');
					return;
				}
				if(this.card_front == "" || this.card_front == undefined) {
					this.$toast.center('身份证正面不能为空');
					return false;
				}
				if(this.card_verso == "" || this.card_verso == undefined) {
					this.$toast.center('身份证反面不能为空');
					return false;
				}
				this.handleFaceIdUTD(file);

				// this.card_sign = file.content;
			},
			// 阻止用户非法输入身份证号
			handleGetStatus: function (value) {
				if (this.id_card.length > 18) {
					this.id_card = this.id_card.slice(0, 18);
					Toast("身份证长度不能超过18位");
					return false;
				}
                this.id_card = this.id_card.toUpperCase();
			},
			// FaceId校验正面信息
			handleFaceIdFront(file) {
				Toast.loading({
					mask: true,
					duration: 0,
					message: '加载中...'
				});
                new ImageCompressor(file.file, {
                    quality: 0.4,
                    maxWidth: 800,
                    maxHeight: 800,
                    success: (result) => {
                        const reader = new FileReader();
                        reader.onload = (e) => {
                            let card_front = e.currentTarget.result;
							this.card_front = card_front;
							Toast.clear();

                            // reqwest({
                            //     url: 'https://api-cn.faceplusplus.com/cardpp/v1/ocridcard',
                            //     method: 'POST',
                            //     type: 'json',
                            //     crossOrigin: true,
                            //     headers: {
                            //         // 'Content-Type': 'application/json',
                            //         'Accept': 'application/vnd.website.v1+json'
                            //     },
                            //     data: {
                            //         api_key: application.apiKey,                   // 调用此API的API Key
                            //         api_secret: application.apiSecret,             // 调用此API的API Secret
                            //         image_base64:  card_front                                   // base64编码的二进制图片数据
                            //     },
                            //     success: (response) => {
                            //         if(response.cards.length <= 0) {
							// 			   this.$toast.center('图片不合法！');
                            //             this.card_front = "";
                            //             return
                            //         }
                            //         if(response.cards[0].name != this.name) {
							// 			   this.$toast.center('填写姓名和身份证照片姓名不一致');
                            //             this.card_front = "";
                            //             return
                            //         }
                            //         if(response.cards[0].id_card_number != this.id_card) {
							// 			Notify({
							// 				message: '填写身份证号码和照片号码不一致',
							// 				duration: 3000,
							// 				background: 'rgb(255, 68, 68)'
							// 			});
                            //             this.card_front = "";
                            //             return
                            //         }
							// 		this.card_front = card_front;
                            //     },
                            //     error: (response) => {
                            //         // Toast.fail('网络繁忙，请稍后重试');
                            //     },
                            //     complete: (response) => {
							// 		Toast.clear();
                            //     }
                            // });
                        }
                        // 执行图片压缩
                        reader.readAsDataURL(result);
                    }
                });
			},
			// FaceId校验反面信息
			handleFaceIdBack(file) {
				Toast.loading({
					mask: true,
                    duration: 0,
					message: '加载中...'
				});
                new ImageCompressor(file.file, {
                    quality: 0.4,
                    maxWidth: 800,
                    maxHeight: 800,
                    success: (result) => {
                        const reader = new FileReader();
                        reader.onload = (e) => {
                            let card_verso = e.currentTarget.result;
							this.card_verso = card_verso;
							Toast.clear();

                            // reqwest({
                            //     url: 'https://api-cn.faceplusplus.com/cardpp/v1/ocridcard',
                            //     method: 'POST',
                            //     type: 'json',
                            //     crossOrigin: true,
                            //     headers: {
                            //         // 'Content-Type': 'application/json',
                            //         'Accept': 'application/vnd.website.v1+json'
                            //     },
                            //     data: {
                            //         api_key: application.apiKey,                   // 调用此API的API Key
                            //         api_secret: application.apiSecret,             // 调用此API的API Secret
                            //         image_base64: card_verso                                       // base64编码的二进制图片数据
                            //     },
                            //     success: (response) => {
                            //         if(response.cards.length <= 0) {
							// 			Notify({
							// 				message: '图片不合法',
							// 				duration: 3000,
							// 				background: 'rgb(255, 68, 68)'
							// 			});
                            //             this.card_verso = "";
                            //             return
                            //         }
                            //         if(!response.cards[0].valid_date) {
							// 			Notify({
							// 				message: '图片不合法',
							// 				duration: 3000,
							// 				background: 'rgb(255, 68, 68)'
							// 			});
                            //             this.card_verso = "";
                            //             return
                            //         }
                            //         // 截取时间，判断是否到期
                            //         let calidDate = response.cards[0].valid_date.slice(11, response.cards[0].valid_date.length);
                            //         let timer = new Date(calidDate);
                            //         let thisDate = new Date();
                            //         if(thisDate.getTime() > timer.getTime()) {
							// 			Notify({
							// 				message: '身份证已过期',
							// 				duration: 3000,
							// 				background: 'rgb(255, 68, 68)'
							// 			});
							// 			this.card_verso = ""
                            //             return
                            //         }
							// 		this.card_verso = card_verso;
                            //     },
                            //     error: (response) => {
                            //         // Toast.fail('网络繁忙，请稍后重试');
                            //     },
                            //     complete: (response) => {
							// 		Toast.clear();
                            //     }
                            // });
                        }
                        reader.readAsDataURL(result);

                        Toast.clear();
                    }
                })
			},
			// FaceId校验手提UTD信息
			handleFaceIdUTD(file) {
				Toast.loading({
					mask: true,
                    duration: 0,
					message: '加载中...'
				});
                new ImageCompressor(file.file, {
                    quality: 0.4,
                    maxWidth: 800,
                    maxHeight: 800,
                    success: (result) => {
                        const reader = new FileReader();
                        reader.onload = (e) => {
                            let card_sign = e.currentTarget.result;
							this.card_sign = card_sign;
							Toast.clear();
                            // 两个人脸匹配相似度
							// this.handleFactCompare(card_sign);
							// 图片是否包含utd
                            // reqwest({
                            //     url: "https://api-cn.faceplusplus.com/imagepp/v1/recognizetext",
                            //     method: 'POST',
                            //     type: 'json',
                            //     crossOrigin: true,
                            //     headers: {
                            //         // 'Content-Type': 'application/json',
                            //         'Accept': 'application/vnd.website.v1+json'
                            //     },
                            //     data: {
                            //         api_key: application.apiKey,                   // 调用此API的API Key
                            //         api_secret: application.apiSecret,             // 调用此API的API Secret
                            //         image_base64: card_sign                                        // base64编码的二进制图片数据
                            //     },
                            //     success: (response) => {
                            //         let isChackUtd = false;
                            //         response.result.map((data) => {
                            //             if(data.value.indexOf("utd") > 0 || data.value.indexOf("UTD") > 0 || data.value.indexOf("Utd") > 0) {
                            //                 isChackUtd = true
                            //             }
                            //         });
                            //         if(isChackUtd) {
                            //             this.card_sign = card_sign;
                            //         } else{
                            //             Toast.fail("缺少'UTD'信息");
                            //             this.card_sign = ''
                            //         }
                            //     },
                            //     error: (response) => {
                            //         this.card_sign = ''
                            //         Toast.fail('提交失败，请稍后重试');
                            //     },
                            //     complete: (response) => { }
                            // });
                        }
                        reader.readAsDataURL(result);

                        Toast.clear();
                    }
                });
			},
			// 两个人脸进行比对
			handleFactCompare(card_sign) {
				reqwest({
				    url: "https://api-cn.faceplusplus.com/facepp/v3/compare",
				    method: 'POST',
				    type: 'json',
				    crossOrigin: true,
				    headers: {
				        // 'Content-Type': 'application/json',
				        'Accept': 'application/vnd.website.v1+json'
				    },
				    data: {
				        api_key: application.apiKey,                   // 调用此API的API Key
				        api_secret: application.apiSecret,             // 调用此API的API Secret
						image_base64_1: this.card_front,                                       // 第一张base64编码的二进制图片数据
						image_base64_2: card_sign                                        // 第二张base64编码的二进制图片数据
				    },
				    success: (response) => {
				    	if(response.confidence > 60) {
							this.card_sign = card_sign;
						} else {
							Toast.fail('照片人物与身份证头像相似度过低');
							this.card_sign = '';
						}
				    },
				    error: (response) => {
				        Toast.fail('提交失败，请稍后重试');
				    },
				    complete: (response) => { }
				});
			}
		}
	}
</script>

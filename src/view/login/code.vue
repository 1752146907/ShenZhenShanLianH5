<template>
    <div>
        <navBar :title="this.$route.query.title"></navBar>
        <div class="login">
            <div class="login-hender">
                <img src="../../image/login.png" alt="">
            </div>
            <div class="login-body">
                <div class="title">输入短信验证码</div>
                <p>验证码已发送到您的手机 {{mobile}}</p>
                <div class="input">
                    <input maxlength="6" type="tel" v-model="code" @focus="handleInputBlurBack" :clearable="true" placeholder="请输入验证码" />
                </div>
                <div class="login-body-tisp">
                    <div class="login-body-number">6位数字验证码</div>
                    <div class="login-body-revert" @click="handleSlideVerify" v-if="!isCode">发送验证码</div>
                    <div class="login-body-revert" v-else>{{codeTime}}S</div>
                </div>
                <div class="next" @click="handleLogin">下一步</div>
            </div>

            <!-- showCodeDialog是一个布尔值，当前页面点击按钮，修改它，子组件监听数据变化，加载滑动模块 -->
            <Geet :isGeet="showCodeDialog" @geetPath="GeetPath" @clickChange="GeetChange"></Geet>
        </div>
    </div>
</template>

<style src="./code.css" scoped></style>

<script>
    import {Toast} from 'vant';
    import navBar from '../../component/navBarTwo';
    import mixins from '../../common/mixin';
    import Geet from "./Geet.vue";

    export default {
        components: {
            navBar,
            Toast,
            Geet
        },
        mixins: [mixins],
        data: () => ({
            inviter: 0,
            isCode: false,         // 是否显示发生验证码
            codeTime: 60,          // 手机倒计时
            mobile: '',            // 手机
            code: '',              // 验证码
            showCodeDialog: false   // 极速校验
        }),
        created() {
            this.mobile = this.$route.query.mobile;
            // register         新用户
            // forget           忘记密码
            // password         密码登录
            if(this.$route.query.inviter){
                this.inviter = this.$route.query.inviter
            }
        },
        mounted() {
            // 自动调起滑动验证
            const toast = Toast.loading({
                mask: true,
                duration: 0,
                message: '加载中...'
            });
            setTimeout(() => {
                this.handleSlideVerify();
                toast.clear()
            }, 1500)
        },
        methods: {
            GeetChange(val) {   // 极验图片加载之后，通过更改控制变量实现可以再次加载
                this.showCodeDialog = val;
            },
            GeetPath(val) {     // 接受到图形验证参数，将参数发往服务端进行验证
                this.handleGetCode();
                this.showCodeDialog = false;
            },
            // 发送验证码
            handleGetCode: function () {
                this.request({
                    url: 'api/sendMobileCode',
                    data: {
                        mobile: this.mobile.replace(/[ ]/g,"")
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
                    },
                    error: (response) => {
                    },
                    complete: () => {

                    }
                });
            },
            // 图形验证码
            handleSlideVerify: function () {
                this.showCodeDialog = !this.showCodeDialog;
                window.scrollTo(0, 0);
            },
            // 登录操作
            handleLogin: function () {
                if(this.$route.query.type == 'register') {
                    // 新用户 设置密码
                    this.request({
                        url: 'api/login',
                        data: {
                            mobile: this.mobile.replace(/[ ]/g,""),
                            code: this.code,
                            inviter: this.inviter
                        },
                        success: (response) => {
                            this.$router.push({
                                path: '/setPassword',
                                query: {
                                    collBack: this.$route.query.collBack ? this.$route.query.collBack : '/'
                                }
                            });

                            // 存储access_token
                            let access_token = response.token_type + ' ' + response.access_token;
                            this.$storage.setToken(access_token);

                            // 存储过期时间戳
                            let d = new Date();
                            let times = d.getTime() + response.expires_in
                            this.$storage.setTimeStamp(times);
                        },
                        error: (response) => {
                            // 钱包生成失败 重新登录
                            if(response.status_code == 488) {
                                this.request({
                                    url: 'api/login',
                                    data: {
                                        mobile: this.mobile.replace(/[ ]/g,""),
                                        code: this.code,
                                        inviter: this.inviter
                                    },
                                    success: (response) => {
                                        this.$router.push({
                                            path: '/setPassword',
                                            query: {
                                                collBack: this.$route.query.collBack ? this.$route.query.collBack : '/'
                                            }
                                        });

                                        // 存储access_token
                                        let access_token = response.token_type + ' ' + response.access_token;
                                        this.$storage.setToken(access_token);

                                        // 存储过期时间戳
                                        let d = new Date();
                                        let times = d.getTime() + response.expires_in
                                        this.$storage.setTimeStamp(times);
                                    },
                                    error: (response) => {

                                    },
                                    complete: (response) => {

                                    }
                                })
                            }
                        },
                        complete: (response) => {
                            this.showCodeDialog = false
                        }
                    });
                    return false;
                }
                if(this.$route.query.type == 'forget') {
                    // 重置密码
                    this.request({
                        url: 'api/login',
                        data: {
                            mobile: this.mobile.replace(/[ ]/g,""),
                            code: this.code,
                            inviter: this.inviter
                        },
                        success: (response) => {
                            // 存储access_token
                            let access_token = response.token_type + ' ' + response.access_token;
                            this.$storage.setToken(access_token);

                            // 存储过期时间戳
                            let d = new Date();
                            let times = d.getTime() + response.expires_in
                            this.$storage.setTimeStamp(times);

                            this.$router.push({
                                path: '/forgetPassword',
                                title: '重置密码',
                                query: {
                                    code: this.code,
                                    collBack: this.$route.query.collBack ? this.$route.query.collBack : '/'
                                }
                            });
                        },
                        error: (response) => {

                        },
                        complete: (response) => {
                            this.showCodeDialog = false
                        }
                    });
                    return false;
                }
                if(this.$route.query.type == 'password') {
                    // 密码登录
                    this.request({
                        url: 'api/login',
                        data: {
                            mobile: this.mobile.replace(/[ ]/g,""),
                            code: this.code,
                            inviter: this.inviter
                        },
                        success: (response) => {
                            // 存储access_token
                            let access_token = response.token_type + ' ' + response.access_token;
                            this.$storage.setToken(access_token);

                            // 存储过期时间戳
                            let d = new Date();
                            let times = d.getTime() + response.expires_in;
                            this.$storage.setTimeStamp(times);

                            setTimeout(() => {
                                if(this.$route.query.collBack) {         // 判断是否有回调地址
                                    this.$router.replace({
                                        path: decodeURIComponent(this.$route.query.collBack),
                                        query: {}
                                    });
                                } else{                                          // 跳转到首页
                                    this.$router.replace({
                                        path: '/home',
                                        query: {}
                                    });
                                }
                            }, 100)
                        },
                        error: (response) => {

                        },
                        complete: (response) => {
                            this.showCodeDialog = false
                        }
                    });
                    return false;
                }
            }
        }
    }
</script>

<template>
    <div class="login">
        <navBar title="密码登录"></navBar>
        <div class="login">
            <div class="login-hender">
                <img src="../../../image/login.png" alt="">
            </div>
            <div class="login-body">
                <div class="title">密码登录</div>
                <div class="input">
                    <input :type="isShowEye ? 'password' : 'text'" v-model="password" :clearable="true" @focus="handleInputBlurBack" placeholder="请输入密码" />
                    <img src="./image/eye01.png" class="eye" @click="handleHideEye" v-if="!isShowEye" alt="" />
                    <img src="./image/eye02.png" class="eye" @click="handleHideEye" v-else alt="" />
                </div>
                <div class="login-body-tisp">
                    <div class="login-body-number" @click="handleCheckLogin">验证码登录</div>
                    <div class="login-body-revert" @click="handleForgetLogin">忘记密码</div>
                </div>
                <div class="next" @click="handleShowCodeDialog">登录</div>
            </div>
        </div>

        <!-- showCodeDialog是一个布尔值，当前页面点击按钮，修改它，子组件监听数据变化，加载滑动模块 -->
        <Geet :isGeet="showCodeDialog" @geetPath="GeetPath" @clickChange="GeetChange"></Geet>
    </div>
</template>

<style src="./index.css" scoped></style>

<script>
    import { DropdownMenu, DropdownItem, Toast } from 'vant';
    import mixins from '../../../common/mixin';
    import navBar from '../../../component/navBarTwo';
    import Geet from "../Geet.vue";

    export default {
        components: {
            DropdownMenu,
            DropdownItem,
            Toast,
            navBar,
            Geet
        },
        mixins: [mixins],
        data: () => ({
            mobile: '',
            password: '',
            isActivw: false,  // 是否激活提交按钮
            isShowEye: true,
            showCodeDialog: false  // 验证码弹框
        }),
        created() {
            if(this.$route.query.mobile) {
                this.mobile = this.$route.query.mobile.replace(/[ ]/g,"");
            }
            console.log(this.$route.query)
        },
        methods: {
            GeetChange(val) {   // 极验图片加载之后，通过更改控制变量实现可以再次加载
                this.showCodeDialog = val;
            },
            GeetPath(val) {     // 接受到图形验证参数，将参数发往服务端进行验证
                this.handleLogin();
                this.showCodeDialog = false;
            },
            handleHideEye: function() {
                this.isShowEye = !this.isShowEye;
            },
            handleShowCodeDialog: function () {
                if(this.password == '') {
                    this.$toast.center('密码不能为空');
                    return;
                }
                this.showCodeDialog = true
            },
            // 验证码登录
            handleCheckLogin: function() {
                this.$router.push({
                    path: '/login/code',
                    query: {
                        type: 'password',
                        title: '验码登录',
                        mobile: this.mobile,
                        collBack: this.$route.query.collBack ? this.$route.query.collBack : '/'
                    }
                });
            },
            // 忘记密码
            handleForgetLogin: function() {
                this.$router.push({
                    path: '/login/code',
                    query: {
                        type: 'forget',
                        title: '重置密码',
                        mobile: this.mobile,
                        collBack: this.$route.query.collBack ? this.$route.query.collBack : '/'
                    }
                });
            },
            handleLogin: function () {
                this.request({
                    url: 'api/login',
                    data: {
                        mobile: this.mobile,
                        password: this.password
                    },
                    success: (response) => {
                        // 存储access_token
                        let access_token = response.token_type + ' ' + response.access_token
                        this.$storage.setToken(access_token);

                        // 存储过期时间戳
                        let d = new Date();
                        let times = d.getTime() + response.expires_in
                        this.$storage.setTimeStamp(times);

                        if(this.$route.query.collBack) {         // 判断是否有回调地址
                            this.$router.replace({
                                path: decodeURIComponent(this.$route.query.collBack),
                                query: {}
                            });
                        } else{
                             this.$router.replace({
                                 path: '/',
                                 query: {}
                             });
                         }
                    },
                    error: (response) => {
                    },
                    complete: () => {
                        this.showCodeDialog = false
                    }
                });
            }
        }
    }
</script>

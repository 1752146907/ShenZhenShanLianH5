<template>
    <div class="login">
        <div class="login-hender">
            <img src="../../image/login.png" alt="">
        </div>
        <div class="login-body">
            <div class="title">Hello</div>
            <p>欢迎进入UTD</p>
            <div class="input">
                <span>+86</span>
                <input maxlength="13" type="tel" v-model="mobile" @input="handleGetStatus" @focus="handleInputBlurBack" :clearable="true" placeholder="请输入手机号" />
            </div>
            <div class="next" @click="handleLogin">下一步</div>
        </div>
    </div>
</template>

<style src="./index.css" scoped></style>

<script>
    import {DropdownMenu, DropdownItem, Toast} from 'vant';
    import mixins from '../../common/mixin';

    export default {
        components: {
            DropdownMenu,
            DropdownItem,
            Toast
        },
        mixins: [mixins],
        data: () => ({
            mobile: '',            // 手机
            showCodeDialog: false  // 验证码弹框
        }),
        created() {

        },
        methods: {
            // 获取输入框状态
            handleGetStatus: function () {
                let str = this.mobile.toString().replace(/ /g, '');
                let len = str.length;
                switch (true) {
                    case len > 11:
                        str = str.substr(0, 3) + ' ' + str.substr(3, 4) + ' ' + str.substr(7, 4);
                        this.mobile = str;
                        break;
                    case len > 7:
                        str = str.substr(0, 3) + ' ' + str.substr(3, 4) + ' ' + str.substr(7);
                        this.mobile = str;
                        break;
                    case len > 3:
                        str = str.substr(0, 3) + ' ' + str.substr(3);
                        this.mobile = str;
                        break;
                    default:
                        this.mobile = str;
                }
            },
            // 图形验证码
            handleSlideVerify: function () {
                if(!this.handleChackPnone(this.mobile.replace(/[ ]/g,""))){
                    this.$toast.center('请输入正确的手机格式');
                    return;
                }

                this.showCodeDialog = !this.showCodeDialog;
                window.scrollTo(0, 0);
            },
            // 登录操作
            handleLogin: function () {
                // 校验手机
                if(!this.handleChackPnone(this.mobile.replace(/[ ]/g,""))){
                    this.$toast.center('请输入正确的手机格式');
                    return false;
                }
                // console.log(this.mobile.replace(/[ ]/g,""));
                this.request({
                    url: 'api/checkNewAccount',
                    method: 'GET',
                    data: {
                        mobile: this.mobile.replace(/[ ]/g,"")
                    },
                    success: (response) => {
                        if(response.is_used == 0){
                            // 新用户
                            this.$router.push({
                                path: '/login/code',
                                query: {
                                    type: 'register',
                                    title: '验码登录',
                                    mobile: this.mobile,
                                    inviter: this.$route.query.inviter ? this.$route.query.inviter : 0,
                                    collBack: this.$route.query.collBack ? this.$route.query.collBack : '/'
                                }
                            });
                        } else {
                            // 旧用户
                            this.$router.push({
                                path: '/loginAccount',
                                query: {
                                    mobile: this.mobile,
                                    collBack: this.$route.query.collBack ? this.$route.query.collBack : '/'
                                }
                            });
                        }
                    },
                    error: (response) => {

                    },
                    complete: () => {
                    }
                });
            },
        }
    }
</script>

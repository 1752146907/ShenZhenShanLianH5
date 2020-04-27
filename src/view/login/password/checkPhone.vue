<template>
    <div class="login">
        <navBar title="重置密码"></navBar>
        <div class="from">
            <div class="from-item">
                <div class="from-item-title">手机号码</div>
                <div class="from-item-body">
                    <div class="left">
                        <van-dropdown-menu>
                            <van-dropdown-item active-color="#435FE0" v-model="value1" :options="option1"/>
                        </van-dropdown-menu>
                    </div>
                    <div class="right">
                        <input type="number" @input="handleGetStatus" @focus="handleInputBlurBack" v-model="mobile" placeholder="请输入手机号码"/>
                    </div>
                </div>
            </div>
            <div class="from-item">
                <div class="from-item-title">手机验证码</div>
                <div class="from-item-code">
                    <div class="left">
                        <input type="number" v-model="code" @focus="handleInputBlurBack" @input="handleGetStatus" placeholder="请输入手机验证"/>
                    </div>
                    <div class="right" @click="handleGetCode" v-if="!isCode">
                        获取验证码
                    </div>
                    <div class="right" v-else>
                        <span>{{codeTime}}S</span>
                    </div>
                </div>
            </div>
            <div class="from-submit-active" v-if="isActivw" @click="handleNext">下一步</div>
            <div class="from-submit" v-else>下一步</div>
        </div>
    </div>
</template>

<style src="./index.css" scoped></style>

<script>
    import {DropdownMenu, DropdownItem, Toast} from 'vant';
    import mixins from '../../../common/mixin';
    import navBar from '../../../component/navBar';

    export default {
        components: {
            DropdownMenu,
            DropdownItem,
            Toast,
            navBar
        },
        mixins: [mixins],
        data: () => ({
            option1: [
                {text: '+86', value: 0},
                {text: '+89', value: 1},
                {text: '+00', value: 2}
            ],
            mobile: '',       // 手机号码
            code: '',         // 验证码
            codeTime: 60,       // 手机倒计时
            isCode: false,      // 是否显示发生验证码
            isActivw: false,  // 是否激活登录按钮
            value1: 0
        }),
        created() {

        },
        methods: {
            handleNext: function () {
                this.request({
                    url: 'api/forgetPassword',
                    method: 'POST',
                    data: {
                        mobile: this.mobile,
                        code: this.code
                    },
                    success: (response) => {
                        this.handleLogin();
                    },
                    error: (response) => {
                    },
                    complete: () => {
                        Toast.clear();
                    }
                });
            },
            handleLogin: function () {
                this.request({
                    url: 'api/login',
                    data: {
                        mobile: this.mobile,
                        code: this.code
                    },
                    success: (response) => {
                        this.$router.replace({
                            path: '/forgetPassword',
                            query: {
                                code: this.code
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
                    complete: () => {
                        Toast.clear();
                    }
                });
            },
            handleGetCode: function () {
                if(!this.handleChackPnone(this.mobile)){
                    Toast("请输入正确的手机格式");
                    return;
                }

                Toast.loading({
                    mask: true,
                    message: '发送中...'
                });

                this.request({
                    url: 'api/sendMobileCode',
                    data: {
                        mobile: this.mobile
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
                        }, 1000)
                    },
                    error: (response) => {
                    },
                    complete: () => {

                    }
                });
            },
            handleGetStatus: function (value) {
                if(this.mobile.length > 11) {
                    this.mobile = this.mobile.slice(0, 11)
                    Toast("请输入正确的手机格式");
                    return;
                }

                if(this.mobile.length > 0 & this.code.length > 0) {
                    this.isActivw = true;
                } else{
                    this.isActivw = false;
                }
            }
        }
    }
</script>

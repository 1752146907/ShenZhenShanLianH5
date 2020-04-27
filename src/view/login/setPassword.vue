<template>
    <div class="login">
        <navBar title="设置密码"></navBar>
        <div class="login">
            <div class="login-hender">
                <img src="../../image/login.png" alt="">
            </div>
            <div class="login-body">
                <div class="title">请设置登录密码</div>
                <div class="input margin-bottom-49">
                    <input @input="handleGetStatus(1)" @focus="handleInputBlurBack" type="password" v-model="password" placeholder="请设置登录密码" />
                </div>
                <div class="input">
                    <input @input="handleGetStatus(2)" @focus="handleInputBlurBack" type="password" v-model="password_again" placeholder="请确认登录密码" />
                </div>
                <div class="login-body-tisp">{{errorCode}}</div>
                <div class="next" @click="handleSubmit">完成</div>
            </div>
        </div>
    </div>
</template>

<style src="./setPassword.css" scoped></style>

<script>
    import { Toast } from 'vant';
    import mixins from '../../common/mixin';
    import navBar from '../../component/navBarTwo';

    export default {
        components: {
            Toast,
            navBar
        },
        mixins: [mixins],
        data: () => ({
            password: "",       // 密码
            password_again: "",      // 确认密码
            errorCode: '',      // 错误提示
            isActivw: false     // 是否激活登录按钮
        }),
        created() {

        },
        methods: {
            // 判断输入状态
            handleGetStatus: function (value) {
                if(value == 1) {
                    this.handleCheckPassword();
                } else{
                    this.handleCheckPasswordAgain();
                }
            },
            handleCheckPassword: function () {
                if(!/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,18}$/.test(this.password)) {
                    this.errorCode = '请输入6-18位字符，必须包含字母和数字';
                    return false;
                } else{
                    this.errorCode = '';
                    return true
                }
            },
            handleCheckPasswordAgain: function () {
                if(JSON.stringify(this.password) != JSON.stringify(this.password_again)) {
                    this.errorCode = '两次输入密码不一致';
                    return false;
                } else{
                    this.errorCode = '';
                    return true
                }
            },
            // 提交修改
            handleSubmit: function () {
                this.handleCheckPassword();
                if(this.handleCheckPassword()) {
                    this.handleCheckPasswordAgain();
                }
                if(this.handleCheckPassword() && this.handleCheckPasswordAgain()) {
                    this.request({
                        url: 'api/password',
                        data: {
                            password: this.password,
                            password_again: this.password_again
                        },
                        success: (response) => {
                            this.$toast.center('设置成功');

                            this.$router.replace({
                                path: decodeURIComponent(this.$route.query.collBack),
                                query: {}
                            });
                        },
                        error: (response) => {

                        },
                        complete: () => {
                            Toast.clear();
                        }
                    });
                }
            }
        }
    }
</script>

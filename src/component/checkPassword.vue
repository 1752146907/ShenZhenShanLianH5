<template>
    <div class="password">
        <navBar title="校验登录密码"></navBar>
        <div class="password-body">
            <van-field v-model="password"
                       @input="handleBlur"
                       type="password"
                       :autofocus="autofocus"
                       clearable
                       input-align="center"
                       placeholder="请输入登录密码" />
        </div>
        <div class="from-submit"
             @click="handleCheckPassword"
             :class="isPassword ? 'from-submit-on' : ''">确定</div>
    </div>
</template>

<style scoped>
    /*vue过度动画*/
    .slide-fade-enter-active {
        transition: all .1s ease;
    }
    .slide-fade-leave-active {
        transition: all .2s cubic-bezier(1.0, 0.5, 0.8, 1.0);
    }
    .slide-fade-enter, .slide-fade-leave-to
        /* .slide-fade-leave-active for below version 2.1.8 */ {
        transform: translateX(10px);
        opacity: 0;
    }
    /*本页面样式*/
    .password{
        position: fixed;
        top: 0px;
        right: 0px;
        bottom: 0px;
        left: 0px;
        background: #ffffff;
        z-index: 1000;
    }
    .password-body{
        margin: 40% 20px 0px 20px;
        border: 1px solid #F6F6F6;
    }
    .from-submit{
        height: 46px;
        color: #ffffff;
        background: #D8D8D8;
        line-height: 46px;
        text-align: center;
        border-radius: 30px;
        position: fixed;
        left: 20px;
        right: 20px;
        bottom: 20px;
    }
    .from-submit-on{
        background: linear-gradient(to right, #3E41D1 , #9CD5F9);
    }
</style>

<script>
    import navBar from './navBar';
    export default {
        components: {
            navBar
        },
        data: () => ({
            password: '',
            isPassword: false,
            autofocus: false
        }),
        created () {

        },
        mounted() {
            this.autofocus = true;
        },
        methods: {
            handleBlur(value) {
                this.password = value;
                if(this.password.length > 1) {
                    this.isPassword = true
                } else{
                    this.isPassword = false
                }
            },
            handleCheckPassword() {
                this.$emit('handleCheckPassword', this.password)
            },
            handleBack() {
                this.$emit('handleBack')
            }
        },
        destroyed() {
            this.autofocus = false;
        }
    }
</script>

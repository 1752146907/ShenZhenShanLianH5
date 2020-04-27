<template>
    <div>
        <navBar title="新增地址" class="edit-bottom"></navBar>
        <div class="information">
            <p>名称</p>
            <input type="text" v-model="name" placeholder="请输入名称"/>
        </div>
        <div class="information">
            <p>转账地址</p>
            <input type="text" v-model="address" placeholder="请输入转账地址"/>
        </div>
        <div class="information">
            <p>验证码</p>
            <input type="text" v-model="code" placeholder="请输入验证码" />
            <div class="invitation-code">
                <p class="text" @click="handleSlideVerify" v-if="!isCode">点击获取</p>
                <p class="identifying-right" v-else>{{codeTime}}S</p>
            </div>
        </div>
        <div class="edit-button" @click="handleAdd">
            保存
        </div>
        <!-- showCodeDialog是一个布尔值，当前页面点击按钮，修改它，子组件监听数据变化，加载滑动模块 -->
        <Geet :isGeet="showCodeDialog" @geetPath="GeetPath" @clickChange="GeetChange"></Geet>
    </div>
</template>

<style src="./detail.css" scoped></style>

<script>
    import countTo from 'vue-count-to';
    import mixins from '../../../common/mixin';
    import navBar from '../../../component/navBar';
    import { Field } from 'vant';
    import Geet from "../../login/Geet";

    export default {
        components: {
            countTo,
            navBar,
            Field,
            Geet
        },
        mixins: [mixins],
        data: () => ({
            isCode: false,         // 是否显示发生验证码
            codeTime: 60,          // 手机倒计时
            account:"",             // 用户手机
            code: '',               // 验证码
            showCodeDialog: false,  // 极速校验
            address: '',            // 转账地址
            name: ''                // 名称
        }),
        created() {

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
            handleAdd: function () {
                if(this.name == '') {
                    this.$toast.center('名称不能为空');
                    return
                }
                // 转账地址
                let myreg = /^0x[a-fA-F0-9]{40}$/;
                if(!myreg.test(this.address)) {
                    this.$toast.center('转账地址不合法');
                    return
                }
                if(this.code == '') {
                    this.$toast.center('验证码不能为空');
                    return
                }
                this.request({
                    url: 'api/address',
                    method: 'POST',
                    data: {
                        currency_id: this.$route.query.id,
                        address: this.address,
                        code: this.code,
                        name: this.name
                    },
                    success: (response) => {
                        this.$toast.center('添加成功');

                        this.$router.replace({
                            path: '/walletAddresIndex',
                            query: {
                                title: this.$route.query.title,
                                id: this.$route.query.id,
                                amount: this.$route.query.amount
                            }
                        });
                    },
                    error: (response) => {

                    },
                    complete: (response) => {

                    }
                });
            },
            handleSlideVerify: function () {
                this.showCodeDialog = !this.showCodeDialog;
                window.scrollTo(0, 0);
            },
            GeetChange(val) {   // 极验图片加载之后，通过更改控制变量实现可以再次加载
                this.showCodeDialog = val;
            },
            GeetPath(val) {     // 接受到图形验证参数，将参数发往服务端进行验证
                this.handleGetCode();
                this.showCodeDialog = false;
            },
            // 初始化用户信息
            handleGetUserInfo: function() {
                this.request({
                    url: 'api/user',
                    method: 'GET',
                    data: { },
                    success: (response) => {
                        this.account=response.mobile
                    },
                    error: (response) => {

                    },
                    complete: (response) => {

                    }
                });
            },
            //获取验证码链接
            handleGetCode: function () {
                this.request({
                    url: 'api/sendMobileCode',
                    data: {
                        mobile: this.account
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


        }
    }
</script>

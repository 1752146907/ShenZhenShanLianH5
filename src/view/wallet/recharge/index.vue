<template>
    <div class="box">
        <navBar :title="title + '收款'"></navBar>
        <span class="recharge-history" @click="handleHistory">
            <img src="./image/icon.png" alt="">
        </span>
        <div class="main">
            <div class="main-body">
                <div class="main-body-code">
                    <img class="main-body-code-img" :src="recharge.address_image_url" alt="">
                </div>
                <div class="title">{{recharge.address_code}}</div>
                <div class="main-body-footer"
                     v-clipboard:copy="recharge.address_code"
                     v-clipboard:success="handleOnCopy"
                     v-clipboard:error="handleOnError" >
                    复制地址
                </div>
            </div>
            <div class="main-text">
                <p>请勿向上述地址充值任何非 UTD 资产，否则资产将不可找回。</p>
                <p>您充值至上述地址后，需要整个网络节点达15个确认后到账，30个确认后可转账。</p>
                <p>最小收款金额: 50 UTD,小于最小金额的充值将不会记录且无法退回。</p>
                <p>您的充值地址不会经常改变，可以重复充值;如有更改，我们会通过网站公告通知您。</p>
                <p>请务必确认电脑及浏览器安全，防止信息被篡改或泄露。</p>
            </div>
        </div>

    </div>
</template>

<style src="./index.css" scoped></style>

<script>
    import navBar from '../../../component/navBar';
    import mixins from '../../../common/mixin';
    import {Toast} from 'vant';

    export default {
        components: {
            navBar,
            Toast
        },
        mixins: [mixins],
        data: () => ({
            title: '',
            recharge: {}
        }),
        created() {

        },
        mounted() {
            this.title = this.$route.query.title;
            this.handleLoad();
        },
        // 设置路由钩子，存储页面来源
        beforeRouteEnter(to, from, next) {
            next(vm=>{          //  这里的vm指的就是vue实例，可以用来当做this使用
                sessionStorage.setItem('url_from', from.path);
            })
        },
        methods: {
            // 初始化数据
            handleLoad: function() {
                this.request({
                    url: 'api/recharge',
                    method: 'GET',
                    data: {
                        currency_id: this.$route.query.id
                    },
                    success: (response) => {
                        this.recharge = response;
                    },
                    error: (response) => {

                    },
                    complete: (response) => {

                    }
                });
            },
            // 充值记录
            handleHistory: function () {
                this.$router.push({
                    path: '/walletRechargeHistory',
                    query: {
                        title: this.$route.query.title,
                        id: this.$route.query.id
                    }
                });
            },
            // 复制成功
            handleOnCopy: function (e) {
                this.$toast.center('复制成功！');
            },
            // 复制失败
            handleOnError: function (e) {
                this.$toast.center('复制失败，请稍后重试');
            }
        }
    }
</script>

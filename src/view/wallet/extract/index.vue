<template>
    <div class="recharge">
        <navBar :title="title + '提币'"></navBar>
        <span class="recharge-history" v-if="!showCheckPassword" @click="handleHistory">
            <img src="./image/icon04.png" alt="">
        </span>
        <div class="main">
            <div class="main-body">
                <div class="main-body-title">提币金额</div>
                <div class="main-body-input">
                    <div class="left">
                        <input type="text"
                               v-model="amount"
                               @input="handleArrival"
                               :placeholder="'当前余额 ' + withdraw.astir_currency"
                               class="address-input" />
                    </div>
                    <div class="right" @click="handleAll">
                        <img src="./image/icon01.png" alt="">
                    </div>
                </div>
                <div class="main-body-number margin-bottom-15">
                    <span class="day">
                        当月可提
                        <countTo :startVal='0' :decimals="2" :endVal='Number(withdraw.max_month_nums ? withdraw.max_month_nums : 0)' :duration='1'></countTo>
                        {{withdraw.short}}
                    </span>
                    <span class="month" @click="handleAll">
                        当日可提
                        <countTo :startVal='0' :decimals="2" :endVal='Number(withdraw.max_day_nums ? withdraw.max_day_nums : 0)' :duration='1'></countTo>
                        {{withdraw.short}}
                    </span>
                </div>
            </div>
            <div class="main-body">
                <div class="main-body-title">收款地址</div>
                <div class="main-body-input">
                    <div class="left" @click="handleAddres">
                        <input type="text"
                               disabled
                               v-model="address"
                               placeholder="请选择收款地址"
                               class="address-input" />
                    </div>
                    <div class="right">
                        <img src="./image/icon02.png" alt="">
                    </div>
                </div>
            </div>
            <div class="main-body" style="margin-top: 30px;">
                <div class="main-body-title">手续费</div>
                <div class="main-body-momey">
                    <span>{{withdraw.charge_num}} UTD</span>
                    <img src="./image/icon03.png" alt="">
                </div>
                <div class="main-body-tisp">
                    <p>最小转账数量为：<b>{{this.withdraw.min_single_nums}}</b> {{withdraw.short}}。</p>
                    <p>为保障资金安全，我们会对资产转账进行人工审核，请耐心等待工作人员信息处理。</p>
                    <p>请务必确认电脑及浏览器全，防止信息被篡改或泄露。</p>
                </div>
            </div>
            <div class="actual">
                <div class="actual-title">到账金额</div>
                <div class="actual-number">
                    <countTo v-if="withdraw.id == 3" :startVal='0' :decimals="2" :endVal='Number(arrival ? arrival : 0)' :duration='1'></countTo>
                    <countTo v-else :startVal='0' :decimals="2" :endVal='Number(amount ? amount : 0)' :duration='1'></countTo>
                    {{withdraw.short}}
                </div>
            </div>
            <div class="from-submit" @click="handleSubmit">提交</div>
        </div>

        <transition name="slide-fade">
            <CheckPassword v-if="showCheckPassword"
                           @handleCheckPassword="handleCheckPassword"
                           @handleBack="handleBack" />
        </transition>
    </div>
</template>

<style src="./index.css" scoped></style>

<script>
    import navBar from '../../../component/navBar';
    import mixins from '../../../common/mixin';
    import Footer from '../../../component/footer/footer';
    import CheckPassword from '../../../component/checkPassword';
    import countTo from 'vue-count-to';
    import { Dialog, Toast } from 'vant';

    export default {
        components: {
            Footer,
            navBar,
            CheckPassword,
            Toast,
            Dialog,
            countTo
        },
        mixins: [mixins],
        data: () => ({
            title: '',
            withdraw: {},       // 初始化的数据
            arrival: 0,         // 到账数量
            amount: null,       // 转账数量
            address: '',        // 转账地址
            userInfo: {},       // 用户信息
            showCheckPassword: false
        }),
        created() {

        },
        mounted() {
            this.address = "";
            this.title = this.$route.query.title;
            this.handleLoad();
            if(this.$route.query.addres){
                this.address = this.$route.query.addres;
            }
            if(this.$route.query.amount) {
                this.amount = this.$route.query.amount;
            }
        },
        // 设置路由钩子，存储页面来源
        beforeRouteEnter(to, from, next) {
            next(vm=>{          //  这里的vm指的就是vue实例，可以用来当做this使用
                sessionStorage.setItem('url_from', from.path);
            })
        },
        methods: {
            // 历史记录
            handleHistory: function() {
                this.$router.push({
                    path: '/walletExtractHistory',
                    query: {
                        id: this.$route.query.id
                    }
                });
            },
            // 钱包地址
            handleAddres: function() {
                this.$router.push({
                    path: '/walletAddresIndex',
                    query: {
                        id: this.$route.query.id,
                        title: this.$route.query.title,
                        amount: this.amount
                    }
                });
            },
            // 初始化
            handleLoad: function() {
                this.request({
                    url: 'api/withdraw',
                    method: 'GET',
                    data: {
                        currency_id: this.$route.query.id
                    },
                    success: (response) => {
                        this.withdraw = response;
                        this.withdraw.charge_num = Number(this.withdraw.charge_num).toFixed(2);

                        // 判断是否有URL参数
                        if(this.$route.query.addres){
                            this.address = this.$route.query.addres;
                        }
                        if(this.$route.query.amount) {
                            console.log(this.withdraw)
                            this.amount = Number(this.$route.query.amount);
                            this.handleArrival()
                        }
                    },
                    error: (response) => {

                    },
                    complete: (response) => {

                    }
                });
            },
            // 转账
            handleSubmit: function () {
                // 手续费
                if(this.withdraw.id == 3) {             //  是UTD才执行
                    if(Number(this.arrival) <= 0) {
                        this.$toast.center('转账数量不能小于0');
                        return
                    }
                }
                // 最小限额
                if(Number(this.amount) < Number(this.withdraw.min_single_nums)) {
                    this.$toast.center('转账数量低于最小限额');
                    return
                }
                // 提现数字超出余额
                if(Number(this.amount) > Number(this.withdraw.max_month_nums)) {
                    this.$toast.center('转账数量超出当月限额');
                    return
                } else {
                    if(Number(this.amount) > Number(this.withdraw.max_day_nums)) {
                        this.$toast.center('转账数量超出当日限额');
                        return
                    }
                }
                // 转账地址
                let myreg = /^0x[a-fA-F0-9]{40}$/;
                if(!myreg.test(this.address)) {
                    this.$toast.center('转账地址不合法');
                    return
                }
                // 打开校验密码
                this.showCheckPassword = !this.showCheckPassword;
            },
            // 校验密码回调
            handleCheckPassword: function (password) {
                // 密码校验
                this.request({
                    url: 'api/check',
                    method: 'POST',
                    data: {
                        password: password
                    },
                    success: (response) => {
                        this.handleWithdraw();
                    },
                    error: (response) => {

                    },
                    complete: (response) => {
                    }
                });
            },
            // 确认转账
            handleWithdraw: function() {
                this.request({
                    url: 'api/withdraw',
                    method: 'PATCH',
                    data: {
                        currency_id: this.$route.query.id,
                        address: this.address,
                        amount: Number(this.amount)
                    },
                    success: (response) => {
                        this.$toast.center('提交成功');

                        this.$router.replace({
                            path: '/shopkeeperLoading',
                            query: {
                                name: '资产划转',
                                type: 'integral'
                            }
                        });

                        // this.$router.push({
                        //     path: '/walletExtractDetail',
                        //     query: {
                        //         id: response.id
                        //     }
                        // });
                    },
                    error: (response) => {
                    },
                    complete: (response) => {
                        this.showCheckPassword = false;
                    }
                });
            },
            // 校验密码返回回调
            handleBack: function () {
                this.showCheckPassword = !this.showCheckPassword;
            },
            // 计算到账数量
            handleArrival: function () {
                this.arrival = Number(this.amount) - Number(this.withdraw.charge_num);
                this.arrival = this.arrival > 0 ? this.arrival : 0;

                if(Number(this.withdraw.max_day_nums) <= 0) {
                    this.$toast.center('转账数量不合法');

                    this.amount = 0
                }
            },
            // 选择全部
            handleAll: function () {
                if(Number(this.withdraw.astir_currency) < Number(this.withdraw.max_day_nums)){
                    this.amount = this.withdraw.astir_currency;
                    this.handleArrival();
                } else{
                    this.amount = Number(this.withdraw.max_day_nums);
                    this.handleArrival();
                }
            }
        }
    }
</script>

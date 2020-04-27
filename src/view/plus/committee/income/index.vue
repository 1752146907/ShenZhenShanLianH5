<template>
    <div class="income">
        <div class="top-bar">
            <div class="top-bar-box">
                <van-icon class="bar-back" name="arrow-left" @click="handleBack" size="20" />
                自治委奖励
            </div>
        </div>
        <div >
            <div class="income-hender">
                <div class="circle-big"></div>
                <div class="circle-small"></div>
                <div class="income-money">
                    <div class="money">
                            <countTo  :startVal='0' :decimals="2" :endVal='Number(income)' :duration='300'></countTo>
                        <span class="font-utd">UTD</span>
                    </div>
                    <div class="font-info"><span>奖励锁仓</span></div>
                </div>
            </div>
            <div class="income-body">
                <div class="record-head">
                    <span class="circle"></span><p>奖励明细</p>
                </div>
                <div class="record">
                    <div class="no-data"
                         v-if="historyList.length <= 0"
                         style="padding-top: 80px">
                        <img src="./image/error.png" class="no-data-image-icon" alt="">
                        <p class="no-data-text">暂无记录</p>
                    </div>
                    <van-list v-model="loading"
                              :finished="finished"
                              :offset="100"
                              v-if="historyList.length > 0"
                              :immediate-check="false"
                              finished-text="没有更多了"
                              @load="rollLoad" >
                        <div class="record-item"
                             v-for="(item, index) in historyList"
                             :key="index">
                            <div class="record-item-body">
                                <div class="record-item-body-info">
                                    <div class="record-item-body-icon">
                                        <img src="./image/utdcoin.png" alt="">
                                    </div>

                                    <div class="record-item-body-time">
                                        <span v-if="item.type == 1">自治委奖励</span>
                                        <span v-if="item.type == 2">奖励解锁</span>
                                        <span v-if="item.type == 3">自治委员会扣除</span>
                                        <span v-if="item.type == 4">管理奖励</span>
                                        <p>{{item.created_at}}</p>
                                    </div>
                                </div>
                                <div class="record-item-body-number">
                                    <p v-if="item.type == 1 || item.type == 4">
                                        +<countTo :startVal='0' :decimals="2" :endVal='Number(item.amount)' :duration='1'></countTo>
                                    </p>
                                    <p v-else>
                                        -<countTo :startVal='0' :decimals="2" :endVal='Number(item.amount)' :duration='1'></countTo>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </van-list>
                </div>
            </div>
        </div>
    </div>
</template>

<style src="./index.css" scoped></style>

<script>
    import {Toast, Notify} from 'vant';
    import navBar from '../../../../component/navBarTwo';
    import mixins from '../../../../common/mixin';
    import countTo from 'vue-count-to';

    export default {
        components: {
            navBar,
            Toast,
            Notify,
            countTo
        },
        mixins: [mixins],
        data: () => ({
            size: 15,
            page: 1,
            transferRecord: {},     // 请求回来的数据
            historyList: [],        // 历史列表
            loading: false,         // 滚动加载参数
            finished: false,        // 滚动加载参数
            income:0                //奖励余额
        }),
        created() {

        },
        mounted() {
            this.handleLoad();
            this.handleGetUserIncome();
        },
        beforeRouteEnter(to, from, next) {
            next(vm=>{          //  这里的vm指的就是vue实例，可以用来当做this使用
                sessionStorage.setItem('url_from', from.path);
            })
        },
        methods: {
            // 下拉加载
            rollLoad: function() {
                if(this.historyList.length < this.transferRecord.total) {
                    this.page += 1;
                    this.handleLoad();
                } else{
                    this.loading = false;
                    this.finished = true;
                }
            },
            // 初始化数据
            handleLoad: function() {
                this.request({
                    url: 'api/committee',
                    method: 'PATCH',
                    data: {
                        size: this.size,
                        page: this.page,
                    },
                    success: (response) => {
                        this.transferRecord = response;
                        console.log(response);
                        // 把数组拼接上去
                        this.historyList = this.historyList.concat(this.transferRecord.data);
                    },
                    error: (response) => {

                    },
                    complete: (response) => {
                        // 关闭列表滚动
                        this.loading = false;
                        if(this.historyList.length >= this.transferRecord.total){
                            this.finished = true;
                        }
                    }
                });
            },
            // 初始化用户奖励余额
            handleGetUserIncome: function() {

                this.request({
                    url: 'api/committee',
                    method: 'GET',
                    data: {
                        type:1
                    },
                    success: (response) => {
                        this.income = response.profit;
                    },
                    error: (response) => {

                    },
                    complete: (response) => {
                        Toast.clear();
                    }
                });
            },
        }
    }
</script>

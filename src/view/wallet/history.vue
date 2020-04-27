<template>
    <div>
        <navBar title="UTD财务列表"></navBar>
        <div class="record">
            <van-list v-model="loading"
                      :finished="finished"
                      :offset="100"
                      :immediate-check="false"
                      finished-text="没有更多了"
                      @load="rollLoad" >
                <div class="record-item"
                     @click="handleWalletDetail(item.id, item.type)"
                     v-for="(item, index) in historyList"
                     :key="index">
                    <div class="record-title" v-if="item.type == 1">收款</div>
                    <div class="record-title" v-if="item.type == 2">转账</div>
                    <div class="record-title" v-if="item.type == 3">划转</div>
                    <div class="record-title" v-if="item.type == 4">空投</div>
                    <div class="record-title" v-if="item.type == 5">支付</div>
                    <div class="record-title" v-if="item.type == 6">奖励</div>
                    <div class="record-title" v-if="item.type == 7">锁仓</div>
                    <div class="record-item-body">
                        <div class="record-item-body-number">
                            数量
                            <p class="on" v-if="item.type == 2 || item.type == 5 || item.type == 7">
                                -
                                <countTo :startVal='0' :decimals="2" :endVal='Number(item.amount)' :duration='1'></countTo>
                            </p>
                            <p v-else>+
                                <countTo :startVal='0' :decimals="2" :endVal='Number(item.amount)' :duration='1'></countTo>
                            </p>
                        </div>
                        <div class="record-item-body-status">
                            余额
                            <p>
                                <countTo :startVal='0' :decimals="2" :endVal='Number(item.balance)' :duration='1'></countTo>
                            </p>
                        </div>
                        <div class="record-item-body-time">
                            时间
                            <p>{{item.created_YMD}}</p>
                            <p>{{item.created_TMS}}</p>
                        </div>
                    </div>
                </div>
            </van-list>
        </div>
    </div>
</template>

<style src="./history.css" scoped></style>

<script>
    import mixins from '../../common/mixin';
    import navBar from '../../component/navBar';
    import countTo from 'vue-count-to';

    export default {
        components: {
            navBar,
            countTo
        },
        mixins: [mixins],
        data: () => ({
            size: 10,
            page: 1,
            transferRecord: {},     // 请求回来的数据
            historyList: [],        // 历史列表
            loading: false,         // 滚动加载参数
            finished: false         // 滚动加载参数
        }),
        created () {

        },
        mounted() {
            this.handleLoad();
        },
        // 设置路由钩子，存储页面来源
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
                    url: 'api/transferRecord',
                    method: 'GET',
                    data: {
                        size: this.size,
                        page: this.page,
                        currency_id: this.$route.query.id
                    },
                    success: (response) => {
                        this.transferRecord = response;

                        this.transferRecord.data.map((data) => {
                            // 数量转为整数
                            data.amount = Number(data.amount).toFixed(2);
                            // 截取年月日
                            let YMD = data.created_at.indexOf(' ');
                            data.created_YMD = data.created_at.slice(0, YMD)
                            // 截取时分秒
                            let TMS = data.created_at.indexOf(' ');
                            data.created_TMS = data.created_at.slice(TMS+1, data.created_at.length)
                        });

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
            // 查看详情
            handleWalletDetail: function(id, type) {
                // 操作类型(1/2/3/4/7{收款/转账/划转/空投/锁仓})
                if(type == 1) {
                    this.$router.push({
                        path: '/walletRechargeDetail',
                        query: {
                            id: id
                        }
                    });
                }
                else if(type == 2) {
                    this.$router.push({
                        path: '/walletExtractDetail',
                        query: {
                            id: id
                        }
                    });
                }
                else if(type == 3) {
                    this.$router.push({
                        path: '/walletDetail',
                        query: {
                            id: id
                        }
                    });
                }
                else {
                    this.$router.push({
                        path: '/walletDetail',
                        query: {
                            id: id
                        }
                    });
                }
            }
        }
    }
</script>

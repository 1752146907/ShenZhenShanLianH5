<template>
    <div>
        <navBar title="操作记录" class="hasborder"></navBar>
        <div class="record">

            <van-list v-model="loading"
                      :finished="finished"
                      :offset="100"
                      :immediate-check="false"
                      finished-text="没有更多了"
                      @load="rollLoad" >
                <div class="record-item"
                     @click="handleWalletDetail(item.id)"
                     v-for="(item, index) in historyList"
                     :key="index">
                    <!--<div class="record-title" v-if="item.type == 1">收款</div>-->
                    <!--<div class="record-title" v-if="item.type == 2">转账</div>-->
                    <!--<div class="record-title" v-if="item.type == 3">划转</div>-->
                    <!--<div class="record-title" v-if="item.type == 4">空投</div>-->
                    <div class="record-item-body">
                        <div class="record-item-body-time">
                            <span v-if="item.type == 2">转账</span>
                            <span v-if="item.type == 3">划转</span>
                            <p>{{item.created_at}}</p>
                        </div>
                        <div class="record-item-body-number">
                            <p class="on">
                                -
                                <countTo :startVal='0' :decimals="2" :endVal='Number(item.amount)' :duration='1'></countTo>
                            </p>
                        </div>
                    </div>
                </div>
            </van-list>
        </div>
    </div>
</template>

<style src="./history.css" scoped></style>

<script>
    import mixins from '../../../common/mixin';
    import navBar from '../../../component/navBar';
    import countTo from 'vue-count-to';

    export default {
        components: {
            navBar,
            countTo
        },
        mixins: [mixins],
        data: () => ({
            size: 15,
            page: 1,
            transferRecord: {},     // 请求回来的数据
            historyList: [],        // 历史列表
            loading: false,         // 滚动加载参数
            finished: false         // 滚动加载参数
        }),
        created () {

        },
        // 设置路由钩子，存储页面来源
        beforeRouteEnter(to, from, next) {
            next(vm=>{          //  这里的vm指的就是vue实例，可以用来当做this使用
                sessionStorage.setItem('url_from', from.path);
            })
        },
        mounted() {
            this.handleLoad();

            //  创建监听事件，用于刷新当前列表
            this.$notification.on("handleDeleteWithdraw", this, function () {
                this.handleLoad();
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
                    url: 'api/withdraw',
                    method: 'POST',
                    data: {
                        size: this.size,
                        page: this.page,
                        currency_id: this.$route.query.id
                    },
                    success: (response) => {
                        this.transferRecord = response;

                        this.transferRecord.data.map((data) => {
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
            handleWalletDetail: function(id) {
                this.$router.push({
                    path: '/walletExtractDetail',
                    query: {
                        id: id
                    }
                });
            }
        }
    }
</script>

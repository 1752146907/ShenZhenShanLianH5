<template>
    <div class="main">
        <navBar :title="title + '收款记录'"></navBar>
        <div class="record">
            <van-list v-model="loading"
                      :finished="finished"
                      :offset="100"
                      :immediate-check="false"
                      finished-text="没有更多了"
                      @load="rollLoad" >
                <div class="record-item"
                     @click="handleWalletDetail(item.id)"
                     v-for="(item, index) in rechargeList"
                     :key="index">
                    <div class="record-item-body">
                        <div class="record-item-body-number">
                            收款
                            <!--<p class="on"> 0">+{{item.amount}}</p>-->
                            <p>
                                {{item.created_YMD}} {{item.created_TMS}}
                            </p>
                        </div>
                        <div class="record-item-body-time">
                            <p>
                                +<countTo :startVal='0' :decimals="2" :endVal='Number(item.amount)' :duration='1'></countTo>
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
            size: 10,
            page: 1,
            title: '',              // 标题
            recharge: {},           // 初始化的数据
            rechargeList: [],       // 充值列表
            loading: false,         // 滚动加载参数
            finished: false         // 滚动加载参数
        }),
        created () {

        },
        mounted() {
            this.handleLoad();
            this.title = this.$route.query.title;
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
                if(this.rechargeList.length < this.recharge.total) {
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
                    url: 'api/recharge',
                    method: 'POST',
                    data: {
                        "size": this.size,
                        "page": this.page,
                        "currency_id": this.$route.query.id
                    },
                    success: (response) => {
                        this.recharge = response;

                        this.recharge.data.map((data) => {
                            // 数量转为整数
                            data.amount = Number(data.amount).toFixed(2);
                            // 截取年月日
                            let YMD = data.created_at.indexOf(' ');
                            data.created_YMD = data.created_at.slice(0, YMD)
                            // 截取时分秒
                            let TMS = data.created_at.indexOf(' ');
                            data.created_TMS = data.created_at.slice(TMS+1, data.created_at.length)
                        });

                        this.rechargeList = this.rechargeList.concat(this.recharge.data)
                    },
                    error: (response) => {

                    },
                    complete: (response) => {
                        // 关闭列表滚动
                        this.loading = false;
                        if(this.rechargeList.length >= this.recharge.total){
                            this.finished = true;
                        }
                    }
                });
            },
            // 充值详情
            handleWalletDetail: function(id) {
                this.$router.push({
                    path: '/walletRechargeDetail',
                    query: {
                        id: id
                    }
                });
            }
        }
    }
</script>

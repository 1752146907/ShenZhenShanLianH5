<template>
    <div class="type">
        <div class="top-bar">
            <div class="top-bar-box">
                <van-icon class="bar-back" name="arrow-left" @click="handleBack" size="20" />
                {{title}}
            </div>
        </div>
        <div class="hander">
            <div class="hander-title">
                <countTo :startVal='0'
                         :decimals="2"
                         :endVal='Number(assets.total_assets ? assets.total_assets : 0)'
                         :duration='300'></countTo>

                <span style="font-family: 'DINM';">
                   ≈ ¥  <countTo :startVal='0' :decimals="2" :endVal="Number(assets.cny ? assets.cny : '0')" :duration='1'></countTo>
                </span>
            </div>
            <div class="hander-body">
                <div class="hander-body-left">
                    可用
                    <countTo :startVal='0' :decimals="2" :endVal='Number(assets.astir_currency ? assets.astir_currency : 0)' :duration='1'></countTo>
                </div>
                <div class="hander-line"></div>
                <div class="hander-body-right">
                    冻结
                    <countTo :startVal='0' :decimals="2" :endVal='Number(assets.lazy_currency ? assets.lazy_currency : 0)' :duration='1'></countTo>
                </div>
            </div>
            <div class="warehouse" @click="handleWarehouse">
                <div class="warehouse-left">
                    锁仓账户
                    <countTo v-if="this.$route.query.id != 2" :startVal='0' :decimals="2" :endVal='Number(committee.lock_number ? committee.lock_number : 0) + Number(committee.profit ? committee.profit : 0)' :duration='1'></countTo>
                    <span v-else>0.00</span>
                </div>
                <div class="warehouse-right"> <van-icon name="arrow" /> </div>
            </div>
            <div class="hander-dot"></div>
        </div>
        <div class="type-body">
            <div class="type-body-nav">
                <span :class="type == 1 ? 'on' : ''" @click="handleType(1)">全部</span>
                <span :class="type == 2 ? 'on' : ''" @click="handleType(2)">收入</span>
                <span :class="type == 3 ? 'on' : ''" @click="handleType(3)">支出</span>
            </div>
            <div v-if="historyList.length == 0" class="no-data" style="padding-top: 80px">
                <img src="./image/error.png" class="no-data-image-icon" alt="">
                <p class="no-data-text">暂无记录</p>
            </div>
            <van-list v-model="loading"
                      :finished="finished"
                      :offset="100"
                      :immediate-check="false"
                      finished-text="没有更多了"
                      v-if="isLoadSuccess && historyList.length > 0"
                      @load="rollLoad" >
                <div class="type-body-item"
                     v-for="item in historyList"
                     :key="item.id"
                     @click="handleWalletDetail(item.id, item.type)" >
                    <div class="conter">
                        <div class="conter-number">
                            <div class="title" v-if="item.type == 1">充币</div>
                            <div class="title" v-if="item.type == 2">提币</div>
                            <div class="title" v-if="item.type == 3">划转</div>
                            <div class="title" v-if="item.type == 4">空投</div>
                            <div class="title" v-if="item.type == 5">支付</div>
                            <div class="title" v-if="item.type == 6">奖励</div>
                            <div class="title" v-if="item.type == 7">锁仓</div>
                            <div class="title" v-if="item.type == 8">兑换</div>
                            <div class="title" v-if="item.type == 9">转账</div>
                            <div class="title" v-if="item.type == 10">转账</div>
                            <p>{{item.created_YMD}} {{item.created_TMS}}</p>
                        </div>
                        <div class="conter-time">
                            <p v-if="item.type == 2 || item.type == 5 || item.type == 7 || item.type == 9">
                                -
                                <countTo :startVal='0' :decimals="2" :endVal='Number(item.amount)' :duration='1'></countTo>
                            </p>
                            <p v-else>
                                +
                                <countTo :startVal='0' :decimals="2" :endVal='Number(item.amount)' :duration='1'></countTo>
                            </p>
                        </div>
                    </div>
                </div>
            </van-list>
        </div>
        <div class="type-footer">
            <div class="item"
                 @click="handleWalletRecharge">
                <div class="item-ico">
                    <img src="./image/type_01.png" />
                </div>
                <div class="item-pull">充币</div>
            </div>
            <div class="item"
                 v-if="this.$route.query.id != 2"
                 @click="handleIntegral">
                <div class="item-ico"><img src="./image/type_03.png" /></div>
                <div class="item-push">划转</div>
            </div>
            <div class="item"
                 v-if="this.$route.query.id != 2"
                 :style="this.$route.query.id == 2 ? 'opacity:0.6' : ''"
                 @click="handleTransfer">
                <div class="item-ico"><img src="./image/type_02.png" /></div>
                <div class="item-push">转账</div>
            </div>
            <div class="item"
                 @click="handleWalletExtract">
                <div class="item-ico"><img src="./image/type_04.png" /></div>
                <div class="item-push">提币</div>
            </div>
        </div>
    </div>
</template>

<style src="./type.css" scoped></style>

<script>
    import mixins from '../../common/mixin';
    import countTo from 'vue-count-to';
    import {Toast } from 'vant';

    export default {
        components: {
            countTo,
            Toast
        },
        mixins: [mixins],
        data: () => ({
            size: 10,       // 分页
            page: 1,        // 分页
            assets: {},     // 页面数据
            type: 1,        // 查询类型
            title: '',      // 标题
            userInfo: {},   // 用户信息
            committee: {},  // 自治委信息
            historyList: [],        // 历史列表
            loading: false,         // 滚动加载参数
            finished: false,        // 滚动加载参数
            isLoadSuccess: false     // 页面是否加载完成
        }),
        created () {

        },
        mounted () {
            this.title = this.$route.query.title;
            this.handleLoad();
            this.handleGetUserInfo();
            this.handleCommittee();
        },
        // 设置路由钩子，存储页面来源
        beforeRouteEnter(to, from, next) {
            next(vm=>{          //  这里的vm指的就是vue实例，可以用来当做this使用
                sessionStorage.setItem('url_from', from.path);
            })
        },
        methods: {
            // 初始化committee
            handleCommittee: function() {
                this.request({
                    url: 'api/committee',
                    method: 'GET',
                    data: {
                        type: 1
                    },
                    success: (response) => {
                        this.committee = response;
                    },
                    error: (response) => {

                    },
                    complete: (response) => {
                        Toast.clear();
                    }
                });
            },
            // 下拉加载
            rollLoad: function() {
                if(this.historyList.length < this.assets.list.total) {
                    this.page += 1;
                    this.handleLoad();
                } else{
                    this.loading = false;
                    this.finished = true;
                }
            },
            handleType: function(index) {
                this.type = index;
                this.historyList = [];
                this.handleLoad();
            },
            // 初始化数据
            handleLoad: function() {
                this.request({
                    url: 'api/assets',
                    method: 'POST',
                    data: {
                        size: this.size,
                        page: this.page,
                        type: this.type,
                        currency_id: this.$route.query.id
                    },
                    success: (response) => {
                        this.isLoadSuccess = true;
                        this.assets = response;

                        this.assets.list.data.map((data) => {
                            // 截取年月日
                            let YMD = data.created_at.indexOf(' ');
                            data.created_YMD = data.created_at.slice(0, YMD)
                            // 截取时分秒
                            let TMS = data.created_at.indexOf(' ');
                            data.created_TMS = data.created_at.slice(TMS+1, data.created_at.length);
                            // 转为数字类型
                            data.amount = Number(data.amount).toFixed(2)
                        });

                        // 把数组拼接上去
                        this.historyList = this.historyList.concat(this.assets.list.data);
                    },
                    error: (response) => {

                    },
                    complete: (response) => {
                        // 关闭列表滚动
                        this.loading = false;
                        if(this.historyList.length >= this.assets.list.total){
                            this.finished = true;
                        }
                    }
                });
            },
            // 锁仓账户
            handleWarehouse: function() {
                this.$router.push({
                    path: '/walletWarehouse',
                    query: {
                    }
                });
            },
            // 收款
            handleWalletRecharge: function() {
                this.$router.push({
                    path: '/walletRecharge',
                    query: {
                        title: this.title,
                        id: this.$route.query.id
                    }
                });
            },
            //站内转账
            handleTransfer:function () {
                if(this.$route.query.id == 2) {
                    this.$toast.center('暂不支持转账！');
                    return;
                }
                if(this.userInfo.status == 1) {
                    this.$toast.center('请先认证身份');
                    this.$router.push({
                        path: '/identity',
                        query: {
                            status: this.userInfo.status,
                            datum: JSON.stringify(this.userInfo.datum),
                            name: this.userInfo.name,
                            id_card: this.userInfo.id_card
                        }
                    });
                } else if(this.userInfo.status == 2) {
                    this.$toast.center('身份正在审核，请耐心等待');
                } else if(this.userInfo.status == 3) {
                    this.$router.push({
                        path: '/wallet/transfer',
                        query: {
                            id: this.$route.query.id
                        }
                    });
                } else if(this.userInfo.status == 4) {
                    this.$router.push({
                        path: '/identityError',
                        query: {
                            break: this.userInfo.audit ? this.userInfo.audit.break : ''
                        }
                    });
                }

            },
            // 转账
            handleWalletExtract: function() {
                if(this.userInfo.status == 1) {
                    this.$toast.center('请先认证身份');
                    this.$router.push({
                        path: '/identity',
                        query: {
                            status: this.userInfo.status,
                            datum: JSON.stringify(this.userInfo.datum),
                            name: this.userInfo.name,
                            id_card: this.userInfo.id_card
                        }
                    });
                } else if(this.userInfo.status == 2) {
                    this.$toast.center('身份正在审核，请耐心等待');
                } else if(this.userInfo.status == 3) {
                    this.$router.push({
                        path: '/walletExtract',
                        query: {
                            title: this.$route.query.title,
                            id: this.$route.query.id
                        }
                    });
                } else if(this.userInfo.status == 4) {
                    this.$router.push({
                        path: '/identityError',
                        query: {
                            break: this.userInfo.audit ? this.userInfo.audit.break : ''
                        }
                    });
                }
            },
            // 资产划转
            handleIntegral: function () {
                this.$router.push({
                    path: '/integral',
                    query: {

                    }
                });
            },
            // 初始化用户信息
            handleGetUserInfo: function() {
                this.request({
                    url: 'api/user',
                    method: 'GET',
                    data: { },
                    success: (response) => {
                        this.userInfo = response;
                    },
                    error: (response) => {

                    },
                    complete: (response) => {
                    }
                });
            },
            // 历史列表
            handleList: function() {
                this.$router.push({
                    path: '/walletHistory',
                    query: {
                        id: this.$route.query.id
                    }
                });
            },
            // 查看详情
            handleWalletDetail: function(id, type) {
                // 操作类型(1/2/3/4{收款/转账/划转/空投})
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
                        path: '/myRecordDetail',
                        query: {
                            id: id
                        }
                    });
                }
                else if(type == 9) {
                    this.$router.push({
                        path: '/wallet/detailed',
                        query: {
                            id: id
                        }
                    });
                }
                else if(type == 10) {
                    this.$router.push({
                        path: '/wallet/detailed',
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

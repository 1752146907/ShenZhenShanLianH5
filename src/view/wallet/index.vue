<template>
    <div>
        <div class="chat">
            <div class="chat-back"></div>
            <div class="chat-left"></div>
            <div class="hander">
                <div class="plus-head">
                    <img src="../home/image/utd.png">
                    <p>钱包</p>
                    <div>
                        <div class="more">
                            <barOverlay />
                        </div>
                    </div>
                </div>
                <div class="money">
                    ¥
                    <countTo :startVal='0' :decimals="2" :endVal='Number(wallet.total_assets_cny) ? Number(wallet.total_assets_cny) : 0' :duration='300'></countTo>
                </div>
                <p class="hander-about">≈</p>
            </div>
            <div class="char-back">
                <div class="char-type">资产</div>
                <div class="chart-body">
                    <van-list v-model="loading"
                              :finished="finished"
                              :offset="100"
                              :immediate-check="false"
                              finished-text=" "
                              @load="rollLoad" >
                        <div class="chart-body-item"
                             @click="handleType(item.currency.short, item.currency_id)"
                             v-for="(item, index) in walletList"
                             :key="index" >
                            <img class="icon" v-if="item.currency.short == 'ETH'" src="./image/money03.png" alt="">
                            <img class="icon" v-if="item.currency.short == 'INE'" src="./image/money02.png" alt="">
                            <img class="icon" v-if="item.currency.short == 'UTD'" src="./image/money01.png" alt="">
                            <p class="title">{{item.currency.short}}</p>
                            <div class="number">
                                <countTo :startVal='0' :decimals="2" :endVal='Number(item.total_assets)' :duration='1'></countTo>
                                <P>
                                    ≈¥<countTo :startVal='0' :decimals="2" :endVal='Number(item.cny)' :duration='1'></countTo>
                                </P>
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
    import countTo from 'vue-count-to';
    import mixins from '../../common/mixin';
    import Footer from '../../component/footer/footer';
    import barOverlay from '../../component/barOverlay/index';

    export default {
        components: {
            Footer,
            countTo,
            barOverlay
        },
        mixins: [mixins],
        data: () => ({
            size: 10,
            page: 1,
            loading: false,         // 滚动加载参数
            finished: false,        // 滚动加载参数
            wallet: {},             // 初始化的数据
            walletList: [],        // 钱包类型列表
            isShowMenu: false,       // 是否显示菜单
            UTDEX_WhitePaper: 'http://www.utdex.net/UTDEX_WhitePaper.pdf',     // PDF下载地址
            isToken: '',
        }),
        created() {

        },
        mounted() {
            this.isToken = this.$storage.getToken();
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
                if(this.walletList.length < this.recharge.list.total) {
                    this.page += 1;
                    this.handleLoad();
                } else{
                    this.loading = false;
                    this.finished = true;
                }
            },
            // 初始化数据
            handleLoad: function () {
                this.request({
                    url: 'api/assets',
                    method: 'GET',
                    data: {
                        size: this.size,
                        page: this.page
                    },
                    success: (response) => {
                        this.wallet = response;

                        this.wallet.total_assets = Number(this.wallet.total_assets);

                        this.walletList = this.walletList.concat(this.wallet.list.data)
                    },
                    error: (response) => {

                    },
                    complete: (response) => {
                        // 关闭列表滚动
                        this.loading = false;
                        if(this.walletList.length >= this.wallet.list.total){
                            this.finished = true;
                        }
                    }
                });
            },
            handleType: function (title, id) {
                this.$router.push({
                    path: '/walletType',
                    query: {
                        title: title,
                        id: id
                    }
                });
            }
        }
    }
</script>

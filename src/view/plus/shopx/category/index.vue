<template>
    <div class="category">
        <div class="bar">
            <div class="bar-box">
                <van-icon class="bar-back" name="arrow-left" @click="handleBack" size="20" />
                <!--<img class="bar-back" src="../image/back.png" alt="">-->
                {{title}}
            </div>
        </div>

        <van-list v-model="loading"
                  :finished="finished"
                  :offset="300"
                  :immediate-check="false"
                  finished-text="没有更多了"
                  class="goods-box"
                  @load="rollLoad" >
            <div class="goods">
                <div class="goods-item"
                     @click="handleGoods(item.id)"
                     v-for="(item, index) in historyList"
                     :key="index">
                    <div class="goods-item-hander-box">
                        <div class="goods-item-hander">
                            <img v-if="item.image[0]" :src="item.image[0].file.path" alt="">
                        </div>
                    </div>
                    <div class="goods-item-body">
                        <div class="title line-clamp-two">{{item.name.length > 15 ?item.name.substring(0,20)+ "...":item.name}}</div>
                        <div class="price">
                            <span class="rmb">¥</span>
                            {{item.min_price}}
                            <span class="num">{{item.goods_min_price_num}}</span>
                            <s v-if="item.sku[0]">{{item.sku[0].line_price}}元</s>
                        </div>
                        <div class="goods-item-body-tab">
                            <strong v-for="children in item.available_pay_type"
                                    :key="children">
                                <span v-if="children == 1">ETH</span>
                                <span v-if="children == 2">INE</span>
                                <span v-if="children == 3">UTD</span>
                            </strong>
                        </div>
                    </div>
                </div>
            </div>
        </van-list>
    </div>
</template>
<style src="./index.css" scoped></style>
<script>
    import mixins from '../../../../common/mixin';
    import navBar from '../../../../component/navBar';
    import '../component/goods/goods.css';

    export default {
        components: {
            navBar
        },
        mixins: [mixins],
        data: () => ({
            loading: false,         // 滚动加载参数
            finished: false,         // 滚动加载参数
            page: 1,
            size: 20,
            categoryId: '',
            name: '',
            title: '',
            goodsList: [],
            transferRecord: {},
            historyList: []
        }),
        // 设置路由钩子，存储页面来源
        beforeRouteEnter(to, from, next) {
            next(vm => {          //  这里的vm指的就是vue实例，可以用来当做this使用
                sessionStorage.setItem('url_from', from.path);
            })
        },
        created() {
            if (this.$route.query.id) {
                this.categoryId = this.$route.query.id;
            }
            if (this.$route.query.name) {
                this.name = this.$route.query.name;
            }
            this.title = this.$route.query.title
        },
        mounted() {
            this.handleGoodsList();
        },
        methods: {
            // 商品详情
            handleGoods: function (id) {
                this.$router.push({
                    path: '/plus/shopx/goods',
                    query: {
                        id: id
                    }
                })
            },
            // 下拉加载
            rollLoad: function () {
                if(this.historyList.length < this.transferRecord.total) {
                    this.page += 1;
                    this.handleGoodsList();
                } else{
                    this.loading = false;
                    this.finished = true;
                }
            },
            handleGoodsList() {
                if(this.$route.query.id) {
                    var requestData = {
                        page: this.page,
                        size: this.size,
                        category_id: this.categoryId
                    }
                } else{
                    var requestData = {
                        page: this.page,
                        size: this.size,
                        name: this.name
                    }
                }
                this.request({
                    url: 'api/store/goods',
                    method: 'GET',
                    data: requestData,
                    success: (response) => {
                        this.goodsList = response;
                        this.transferRecord = response;

                        // 价格切割
                        this.transferRecord.list.map((data) => {
                            if(data.min_price) {
                                data.goods_min_price_num = data.min_price.substring(data.min_price.length - 2);
                                data.min_price = data.min_price.substring(0, data.min_price.length - 2);
                            }
                        });

                        // 如果从搜索页面进来，没搜索到数据，返回到搜索页
                        if (this.$route.query.isSeach && this.transferRecord.list.length <= 0) {
                            this.$router.replace({
                                path: '/plus/shopx/seach',
                                query: {
                                    noSeach: true,
                                    name: this.name
                                }
                            });
                        }

                        // 把数组拼接上去
                        this.historyList = this.historyList.concat(this.transferRecord.list);
                    },
                    error: (response) => {

                    },
                    complete: () => {

                    }
                });
            },
            handleBack: function () {
                // 如果从搜索页面进来，返回到搜索页
                if (this.$route.query.isSeach) {
                    this.$router.replace({
                        path: '/plus/shopx/seach',
                        query: {
                            name: this.name
                        }
                    });
                } else {
                    this.$router.go(-1)
                }
            }
        }
    }
</script>

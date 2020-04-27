<template>
   <div class="shopx">
       <div class="bar">
           <div class="bar-box">
               <van-icon class="bar-back" @click="handlePlus" name="arrow-left" size="20" />
               商城
           </div>
       </div>
       <div class="seach" @click="handleSeach">
           <i class="van-icon van-icon-search"></i>
           搜索商品
       </div>
       <div class="banner">
           <swiper :options="swiperOption">
               <swiper-slide :style="'height: 155px;background: url(' + item.path + ') center;background-size: cover;'"
                             v-for="(item, index) in homeData.banner"
                             :key="index"></swiper-slide>
               <!--<swiper-slide style="height: 155px;background: url('https://yinghuo.binfenji.cn/uploads/20190729182107890c07736.jpg') center;background-size: cover;"></swiper-slide>-->
               <div class="swiper-pagination" slot="pagination"></div>
           </swiper>
       </div>
       <div class="navbar">
           <van-grid :border="false" :column-num="4" v-if="homeData.category">
               <van-grid-item @click="handleNavbar(item.id, item.name)"
                              v-for="item in homeData.category.tree"
                              :key="item.id"
               >
                   <van-image class="navbar-img"
                              v-if="item.image"
                              :src="item.image.path" />
                   <p>{{item.name}}</p>
               </van-grid-item>
           </van-grid>
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

       <Footer :active="0" />
   </div>
</template>
<style src="./index.css" scoped></style>
<script>
    import { Toast, Search } from 'vant';
    import mixins from '../../../common/mixin';
    import navBar from '../../../component/navBar';
    import Footer from './component/footer/footer';
    import './component/goods/goods.css';

    import { swiper, swiperSlide } from 'vue-awesome-swiper';
    import 'swiper/dist/css/swiper.css'

    export default {
        components: {
            Toast,
            Search,
            navBar,
            swiper,
            swiperSlide,
            Footer
        },
        mixins: [mixins],

        data: () => ({
            loading: false,         // 滚动加载参数
            finished: false,         // 滚动加载参数
            page: 1,
            size: 20,
            swiperOption: {
                speed: 1000,
                autoplay: true,
                pagination: {
                    el: '.swiper-pagination'
                }
            },
            homeData: {},
            transferRecord: {},
            historyList: []
         }),
        // 设置路由钩子，存储页面来源
        beforeRouteEnter(to, from, next) {
            next(vm=>{          //  这里的vm指的就是vue实例，可以用来当做this使用
                sessionStorage.setItem('url_from', from.path);
            })
        },
        created () {

        },
        mounted() {
            this.handleLoad();
            this.handleGoodsList()
        },
        methods: {
            // 首页数据
            handleLoad: function() {
                this.request({
                    url: 'api/store/home',
                    method: 'GET',
                    data: {

                    },
                    success: (response) => {
                        this.homeData = response;
                    },
                    error: (response) => {

                    },
                    complete: () => {

                    }
                });
            },
            // 商品列表
            handleGoodsList: function () {
                this.request({
                    url: 'api/store/goods',
                    method: 'GET',
                    data: {
                        size: this.size,
                        page: this.page
                    },
                    success: (response) => {
                        this.transferRecord = response;

                        // 价格切割
                        this.transferRecord.list.map((data) => {
                            if(data.min_price) {
                                data.goods_min_price_num = data.min_price.substring(data.min_price.length - 2);
                                data.min_price = data.min_price.substring(0, data.min_price.length - 2);
                            }
                        });

                        // 把数组拼接上去
                        this.historyList = this.historyList.concat(this.transferRecord.list);
                    },
                    error: (response) => {

                    },
                    complete: () => {
                        // 关闭列表滚动
                        this.loading = false;
                        if(this.historyList.length >= this.transferRecord.total){
                            this.finished = true;
                        }
                    }
                });
            },
            // 分类跳转
            handleNavbar: function (id, name) {
                this.$router.push({
                    path: '/plus/category/index',
                    query: {
                        id: id,
                        title: name
                    }
                });
            },
            // 商品搜索
            handleSeach: function () {
                this.$router.push({
                    path: '/plus/shopx/seach',
                    query: {

                    }
                })
            },
            // 返回Plus
            handlePlus: function () {
                this.$router.replace({
                    path: '/plus',
                    query: {

                    }
                })
            },
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
            }
        }
    }
</script>

<style scoped>

</style>


<template>
    <div class="goods-main" v-if="isLoadSuccess">
        <navBar title="商品详情"></navBar>

        <div class="banner" :style="'height:' + bannerHeight + 'px'">
            <swiper :options="swiperOption">
                <swiper-slide v-for="(image, index) in goods.detail.image"
                              :key="index" >
                    <div class="banner-img"
                         :style="'height:' + bannerHeight + 'px;' +
                                'background: url(' + image.file.path + ');' +
                                'background-size: cover;' +
                                'background-position: center;'"></div>
                </swiper-slide>
                <div class="swiper-pagination" slot="pagination"></div>
            </swiper>
        </div>

        <div class="content">
            <div class="content-title line-clamp-two">{{goods.detail.name}}</div>
            <div class="content-price">
                ¥{{goodsPrice}}<b style="font-size: 14px;">{{goodsPriceDecimal}}</b>
                <span class="market">
                   市场价
                   <s v-if="goods.detail.sku[0]">{{goods.detail.sku[0].line_price}}元</s>
               </span>
            </div>
            <div class="content-ask">
                <strong v-for="item in goods.detail.available_pay_type"
                      :key="item">
                    <span v-if="item == 1">ETH</span>
                    <span v-if="item == 2">INE</span>
                    <span v-if="item == 3">UTD</span>
                </strong>
            </div>
        </div>

        <div class="detail-by">
            <div v-html="goods.detail.content"></div>
        </div>

        <div class="submit" @click="showBottomPopup = !showBottomPopup">立即购买</div>

        <!--购买弹框-->
        <van-popup v-model="showBottomPopup"
                   position="bottom"
                   class="trade">
            <div class="trade-box">
                <div class="trade-header">
                    <img class="trade-header-left" src="https://yinghuo.binfenji.cn/uploads/11517354391_231972128.jpg"
                         alt="">
                    <div class="trade-header-right">
                        <div class="title line-clamp-two">{{goods.detail.name}}</div>
                        <div class="store">库存 {{stockNum}}件</div>
                        <div class="price">
                            ¥{{goodsPrice}}<b style="font-size: 14px;">{{goodsPriceDecimal}}</b>
                        </div>
                    </div>
                </div>
                <div style="max-height: 232px; overflow-y: scroll;" v-if="goods.detail.spec_type == 2">
                    <div class="trade-body" v-for="(item, index) in goods.sku_data.spec_attr" :key="item.group_id">
                        <div class="title">{{item.group_name}}</div>
                        <div class="body">
                            <span class="item"
                                  v-for="children in item.spec_items"
                                  :key="children.item_id"
                                  :class="children.active ? 'on' : ''"
                                  @click="handleSkuItem(children.item_id, index)">{{children.spec_value}}</span>
                        </div>
                    </div>
                </div>
                <div class="trade-number">
                    <div class="label">数量</div>
                    <div class="input">
                        <div class="box">
                            <span class="pull" @click="handleEditGoodsNumber(0)">-</span>
                            <input type="number" @input="handleSetGoodsNumber" @focus="handleInputBlurBack" v-model="goodsNumber" placeholder="数量"/>
                            <span class="push" @click="handleEditGoodsNumber(1)">+</span>
                        </div>
                    </div>
                </div>
                <div class="trade-footer" @click="handleSubmit">
                    确认
                </div>
            </div>
        </van-popup>
    </div>
</template>
<style src="./index.css" scoped></style>
<script>
    import {Toast, Popup} from 'vant';
    import mixins from '../../../../common/mixin';
    import navBar from '../../../../component/navBar';

    import {swiper, swiperSlide} from 'vue-awesome-swiper';
    import 'swiper/dist/css/swiper.css'

    export default {
        components: {
            Toast,
            navBar,
            swiper,
            swiperSlide,
            Popup
        },
        mixins: [mixins],

        data: () => ({
            isLoadSuccess: false,               // 页面是否加载完成
            showBottomPopup: false,             // 购买弹框
            bannerHeight: 0,                    // banner高度
            swiperOption: {                     // 轮播
                autoplay: true,
                speed: 1000,
                pagination: {
                    el: '.swiper-pagination'
                }
            },
            goods: {},                           // 商品信息
            goodsNumber: 1,                      // 购买商品数量
            stockNum: 0,                         // 库存
            goodsPrice: 0,                       // 商品价格
            goodsPriceDecimal: 0,                // 商品价格后面小数
            goodsSpecArr: [],                    // 记录规格数组
            skuIndex: '',                        // 选中的sku
        }),
        // 设置路由钩子，存储页面来源
        beforeRouteEnter(to, from, next) {
            next(vm => {          //  这里的vm指的就是vue实例，可以用来当做this使用
                sessionStorage.setItem('url_from', from.path);
            })
        },
        created() {

        },
        mounted() {
            this.handleSetBannerHeight();
            this.handleLoad();
        },
        methods: {
            // 可视窗口高度
            handleSetBannerHeight: function () {
                this.bannerHeight = document.body.clientWidth;
            },
            // 修改商品数量
            handleEditGoodsNumber: function (index) {
                if (index == 0) {
                    if (this.goodsNumber > 1) {
                        this.goodsNumber -= 1
                    } else {
                        this.goodsNumber = 1;
                    }
                } else {
                    this.goodsNumber += 1
                }
            },
            // 页面加载
            handleLoad() {
                this.request({
                    url: 'api/store/goods',
                    method: 'POST',
                    data: {
                        id: this.$route.query.id
                    },
                    success: (response) => {
                        this.goods = response;
                        console.log(this.goods.detail.min_price)
                        // 初始化库存、商品显示价格
                        if(this.goods.detail.min_price) {
                            this.stockNum = this.goods.detail.sku[0].stock;
                            this.goodsPriceDecimal = this.goods.detail.min_price.substring(this.goods.detail.min_price.length - 2);
                            this.goodsPrice = this.goods.detail.min_price.substring(0, this.goods.detail.min_price.length - 2);
                        }

                        // 加载完成标识
                        this.isLoadSuccess = true;

                        // sku初始化
                        if(this.goods.sku_data) {
                            this.goods.sku_data.spec_attr.map((data) => {
                                data.spec_items.map((children, index) => {
                                    if (index == 0) {
                                        children.active = true;
                                    } else {
                                        children.active = false;
                                    }
                                })
                            })
                        }

                        // 判断是否是多规格
                        if(this.goods.detail.spec_type == 2) {
                            this.skuIndex = this.goods.sku_data.sku_list[0].id;
                            this.handleUpdateSpecGoods(this.goods.sku_data)
                        }
                    },
                    error: (response) => {

                    },
                    complete: () => {

                    }
                });
            },
            handleUpdateSpecGoods: function (data) {
                for (let i in data.spec_attr) {
                    for (let j in data.spec_attr[i].spec_items) {
                        if (j < 1) {
                            // 记录规格数组
                            this.goodsSpecArr[i] = data.spec_attr[i].spec_items[0].item_id;
                        }
                    }
                }
                return data;
            },
            handleSkuItem: function (id, index) {
                if(this.goods.detail.spec_type != 2) {
                    return
                }
                this.goods.sku_data.spec_attr[index].spec_items.map((children, index) => {
                    if (children.item_id === id) {
                        children.active = true;
                    } else {
                        children.active = false;
                    }
                })

                for (let i in this.goods.sku_data.spec_attr) {
                    for (let j in this.goods.sku_data.spec_attr[i].spec_items) {
                        if (index == i) {
                            if (index == j) {
                                this.goods.sku_data.spec_attr[i].spec_items.map((data) => {
                                    if(data.active) {
                                        this.goodsSpecArr[i] = data.item_id;
                                    }
                                })
                            }
                        }
                    }
                }
                let spec_sku_id = this.goodsSpecArr.join('_');
                let spec_list = this.goods.sku_data.sku_list,
                skuItem = spec_list.find((val) => {
                    return val.sku_index == spec_sku_id;
                });
                // 选中的规格
                // console.log(spec_list)

                this.skuIndex = skuItem.id;
                this.stockNum = skuItem.form.stock;
                this.goodsPriceDecimal = skuItem.form.price.substring(skuItem.form.price.length - 2);
                this.goodsPrice = skuItem.form.price.substring(0, skuItem.form.price.length - 2);

                this.$set(this.goods.sku_data.spec_attr, index, this.goods.sku_data.spec_attr[index]);
            },
            // 数量必须大于0
            handleSetGoodsNumber: function() {
                if(this.goodsNumber < 1) {
                    this.goodsNumber = 1;
                }
            },
            handleSubmit: function() {

                let orderInfo = {
                    id: parseInt(this.$route.query.id),
                    sku_id: this.goods.detail.spec_type == 2 ? this.skuIndex : this.goods.detail.sku[0].id,
                    in_delivery_rule: true,
                    order_pay_price: this.goodsPrice + this.goodsPriceDecimal,
                    order_total_price: Number(this.goodsPrice + this.goodsPriceDecimal) * this.goodsNumber,
                    order_total_quantity: this.goodsNumber,
                    goods_list: [{
                        image: this.goods.detail.image[0] ? this.goods.detail.image[0].file.path : '',
                        name: this.goods.detail.name
                    }]
                };

                this.$router.push({
                    path: '/plus/shopx/order/order',
                    query: {
                        order: JSON.stringify(orderInfo)
                    }
                });


            }
        }
    }
</script>

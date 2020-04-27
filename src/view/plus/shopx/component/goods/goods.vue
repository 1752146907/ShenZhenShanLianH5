<template>
    <div>
        <van-list v-model="loading"
                  :finished="finished"
                  :offset="100"
                  :immediate-check="false"
                  finished-text="没有更多了"
                  class="goods-box"
                  @load="rollLoad" >
            <div class="goods">
                <div class="goods-item"
                     @click="handleGoods(item.id)"
                     v-for="(item, index) in goodsList"
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

<script>
    export default {
        data: () => ({
            loading: false,         // 滚动加载参数
            finished: true         // 滚动加载参数
        }),
        props: ['goodsList'],
        mounted() {

        },
        methods: {
            // 下拉加载
            rollLoad: function () {
                this.loading = false;
                this.finished = true;
                this.$toast.center('到底了');
                return
                if (this.historyList.length < this.transferRecord.total) {
                    this.page += 1;
                    this.handleLoad();
                } else {
                    this.loading = false;
                    this.finished = true;
                }
            },
            // 商品详情
            handleGoods: function (id) {
                this.$router.push({
                    path: '/plus/shopx/goods',
                    query: {
                        id: id
                    }
                })
            }
        }
    }
</script>

<style>
    .goods-box{
        background: #f5f5f5;
    }
    .goods{
        padding: 10px;
        display: flex;
        flex-wrap: wrap;
        justify-content:space-between;
        background: #f5f5f5;
    }
    .goods-item{
        width: 50%;
        padding-bottom: 4px;
        background: #f5f5f5;
        box-sizing: border-box;
    }
    .goods-item:nth-child(odd){
        padding-right: 2px;
    }
    .goods-item:nth-child(even){
        padding-left: 2px;
    }
    .goods-item-hander-box{
        padding: 12px;
        background: #ffffff;
        border-radius: 6px 6px 0 0;
    }
    .goods-item-hander{
        position: relative;
        width: 100%;
        height: 0;
        padding-bottom: 100%;
        overflow: hidden;
    }
    .goods-item-hander img{
        position: absolute;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
        -o-object-fit: cover;
        object-fit: cover;
    }
    .goods-item-body{
        background: #ffffff;
        border-radius: 0 0 6px 6px;
    }
    .goods-item-body .title{
        height: 36px;
        font-size:13px;
        font-weight:500;
        color:rgba(51,51,51,1);
        line-height:18px;
        padding: 0px 5px;
    }
    .goods-item-body .price{
        display: flex;
        height: 28px;
        font-size: 20px;
        font-weight:500;
        color:rgba(254,0,0,1);
        line-height:28px;
        align-items: baseline;
        padding: 0px 5px 4px 5px;
    }
    .goods-item-body .price .rmb{
        margin-right: 4px;
    }
    .goods-item-body .price .num{
        font-size: 13px;
    }
    .goods-item-body .price s{
        flex: 1;
        height: 28px;
        font-size:13px;
        font-weight:400;
        text-align: right;
        color:rgba(0,0,0,0.29);
        line-height:18px;
    }
    .goods-item-body-tab{
        display: flex;
        padding: 0px 6px 9px 6px;
    }
    .goods-item-body-tab span{
        color: rgba(0, 0, 0, 0.29);
        font-size: 12px;
        margin-right: 10px;
        padding: 2px 4px;
        border-radius: 2px;
        border: 1px solid rgba(0, 0, 0, 0.29);
    }
</style>

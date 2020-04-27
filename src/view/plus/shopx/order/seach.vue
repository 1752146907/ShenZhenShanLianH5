<template>
    <div class="seach">
        <navBar title="搜索订单" class="seachBottom"></navBar>
        <van-search
                placeholder="搜索商品"
                show-action >
            <div slot="action">搜索</div>
        </van-search>

        <div class="orderStatus">
            <div class="orderDate">
                <p>2018-12-12 11:11:11</p>
                <p>已发货</p>
            </div>
            <div class="specifications">
                <img />
                <div class="specifications-text">
                    <p>百草味 原切牛肉粒 50g*2袋 肉干肉类熟食休闲零食小吃…</p>
                    <span>原味</span>
                    <div class="price">
                        <p>1,180.00 UTD</p>
                        <p> X 100</p>
                    </div>
                </div>
            </div>
            <div class="amount">
                <p>合计: 1180.00 UTD</p>
                <span>查询物流</span>
            </div>
        </div>

        <div class="orderStatus">
            <div class="orderDate">
                <p>2018-12-12 11:11:11</p>
                <p>已发货</p>
            </div>
            <div class="specifications">
                <img />
                <div class="specifications-text">
                    <p>百草味 原切牛肉粒 50g*2袋 肉干肉类熟食休闲零食小吃…</p>
                    <span>原味</span>
                    <div class="price">
                        <p>1,180.00 UTD</p>
                        <p> X 100</p>
                    </div>
                </div>
            </div>
            <div class="amount">
                <p>合计: 1180.00 UTD</p>
                <span>查询物流</span>
            </div>
        </div>
        <barOverlay />
    </div>
</template>

<style src="./seach.css" scoped></style>
<script>
    import mixins from '../../../../common/mixin';
    import navBar from '../../../../component/navBar';
    import Goods from '../component/goods/goods.css';
    import barOverlay from '../../../../component/barOverlay/index';

    export default {
        components: {
            navBar,
            Goods,
            barOverlay
        },
        mixins: [mixins],

        data: () => ({
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

        },
        methods: {
            handleNavbar: function (id) {
                this.$router.push({
                    path: '/plus/category/index',
                    query: {
                        id: id
                    }
                });
            }
        }
    }
</script>

<style scoped>

</style>

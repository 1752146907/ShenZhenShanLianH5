<template>
    <div class="tabbar">
        <div class="tabbar-item" :class="active == 0 ? 'tabbar-item-active' : ''" @click="handleTabbar(0)">
            <img v-if="active === 0" src="./home-on.png" alt="">
            <img v-else src="./home.png" alt="">
            首页
        </div>
        <div class="tabbar-item" :class="active == 1 ? 'tabbar-item-active' : ''" @click="handleTabbar(1)">
            <img v-if="active === 1" src="./order-on.png" alt="">
            <img v-else src="./order.png" alt="">
            订单
        </div>
        <div class="tabbar-item" :class="active == 2 ? 'tabbar-item-active' : ''" @click="handleTabbar(2)">
            <img v-if="active === 2" src="./my-on.png" alt="">
            <img v-else src="./my.png" alt="">
            我的
        </div>
    </div>
</template>

<style>
    .tabbar{
        height: 49px;
        display: flex;
        align-items: center;
        text-align: center;
        box-shadow:0px 10px 25px 0px rgba(0,0,0,0.1);
        position: fixed;
        left: 0px;
        right: 0px;
        bottom: 0px;
        background: #ffffff;
        z-index: 9;
    }
    .tabbar-item{
        flex: 1;
        color: #DADADA;
        font-size: 11px;
    }
    .tabbar-item-active{
        color: #FE0000;
    }
    .tabbar-item img{
        width: 22px;
        height: 22px;
        margin: 0 auto 2px auto;
        display: block;
    }
</style>

<script>
    export default {
        components: {

        },
        props: {
            active: {
                type: Number,
                required: true
            }
        },
        data: () => ({

        }),
        created () {

        },
        methods: {
            handleTabbar: function (index) {
                if(index == 0){
                    this.$router.push({
                        path: '/plus/shopx/index'
                    });
                }
                if(index == 1){
                    this.$router.push({
                        path: '/plus/shopx/order/orderList'
                    });
                }
                if(index == 2){
                    this.$router.push({
                        path: '/plus/shopx/my'
                    });
                }
            }
        }
    }
</script>

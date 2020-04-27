<template>
    <div class="detail" >
        <navBar title="订单详情"></navBar>
        <div class="detail-head flex-div padding-10 margin-bottom-10">
            <div>
                <img v-if="false" src="./image/icon_car.png" alt="" class="icon_car">
                <img v-if="true" src="./image/icon_tuihuo.png" alt="" class="icon_tuihuo">
            </div>
            <div class="flex-left">售后待收货</div>
            <div class="flex-right"><span>查询物流</span></div>
        </div>
        <div class="padding-10">
            <div class="font-title flex-div">
                <div>退货地址</div>
            </div>
            <div class="flex-div">
                <div class="flex-left">收货人</div>
                <div class="flex-right">时代光华</div>
            </div>
            <div class="flex-div">
                <div class="flex-left">联系电话</div>
                <div class="flex-right">13813813800</div>
            </div>
            <div class="flex-div">
                <div class="flex-left">详细地址</div>
                <div class="flex-right">广东省深圳市宝安区西乡桃源居 15区11</div>
            </div>
        </div>
        <div class="padding-10 margin-bottom-10 express-info">
            <div class="flex-div">
                <div class="flex-left">物流公司</div>
                <div class="flex-right">韵达快递</div>
            </div>
            <div class="flex-div">
                <div class="flex-left">物流单号</div>
                <div class="flex-right">1234567890123456</div>
            </div>
        </div>
        <div class="padding-10 margin-bottom-10">
            <div class="font-title">
                <span>售后信息</span>
            </div>
            <div class="flex-div">
                <div class="flex-left">售后类型</div>
                <div class="flex-right">退款</div>
            </div>
            <div class="flex-div">
                <div class="flex-left">退款金额</div>
                <div class="flex-right"><countTo :startVal='0' :decimals="2" :endVal='1800' :duration='1'></countTo> UTD</div>
            </div>
            <div class="flex-div">
                <div class="flex-left">申请原因</div>
                <div class="flex-right">边角处破损</div>
            </div>
            <div class="aftersales-info-image">
                <img src="./image/icon_tuihuo.png" alt="">
                <img src="./image/icon_tuihuo.png" alt="">
                <img src="./image/icon_tuihuo.png" alt="">
                <img src="./image/icon_tuihuo.png" alt="">
                <img src="./image/icon_tuihuo.png" alt="">
            </div>
        </div>
        <div class="user-address flex-div padding-10 margin-bottom-10">
            <div><img src="./image/icon_location.png" alt=""></div>
            <div>
                <div class="user-info">
                    <span>爱新觉罗</span>
                    <span>18888888888</span>
                </div>
                <div class="address-info">
                    <span>地址：广东省深圳市南山区大冲商务中心B座</span>
                </div>
            </div>
        </div>
        <div class="goods-info margin-bottom-10">
            <div class="goods-info-img"><img src="./image/icon_tuihuo.png" alt=""></div>
            <div class="goods-info-detail">
                <div class="goods-info-title">
                    百草味 原切牛肉粒 50g*2袋 肉干肉类熟食休闲零食小吃
                </div>
                <div class="goods-info-type">
                    <span>五香</span>
                </div>
                <div class="goods-info-price">
                    <div class="goods-info-money">
                        <countTo :startVal='0' :decimals="2" :endVal='1800' :duration='1'></countTo>
                        <span class="font-utd">UTD</span>
                    </div>
                    <div class="goods-info-number">X 122</div>
                </div>
            </div>
        </div>
        <div class="order-info padding-10">
            <div class="font-title">
                <span>订单信息</span>
            </div>
            <div class="flex-div">
                <div class="flex-left">实际支付</div>
                <div class="flex-right"><countTo :startVal='0' :decimals="2" :endVal='1800' :duration='1'></countTo> UTD</div>
            </div>
            <div class="flex-div">
                <div class="flex-left">订单编号</div>
                <div class="flex-right">20185548411231321</div>
            </div>
            <div class="flex-div">
                <div class="flex-left">下单时间</div>
                <div class="flex-right">2018-12-12 11:11:11</div>
            </div>
        </div>
        <div style="height: 49px"></div>
        <div class="toReturn-btn" @click="handleToReturn">去退货</div>
    </div>
</template>
<style src="./detail.css" scoped></style>
<script>
    import mixins from '../../common/mixin';
    import navBar from '../../component/navBar';
    import countTo from 'vue-count-to';

    export default {
        components: {
            navBar,
            countTo
        },
        mixins: [mixins],

        data: () => ({
            express: {},
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


        }
    }
</script>


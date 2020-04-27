<template>
    <div class="order">
        <van-popup
                v-model="show"
                round
                position="bottom"
                :style="{ height: '470px' }"
                @click-overlay="cancel"
        >
            <!--支付提交-->
            <div v-if="switcha">
                <div class="defrayal-three">
                    <div class="defrayal">
                        <p>确认支付</p>
                        <van-icon name="cross" @click="cancel" size="23px" color="rgba(181, 181, 181, 1)"/>
                    </div>
                </div>
                <div class="amountOfPayment ">
                    <countTo :startVal='0' :decimals="2" :endVal='Number(orderAmount.amount)' :duration='1'></countTo>
                    {{unit}}
                </div>
                <div class="defrayal-one">
                    <div class="identifier">
                        <p>订单金额</p>
                        <p>￥
                            <countTo :startVal='0' :decimals="2" :endVal='Number(orderAmount.pay_price)'
                                     :duration='1'></countTo>
                        </p>
                    </div>
                </div>
                <div class="defrayal-one">
                    <div class="identifier" ><!-- @click="changingOver"  <van-icon name="arrow" size="18px" color="rgba(181, 181, 181, 1)"/>  -->
                        <p>支付方式</p>
                        <p class="payment-way" >{{unit}}支付

                        </p>
                    </div>
                </div>
                <div class="defrayal-two defrayal-one">
                    <div class="payoff">
                        <p>可用余额</p>
                        <p>
                            <countTo :startVal='0' :decimals="2" :endVal='Number(orderAmount.balance)'
                                     :duration='1'></countTo>
                            {{unit}}
                        </p>
                    </div>
                </div>
                <!--
                <div class="identifying" >
                    <input type="text" placeholder="请输入验证码" v-model="code" @input="handleGetStatus" @focus="handleInputBlurBack" />
                    <p @click="handleGetCode" v-if="!isCode">获取验证码</p>
                    <p class="identifying-right" v-else>{{codeTime}}S</p>
                </div>
                -->
                <div v-if="isActivw" class="affirm-active" @click="defray">确认支付</div>
                <div v-else class="affirm">余额不足</div>
            </div>
            <!--支付方式选择-->
            <div v-else="switcha">
                <div class="mode-of-payment ">
                    <van-icon name="arrow-left" size="17px" color="rgba(181, 181, 181, 1)" @click="changingTwo"/>
                    <p>选择付款方式</p>
                </div>
                <div class="currency" @click="currencyWay('3')">
                    <img src="../../image/utd_currency_01.png"/>
                    <div class="currencyText">
                        <p>UTD支付</p>
                        <van-icon name="success" size="20px" color="rgba(255, 48, 19, 1)" v-if="icon==3"/>
                    </div>
                </div>
                <div class="currency" @click="currencyWay('2')">
                    <img src="../../image/ine_currency_03.png"/>
                    <div class="currencyText">
                        <p>INE支付</p>
                        <van-icon name="success" size="20px" color="rgba(255, 48, 19, 1)" v-if="icon==2"/>
                    </div>
                </div>
                <div class="currency" @click="currencyWay('1')">
                    <img src="../../image/eth_currency_02.png"/>
                    <div class="currencyText">
                        <p>ETH支付</p>
                        <van-icon name="success" size="20px" color="rgba(255, 48, 19, 1)" v-if="icon==1"/>
                    </div>
                </div>
            </div>
        </van-popup>

        <navBar title="确认订单" class="orderBottom"/>

        <div class="receiving" @click="takeSkip" v-if="!isDefaultAddress">
            <p>新增收货地址</p>
            <van-icon name="arrow" color="rgba(51, 51, 51, 0.5)"/>
        </div>
        <div class="address" v-else @click="takeSkip">
            <div class="address-left">
                <van-icon size="20" name="location-o"/>
            </div>
            <div class="address-center" v-if="order.address">
                <p>
                    {{order.address.name}} <span>{{order.address.phone}}</span>
                </p>
                <p>地址：{{order.address.region.city}} {{order.address.region.province}} {{order.address.region.region}} {{order.address.detail}}</p>
            </div>
            <div class="address-right">
                <i class="van-icon van-icon-arrow" style="color: #333333; font-size: 18px;"><!----></i>
            </div>
        </div>
        <div class="information" v-if="order.goods_list">
            <img :src="order.goods_list[0].image"/>
            <div class="invitation-text">
                <p>{{order.goods_list[0].name}}</p>
                <div class="price">
                    <p>￥{{order.order_pay_price}} </p>
                    <p>X {{order.order_total_quantity}}</p>
                </div>
            </div>
        </div>
        <div class="expenses">
            <p>商品总额</p>
            <p>￥ {{order.order_total_price}}</p>
        </div>
        <div class="expenses">
            <p>配送费用</p>
            <p>￥ {{express_price}}</p>
        </div>
        <div class="message">
            <input type="text" v-model="comments" placeholder="选填: 买家留言(50字以内) "/>
        </div>
        <div class="bottom">
            <p>合计: <span>￥{{Number(order.order_total_price) + Number(express_price) }} </span></p>
            <div class="button" @click="showPopup">提交订单</div>
        </div>
    </div>
</template>
<style src="./index.css" scoped></style>
<script>
    import mixins from '../../../../common/mixin';
    import navBar from '../../../../component/navBar';
    import {Icon, Dialog, Popup,Toast } from 'vant';
    import countTo from 'vue-count-to';

    export default {
        components: {
            navBar,
            Icon,
            Dialog,
            Popup,
            countTo,
            Toast
        },
        mixins: [mixins],
        data: () => ({
            show: false,		// 是否激活支付按钮
            code: "",
            codeTime: 60,       // 手机倒计时
            isCode: false,     // 是否显示发生验证码
            switcha: true,
            order: {},   //订单信息
            comments: "",  //买家留言
            orderAmount: {},   //订单支付信息
            isActivw: false,     //支付按钮
            orderID: "",         //订单ID
            isDefaultAddress: false,       //判断是否有默认地址
            icon: 3,   //支付方式  1等于ETH 2等于INE 3等于UTD
            unit: "UTD",      //单位
            transferRecord: {},             // 用户地址信息
            support:[],                  //支持的付款方式
            express_price:0             //运费
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
            this.order = JSON.parse(this.$route.query.order);
            console.log(JSON.parse(this.$route.query.order));
            this.handleGetUserAddress();

        },
        methods: {
          //商品信息
            information:function () {
                this.request({
                    url: 'api/store/order',
                    method: 'GET',
                    data: {
                        id: this.order.id,
                        quantity: this.order.order_total_quantity,
                        sku_id: this.order.sku_id,
                        remark: ''
                    },
                    success: (response) => {
                        this.express_price = response.express_price
                      console.log(response)
                    },
                    error: (response) => {
                    },
                    complete: () => {

                    }
                });
            },
            //提交订单
            showPopup: function () {
                this.request({
                    url: 'api/store/order',
                    method: 'POST',
                    data: {
                        id: this.order.id,
                        quantity: this.order.order_total_quantity,
                        sku_id: this.order.sku_id,
                        remark: this.comments,
                    },
                    success: (response) => {
                        this.orderID = response.id;
                        //获取订单支持币种默认选择第一个
                        this.request({
                            url: 'api/store/goods',
                            method: 'POST',
                            data: {
                                id: this.order.id,
                            },
                            success: (response) => {
                                this.support =response.detail.available_pay_type;
                                if (response.detail.available_pay_type[0] == 1) {
                                    this.icon = 1;
                                    this.unit = "ETH";
                                }
                                if (response.detail.available_pay_type[0] == 2) {
                                    this.icon = 2;
                                    this.unit = "INE";
                                }
                                if (response.detail.available_pay_type[0] == 3) {
                                    this.icon = 3;
                                    this.unit = "UTD";
                                }
                                //支付信息前置获取
                                this.request({
                                    url: 'api/store/order',
                                    method: 'PUT',
                                    data: {
                                        id: this.orderID,
                                        pay_type: response.detail.available_pay_type[0]
                                    },
                                    success: (response) => {
                                        this.orderAmount = response;
                                        this.show = true;
                                        if (Number(this.orderAmount.balance) >= Number(this.orderAmount.amount)) {
                                            this.isActivw = true;
                                        } else {
                                            this.isActivw = false;
                                        }
                                    },
                                    error: (response) => {
                                    },
                                    complete: () => {
                                    }
                                });
                            },
                            error: (response) => {
                            },
                            complete: () => {
                            }
                        });

                    },
                    error: (response) => {
                    },
                    complete: () => {
                    }
                });
            },
            cancel: function () {
                this.$router.replace({
                    path: "/plus/shopx/order/orderList",
                    query: {}
                });
            },
            //支付方式
            currencyWay: function (index) {

                if(this.support.indexOf(index) === -1){
                    Toast('目前不支持此支付方式');
                    return
                }
                if (index == 1) {
                    this.icon = 1;
                    this.unit = "ETH";
                }
                if (index == 2) {
                    this.icon = 2;
                    this.unit = "INE";
                }
                if (index == 3) {
                    this.icon = 3;
                    this.unit = "UTD";
                }
                //更改支付方式
                this.request({
                    url: 'api/store/order',
                    method: 'PUT',
                    data: {
                        id: this.orderID,
                        pay_type: index
                    },
                    success: (response) => {
                        this.orderAmount = response;
                        this.show = true;
                        if (Number(this.orderAmount.balance) >= Number(this.orderAmount.amount)) {
                            this.isActivw = true;
                        } else {
                            this.isActivw = false;
                        }
                    },
                    error: (response) => {

                    },
                    complete: () => {

                    }
                });
                this.icon = index;
                this.switcha=true;
            },
            //支付
            defray: function () {
                this.request({
                    url: 'api/store/order',
                    method: 'PATCH',
                    data: {
                        id: this.orderID,
                        pay_type: this.icon,

                    },
                    success: (response) => {
                        this.$router.push({
                            path: '/plus/shopx/order/success',
                            query: {
                                id: this.orderID
                            }
                        })
                    },
                    error: (response) => {
                    },
                    complete: () => {

                    }
                });
            },
            takeSkip: function () {
                this.$router.push({
                    path: "/plus/shopx/address",
                    query: {
                        fromOrder: true,
                        order: this.$route.query.order
                    }
                })
            },
            // 初始化用户地址信息
            handleGetUserAddress: function() {
                this.information();
                this.request({
                    url: 'api/store/address',
                    method: 'GET',
                    data: { },
                    success: (response) => {
                        this.transferRecord = response;
                        this.isDefaultAddress = false;

                        this.transferRecord.list.map((data) => {
                            if(this.transferRecord.default_id == data.id) {
                                this.isDefaultAddress = true;
                                this.order.address = data;
                            }
                        })
                    },
                    error: (response) => {

                    },
                    complete: (response) => {
                    }
                });
            },
            /*
            获取验证码链接
            handleGetCode: function () {
                this.request({
                    url: 'api/sendMobileCode',
                    data: {
                        mobile: 15013663961
                    },
                    success: (response) => {
                        this.isCode = !this.isCode;

                        let timer = setInterval(() => {
                            if(this.codeTime > 0) {
                                this.codeTime = this.codeTime - 1;
                            } else {
                                this.codeTime = 60;
                                this.isCode = !this.isCode;

                                clearInterval(timer)
                            }
                        }, 1000)
                    },
                    error: (response) => {
                    },
                    complete: () => {

                    }
                });
            },*/
            changingOver: function () {
                this.switcha = false
            },
            changingTwo: function () {
                this.switcha = true
            }
        }
    }
</script>

<style scoped>

</style>

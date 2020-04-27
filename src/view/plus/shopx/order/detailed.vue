<template>
    <div class="detailed">

        <div class="shopkeeperImg" >
            <i class="bar-back van-icon van-icon-arrow-left" style="font-size: 20px;" @click="shopkeeperImg"><!----></i>
            订单详情
        </div>
         <div class="orderStatus " v-if="information.state_text">
             <div class="payment" v-if="information.state_text.value === 1">
                 <p><img src="../../image/order_09.png"/> 待支付</p>
                 <p v-if="this.information.pay_remain_time">倒计时关闭 :<van-count-down :time="time" /></p>
             </div>
             <div class="payment" v-if="information.state_text.value === 2">
                 <p><img src="../../image/order_04.png"/> 已取消</p>

             </div>
             <div class="payment" v-if="information.state_text.value === 3">
                 <p><img src="../../image/order_07.png"/> 待发货</p>
             </div>
             <div class="payment" v-if="information.state_text.value === 4">
                 <p><img src="../../image/order_02.png"/> 待收货</p>
                 <div class="express" @click="handexpress">查看物流</div>
             </div>
             <div class="payment" v-if="information.state_text.value === 5">
                 <p><img src="../../image/order_05.png"/> 已完成</p>
                 <div class="express" @click="handexpress">查看物流</div>
             </div>
             <div class="payment" v-if="information.state_text.value === 6">
                 <p><img src="../../image/order_07.png"/> 待发货</p>
                 <div class="examine">审核中</div>
             </div>
         </div>
         <div class="address" v-if="information.address">
                 <p><van-icon name="location-o" />{{information.address.name}} <span>{{information.address.phone}}</span></p>
                 <p>地址: {{information.address.region.city}} {{information.address.region.province}} {{information.address.region.region}} {{information.address.detail}}</p>
         </div>
            <div class="specifications" v-if="information.goods">
                <img :src="information.goods[0].image.file.path"  v-if="information.goods[0].image"/>
                <img v-else />
                <div class="specifications-text">
                    <p>{{commodity}}</p>
                    <span v-if="information.goods[0].goods_attr !== ''">{{information.goods[0].goods_attr}}</span>
                    <div class="price">
                        <p>￥{{information.goods[0].price}} </p>
                        <p> X {{information.goods[0].total_quantity}}</p>
                    </div>
                </div>
            </div>
        <div class="orderNumber">
            <div class="orderNumberDate">
                  <p>订单编号: {{information.code}} <span  v-clipboard:copy="information.code"
                                                       v-clipboard:success="handleOnCopy"
                                                       v-clipboard:error="handleOnError" >复制</span></p>
                  <p>下单时间: {{information.created_at}}</p>
            </div>
            <div class="total" v-if="information.goods">
                    <p>商品总额</p>
                    <p>￥{{information.goods[0].total_price}} </p>
            </div>
        </div>
        <div class="expressPrice">
            <p>配送费用</p>
            <p>￥ {{information.express_price}}</p>
        </div>
        <div v-if="information.state_text">
        <div class="expressPrice" v-if="information.state_text.value !== 1 && information.state_text.value !== 2">
            <p>付款方式</p>
            <p> {{information.pay_amount}} {{information.pay_type.text}}</p>
        </div>
        </div>
        <div v-if="information.state_text">
            <div class="bottom" v-if="information.state_text.value === 1">
                <p>合计: <span>￥{{information.pay_price}} </span></p>
                <div class="button" @click="showPopup">提交订单</div>
            </div>

            <div class="cancel" v-if="information.state_text.value === 3" @click="cancelOrder">
                取消订单
            </div>
            <div class="cancel" v-if="information.state_text.value === 4" @click="takeDelivery" >
                确认收货
            </div>
        </div>
        <van-popup
                v-model="show"
                round
                position="bottom"
                :style="{ height: '470px' }"
        >
            <!--支付提交-->
            <div v-if="switcha">
            <div class="defrayal-three">
                <div class="defrayal">
                    <p>确认支付</p>
                    <van-icon name="cross" @click="cancel" size="23px" color="rgba(181, 181, 181, 1)" />
                </div>
            </div>
            <div class="amountOfPayment ">
                <countTo :startVal='0' :decimals="2" :endVal='Number(orderAmount.amount)' :duration='1'></countTo>{{unit}}
            </div>
            <div class="defrayal-one">
                <div class="identifier">
                    <p>订单金额</p>
                    <p>￥<countTo :startVal='0' :decimals="2" :endVal='Number(orderAmount.pay_price)' :duration='1'></countTo></p>
                </div>
            </div>
            <div class="defrayal-one">
                <div class="identifier">  <!-- @click="changingOver"   <van-icon name="arrow"  size="18px" color="rgba(181, 181, 181, 1)" /> -->
                    <p>支付方式</p>
                    <p class="payment-way">{{unit}}支付</p>
                </div>
            </div>
            <div class="defrayal-two defrayal-one">
                <div class="payoff">
                    <p>可用余额</p>
                    <p><countTo :startVal='0' :decimals="2" :endVal='Number(orderAmount.balance)' :duration='1'></countTo>{{unit}}</p>
                </div>
            </div>

                <div v-if="isActivw" class="affirm-active" @click="defray">确认支付</div>
                <div v-else class="affirm">余额不足</div>
            </div>
           <!--支付方式选择-->
            <div v-else="switcha">
                <div class="mode-of-payment ">
                        <van-icon name="arrow-left" size="17px" color="rgba(181, 181, 181, 1)"  @click="changingTwo"/>
                        <p>选择付款方式</p>
                </div>

                <div class="currency" @click="currencyWay('3')">
                <img src="../../image/utd_currency_01.png" />
                <div class="currencyText">
                    <p>UTD支付</p>
                    <van-icon  name="success" size="20px" color="rgba(255, 48, 19, 1)"  v-if="icon==3" />
                </div>
                </div>

                <div class="currency" @click="currencyWay('2')">
                    <img src="../../image/ine_currency_03.png" />
                    <div class="currencyText">
                        <p>INE支付</p>
                        <van-icon  name="success" size="20px" color="rgba(255, 48, 19, 1)"  v-if="icon==2" />
                    </div>
                </div>

                <div class="currency" @click="currencyWay('1')">
                    <img src="../../image/eth_currency_02.png" />
                    <div class="currencyText">
                        <p>ETH支付</p>
                        <van-icon  name="success" size="20px" color="rgba(255, 48, 19, 1)"  v-if="icon==1" />
                    </div>
                </div>

            </div>
        </van-popup>

    </div>
</template>
<style src="./detailed.css" scoped></style>
<script>
    import navBar from '../../../../component/navBar';
    import mixins from '../../../../common/mixin';
    import { Icon ,CountDown ,Toast,Dialog  } from 'vant';
    import countTo from 'vue-count-to';
    export default {
        components:{
            navBar,
            Icon,
            CountDown,
            countTo,
            Toast,
            Dialog
        },
        mixins: [mixins],
        data: () => ({
            time: "",
            show: false,		// 是否激活支付按钮
            code:"",                 //短信验证码
            codeTime: 60,                   // 手机倒计时
            isCode: false,                  // 是否显示发生验证码
            switcha:true,
            isActivw: false,		// 是否激活支付按钮
            icon:3,
            information:{},         //订单信息
            orderAmount:{},
            support:[],                  //支持的付款方式
            unit: "UTD",      //单位
            orderID:"" ,     //订单ID
            commodity:""  //商品名称
        }),
        created () {

        },
        beforeRouteEnter(to, from, next) {
            next(vm=>{          //  这里的vm指的就是vue实例，可以用来当做this使用
                sessionStorage.setItem('url_from', from.path);
            })
        },
        mounted(){
         this.orderDetailed();
            this.orderID =this.$route.query.id;
        },
        methods: {
            //查看物流
            handexpress:function () {
                this.$router.push({
                    path:"/plus/shopx/order/express",
                    query: {
                        id:this.$route.query.id
                    }
                })
            },
            //确认收货
            takeDelivery:function () {
                this.request({
                    url: 'api/store/orders',
                    method: 'PATCH',
                    data: {
                        id:this.$route.query.id,
                    },
                    success: (response) => {
                        this.orderDetailed();

                    },
                    error: (response) => {
                    },
                    complete: () => {

                    }
                });
            },
            //取消订单
            cancelOrder:function () {
                Dialog.confirm({
                    confirmButtonColor:"rgba(255, 49, 16, 1)",
                    title: '提示',
                    message: '确认取消订单'
                }).then(() => {
                    this.request({
                        url: 'api/store/order',
                        method: 'DELETE',
                        data: {
                            id:this.$route.query.id,

                        },
                        success: (response) => {
                            this.orderDetailed();

                        },
                        error: (response) => {
                        },
                        complete: () => {

                        }
                    });
                }).catch(() => {
                    // on cancel
                });
            },
            // 复制成功
            handleOnCopy: function (e) {
                this.$toast.center('复制成功！');
            },
            // 复制失败
            handleOnError: function (e) {
                this.$toast.center('复制失败，请稍后重试');
            },
            //订单信息
            orderDetailed:function () {
                this.request({
                    url: 'api/store/orders',
                    method: 'POST',
                    data: {
                        id:this.$route.query.id,

                    },
                    success: (response) => {
                        this.information = response;
                        if(response.goods[0].name.length >34){
                            this.commodity =response.goods[0].name.substring(0,34)+ "..."
                        }else {
                            this.commodity =response.goods[0].name
                        }
                        this.time=(Number(this.information.pay_remain_time+'000'));



                    },
                    error: (response) => {
                    },
                    complete: () => {

                    }
                });
            },
            shopkeeperImg:function () {
                this.$router.push({
                    path:"/plus/shopx/order/orderList"
                })
            },
            //处理软键盘导致弹框里的按钮响应区域错位
            scrollBack: function () {
                setTimeout(function() {
                    var scrollHeight = document.documentElement.scrollTop || document.body.scrollTop || 0;
                    window.scrollTo(0, Math.max(scrollHeight - 1, 0));
                }, 100);
            },

            showPopup:function () {
                //获取订单是否超时
                this.request({
                    url: 'api/store/orders',
                    method: 'POST',
                    data: {
                        id:this.$route.query.id,

                    },
                    success: (response) => {
                        if(response.pay_remain_time == null){
                            this.$toast.center('订单已超时无法付款！');
                        }
                      else {
                            //获取订单支持币种默认选择第一个
                            this.request({
                                url: 'api/store/goods',
                                method: 'POST',
                                data: {
                                    id:this.information.goods[0].goods_id,

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
                                    //支付信息前置
                                    this.request({
                                        url: 'api/store/order',
                                        method: 'PUT',
                                        data: {
                                            id:this.$route.query.id,
                                            pay_type:response.detail.available_pay_type[0]
                                        },
                                        success: (response) => {
                                            this.orderAmount = response;
                                            this.show = true;
                                            if (Number(this.orderAmount.balance) >=  Number(this.orderAmount.amount)) {
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

                        }


                    },
                    error: (response) => {
                    },
                    complete: () => {

                    }
                });

            },
            cancel:function () {
                this.show = false
            },

            //支付方式
            currencyWay:function (index) {
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
            defray:function () {
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
            // 获取输入框状态
            handleGetStatus: function (value) {


                if(this.code.length == 6) {
                    this.isActivw = true;
                } else{
                    this.isActivw = false;
                }
            },
            changingOver:function () {
                this.switcha = false
            },
            changingTwo:function () {
                this.switcha = true
            }

        }
    }

</script>

<style scoped>

</style>
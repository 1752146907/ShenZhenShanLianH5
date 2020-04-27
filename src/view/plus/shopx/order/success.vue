<template>
    <div>
        <div class="shopkeeperImg" >
            <i class="bar-back van-icon van-icon-arrow-left" style="font-size: 20px;" @click="shopkeeperImg"><!----></i>

            支付成功
        </div>
        <div class="success-images">
            <img src="../../image/success_01.png"/>
            <p class="success-text">支付成功</p>
            <div class="push-button">
                <p @click="shopping">继续购物</p>
                <p @click="lookOrder">查看订单</p>
            </div>
        </div>
    </div>
</template>
<style src="./success.css" scoped></style>
<script>
    import navBar from '../../../../component/navBar';
    import mixins from '../../../../common/mixin';
    export default {
        components:{
            navBar
        },
        mixins: [mixins],
        data: () => ({

        }),
        created () {

        },
        beforeRouteEnter(to, from, next) {
            next(vm=>{          //  这里的vm指的就是vue实例，可以用来当做this使用
                sessionStorage.setItem('url_from', from.path);
            })
        },
        methods: {
            shopping:function () {
              this.$router.push({
                  path:"/plus/shopx/index"
              })
            },
            lookOrder:function(){
                this.$router.push({
                    path:"/plus/shopx/order/detailed",
                    query: {
                      id:this.$route.query.id
                    }
                })
            },
            shopkeeperImg:function () {
                this.$router.push({
                    path:"/plus/shopx/order/orderList"
                })
            }
        }
    }

</script>

<style scoped>

</style>
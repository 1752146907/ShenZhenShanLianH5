<template>
    <div class="orderList" style="-webkit-overflow-scrolling:touch">
        <div class="shopkeeperImg" >
            订单列表
        </div>
        <div>
            <van-tabs @click="onClick">
                <van-tab title="全部"></van-tab>
                <van-tab title="待支付"></van-tab>
                <van-tab title="待发货"></van-tab>
                <van-tab title="待收货"></van-tab>
            </van-tabs>
        </div>
        <van-list v-model="loading"
                  :finished="finished"
                  :offset="200"
                  :immediate-check="false"
                  finished-text="没有更多了"
                  @load="rollLoad" >
        <div class="orderStatus"  @click.stop="detailed(item.id)"  v-for="(item, index) in historyList"
             :key="index">
                 <div class="orderDate">
                     <p>{{item.created_at}}</p>
                     <p v-if="item.state_text.value!==6">{{item.state_text.text}}</p>
                     <p v-if="item.state_text.value ===6">待发货</p>
                 </div>
                <div class="specifications">
                    <img :src="item.goods[0].image.file.path"  v-if="item.goods[0].image"/>
                    <img  v-else>
                    <div class="specifications-text">
                        <p>{{item.goods[0].name.length > 34 ? item.goods[0].name.substring(0,34)+ "...":item.goods[0].name }}</p>
                        <span v-if="item.goods[0].goods_attr !== ''">{{item.goods[0].goods_attr}} </span>
                        <div class="price">
                               <p>￥{{item.goods[0].total_pay_price}} </p>
                               <p> X {{item.goods[0].total_quantity}}</p>
                         </div>
                    </div>
                </div>
               <div class="amount">
                <p>合计: ￥{{item.pay_price}} </p>
                <span @click.stop="handexpress(item.id)"  v-if="item.state_text.value === 4" >查询物流</span>
                <p  v-if="item.state_text.value === 6" >取消申请中</p>
                </div>
            </div>
        </van-list>

        <Footer  :active="1" />
    </div>
</template>
<style src="./orderList.css" scoped></style>
<script>
    import navBar from '../../../../component/navBar';
    import { Tab, Tabs  } from 'vant';
    import mixins from '../../../../common/mixin';
    import Footer from '../component/footer/footer';
    export default {
        components:{
            navBar,
            Tab,
            Tabs,
            Footer
        },
        mixins: [mixins],
        data: () => ({
            size: 10,
            page: 1,
            active: 1,
            loading: false,         // 滚动加载参数
            finished: false,        // 滚动加载参数
            transferRecord: {},     // 请求回来的数据
            historyList: [],        // 历史列表
            status:0,      //列表切换下滑索引


        }),
        created () {

        },
        mounted(){
         this.orderList()
        },
        beforeRouteEnter(to, from, next) {
            next(vm=>{          //  这里的vm指的就是vue实例，可以用来当做this使用
                sessionStorage.setItem('url_from', from.path);
            })
        },
        methods: {
            // 下拉加载
            rollLoad: function() {
                if(this.historyList.length < this.transferRecord.total) {
                    this.page += 1;
                    this.orderList();
                } else{
                    this.loading = false;
                    this.finished = true;
                }
            },
            //订单列表信息
            orderList:function () {
                this.request({
                    url: 'api/store/orders',
                    method: 'GET',
                    data: {
                        "name": "",
                        "status": this.status,
                        "page": this.page,
                        "size": this.size
                    },
                    success: (response) => {
                         this.transferRecord = response;
                         this.historyList = this.historyList.concat(this.transferRecord.list);
                    },
                    error: (response) => {
                    },
                    complete: (response) => {
                        // 关闭列表滚动
                        this.loading = false;
                        if(this.historyList.length >= this.transferRecord.total){
                            this.finished = true;
                        }
                    }
                });
            },
            handleSeach:function(){
                this.$router.push({
                    path:"/plus/shopx/order/seach"
                })
            },
            shopkeeperImg:function () {
                this.$router.push({
                    path:"/plus/shopx/index"
                })
            },
            detailed:function (e) {
                this.$router.push({
                    path:"/plus/shopx/order/detailed",
                    query:{
                        id:e
                    }
                })
            },
            onClick(name) {
                this.status = name;
                this.page = 1;
                this.request({
                    url: 'api/store/orders',
                    method: 'GET',
                    data: {
                        "name": "",
                        "status": name,
                        "page": this.page,
                        "size": this.size
                    },
                    success: (response) => {
                        this.historyList=[];
                        this.transferRecord = response;
                        this.historyList = this.historyList.concat(this.transferRecord.list);
                    },
                    error: (response) => {
                    },
                    complete: (response) => {
                        // 关闭列表滚动

                    }
                });
            },
            //查看物流
            handexpress:function (e) {
                this.$router.push({
                    path:"/plus/shopx/order/express",
                    query: {
                        id:e
                    }
                })
            }
        }
    }
</script>
<style scoped>

</style>
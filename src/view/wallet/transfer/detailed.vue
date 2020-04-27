<template>
    <div>
        <div class="shopkeeperImg" v-if="skip"  >
            <i class="bar-back van-icon van-icon-arrow-left" style="font-size: 20px;" @click="backing"><!----></i>
            详情
        </div>
        <navBar title="详情" class="transferBottom" v-else/>
        <div class="detailed">
            <div class="detailedImg">
                <img src="../../my/image/author.png">
                <p>*{{opposite.substring(1,10)}}</p>
            </div>
            <div class="detailedMobile">{{mobile}}</div>
        </div>
        <div class="particular">
            <p class="particularTitle">金额</p>
            <div class="particularContent">
                <p class="bigger">{{symbol}}<countTo :startVal='0' :decimals="2" :endVal='Number(particulars.amount)' :duration='1'></countTo></p>
                <p>UTD</p>
            </div>
            <div class="particularContent">
                <p>状态</p>
                <p>已完成</p>
            </div>
            <div class="particularContent">
                <p>类型</p>
                <p>转账</p>
            </div>
            <div class="particularContent" v-if="poundage">
                <p>手续费</p>
                <p>10.00UTD</p>
            </div>
            <div class="particularContent">
                <p>交易号</p>
                <p>{{particulars.deal_code}}</p>
            </div>
            <div class="particularContent">
                <p>时间</p>
                <p>{{particulars.created_at}}</p>
            </div>
            <div class="particularContent">
                <p>付款方</p>
                <p>*{{payName.substring(1,10)}}</p>
            </div>
            <div class="particularContent">
                <p>收款方</p>
                <p>*{{makeName.substring(1,10)}}</p>
            </div>
        </div>
    </div>
</template>
<style src="./detailed.css" scoped></style>
<script>
    import navBar from '../../../component/navBar';
    import mixins from '../../../common/mixin';
    import countTo from 'vue-count-to';
    export default {
        components: {
            navBar,
            countTo
        },
        mixins: [mixins],
        data: () => ({
            payName:"",     //付款方名称
            makeName:"",    //收款方名称
            mobile:"",      //手机号码
            particulars:"",  //订单信息
            symbol:""  ,      //符号
            skip:false  ,     //判断返回页面
            poundage:true ,     //手续费判断
            opposite:""          //显示对方名称
        }),
        created() {
            this.detailed()
        },
        mounted(){

        },
        methods:{
         detailed:function () {
             this.request({
                 url: 'api/transfer-info',
                 method: 'GET',
                 data: {
                     id:this.$route.query.id
                 },
                 success: (response) => {
                     this.particulars = response;
                     if(response.type == 9){
                         this.mobile = response.get_user.account;
                         this.payName =response.set_user.name;
                         this.makeName =response.get_user.name;
                         this.opposite = response.get_user.name;
                         this.symbol = "-";
                         this.poundage=true;
                     }
                     if(response.type == 10){
                         this.mobile = response.set_user.account;
                         this.payName =response.set_user.name;
                         this.makeName =response.get_user.name;
                         this.opposite = response.set_user.name;
                         this.symbol = "+";
                         this.poundage=false;
                     }
                     if(this.$route.query.skip == 1){
                         this.skip= true
                     }
                     else {
                         this.skip= false
                     }
                 },
                 error: (response) => {

                 },
                 complete: (response) => {

                 }
             });
         },
            backing:function () {
                this.$router.push({
                    path:"/wallet",
                    query: {

                    }
                })
            }

        }
    }
</script>

<style scoped>

</style>
<template>
    <div class="service">
        <navBar title="申请售后" class="serviceBottom"/>
        <div class="serviceType">
             <p>选择售后类型</p>
             <div class="exchange">
                 <p :class="amountHide?'exchangeChange':'exchangeOver'" @click="exchange(1)">退款</p>
                 <p :class="amountHide?'exchangeOver':'exchangeChange'" @click="exchange(2)">换货</p>
             </div>
        </div>
        <div class="serviceAmount" v-if="amountHide">
                  <p>退款金额</p>
                  <p>12,800.00 UTD</p>
        </div>
        <div class="serviceCause">
            <p>申请原因</p>
            <input type="text" placeholder="请详细填售后原因 "/>
        </div>
        <div class="voucher">
                <p>上传凭证 (最多6张)</p>
               <van-uploader
                    v-model="fileList"
                    multiple
                    :max-count="6"
              >
                   <div class="upload">
<img src="../../image/upload_01.png" />
                       <p>点击上传</p>
                   </div>
            </van-uploader>
        </div>
        <div class="information">
            <p>订单信息</p>
             <div class="invitation-text">
                 <p>实际支付</p>
                 <p>12,800.00 UTD</p>
             </div>
             <div class="invitation-text">
                 <p>订单编号</p>
                 <p>20185548411231321</p>
             </div>
            <div class="invitation-text">
                <p>下单时间</p>
                <p>2018-12-12 11:11:11</p>
            </div>

        </div>
        <div class="invitation-button">
            提交
        </div>
    </div>
</template>
<style src="./service.css" scoped></style>
<script>
    import navBar from '../../../../component/navBar';
    import { Icon ,CountDown,Uploader  } from 'vant';
    export default {
        components:{
            navBar,
            Icon,
            CountDown,
            Uploader
        },
        data: () => ({
            fileList: [],
            amountHide:true
        }),
        created () {

        },
        methods: {
            exchange:function (value) {
                if(value === 1){
                    this.amountHide = true
                }
                else {
                    this.amountHide = false
                }


            }

        }
    }

</script>

<style scoped>

</style>
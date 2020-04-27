<template>
    <div>
        <navBar title="转账" class="transferBottom"/>
        <div class="message">
            <img src="../../my/image/author.png">
            <p>*{{name}}</p>
            <p>{{mobile}}</p>
        </div>
        <div class="messageContent">
            <!--转账金额-->
            <div class="money">
            <p class="moneyTitle">转账金额</p>
            <div class="moneyInput">
                <input type="number"  placeholder="请输入转账金额"  v-model="money" @input="moneyChange" @blur="scrollBack"  @keydown="handleInput" />
                <div class="moneyButton">
                    <p>{{title}}</p>
                    <p>|</p>
                    <p @click="whole">全部</p>
                </div>
            </div>
            <div class="available">可用余额:  <countTo :startVal='0' :decimals="2" :endVal='Number(available)' :duration='1'></countTo> {{title}}</div>
            </div>
            <!--手续费-->
            <div class="poundage">
                <p class="moneyTitle">手续费</p>
                <div class="moneyInput">
                    <p>10.00</p>
                    <p>UTD</p>
                </div>
            </div>
            <!--到账数量-->
            <div class="accountText">
                <p>到账数量</p>
                <p><countTo :startVal='0' :decimals="2" :endVal='Number(account)' :duration='1'></countTo> {{title}}</p>
            </div>
            <div class="transferButton" @click="showPopup">
                确认转账
            </div>
        </div>
        <!--弹出层-->
        <van-popup v-model="show"  position="bottom"
                   :style="{ height: '267px' }">
            <div class="verification">
                <van-icon name="arrow-left" @click="showpopup"/>
                <p>校验登录密码</p>
            </div>
            <div class="verificationInput">
                <input type="password"  placeholder="请输入密码" v-model="password" @blur="scrollBack" />
            </div>
            <div class="verificationButton" @click="payment">
                          确认
            </div>
        </van-popup>
    </div>
</template>
<style src="./message.css" scoped></style>
<script>
    import navBar from '../../../component/navBar';
    import { Popup,Icon  } from 'vant';
    import countTo from 'vue-count-to';
    import mixins from '../../../common/mixin';
    export default {
        components: {
            navBar,
            Popup,
            Icon,
            countTo
        },
        mixins: [mixins],
        data: () => ({
            show: false,
            name:"",     //收款方名称
            currencyId:"",  //币种ID
            title:"",  //币种名字
            mobile:"",  //手机号码
            money:"" ,     //输入的金额
            available:"" ,   //可用余额
            password:"" ,  //密码
            account: 0    //到账金额
        }),
        created() {
            this.initialization()
        },
        mounted(){

        },
        methods:{
            //初始化信息
            initialization:function () {
                this.name =this.$route.query.name.substring(1,10);
                this.currencyId =this.$route.query.id;
                this.mobile  = this.$route.query.mobile;
                if(this.$route.query.id == 3){
                    this.title = "UTD";
                }
                if (this.$route.query.id == 2){
                    this.title = "INE";
                }
                if (this.$route.query.id == 1){
                    this.title = "ETH";
                }
                //资产可用余额
                this.request({
                    url: 'api/assets',
                    method: 'POST',
                    data: {
                        size:10,
                        page:1,
                        currency_id:this.$route.query.id,
                        type:1
                    },
                    success: (response) => {
                        this.available = response.astir_currency
                    },
                    error: (response) => {

                    },
                    complete: (response) => {

                    }
                });
            },
            showPopup() {
                //校验输入框金额是否为空
                if(this.money !== ""){
                    //校验输入金额大于手续费
                    if(this.money > 10){
                        //校验可用余额
                        if(Number(this.money) <= Number(this.available)){
                            this.show = true;
                        }
                        else {
                            this.$toast.center('可用余额不足');
                        }
                    }
                    else {
                        this.$toast.center('最小转账数量需大于手续费');
                    }
                }
                else {
                    this.$toast.center('转账金额不能为空');
                }
            },
            showpopup(){
                this.show = false;
            },
            payment(){
                //校验密码
                this.request({
                    url: 'api/check',
                    method: 'POST',
                    data: {
                        password: this.password
                    },
                    success: (response) => {
                        //转账
                        this.request({
                            url: 'api/transfer-set',
                            method: 'POST',
                            data: {
                                amount:this.money,
                                get_user_id:this.$route.query.userId,
                                charge_nums:10,
                                currency_id:this.$route.query.id
                            },
                            success: (response) => {
                                this.$toast.center('转账成功');
                                this.$router.push({
                                    path:"/wallet/detailed",
                                    query: {
                                           id:response.id,
                                           skip:1
                                    }
                                })
                            },
                            error: (response) => {

                            },
                            complete: (response) => {

                            }
                        });

                    },
                    error: (response) => {

                    },
                    complete: (response) => {

                    }
                });

            },
            whole:function () {
                this.money = Number(this.available).toFixed(2);
                this.moneyChange();
            },
            handleInput(e) {
                e.target.value = (e.target.value.match(/^\d*(\.?\d{0,1})/g)[0]) || null
            },
            //处理软键盘导致弹框里的按钮响应区域错位
            scrollBack: function () {
                setTimeout(function() {
                    var scrollHeight = document.documentElement.scrollTop || document.body.scrollTop || 0;
                    window.scrollTo(0, Math.max(scrollHeight - 1, 0));
                }, 100);
            },
            moneyChange:function () {
                if(this.money <= 10){
                    this.account = 0
                }
                else {
                    this.account = this.money - 10
                }
            }
        }
    }
</script>

<style scoped>

</style>

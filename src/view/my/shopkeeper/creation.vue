<template>
     <div class="creation">

         <div class="creation-membership">
             <img v-if="judge" src="./image/creationJudge_01.png"/>
             <img v-else src="./image/creation_01.png"/>
         </div>
         <div class="creation-interests">
           <div class="creation-interests-text">
               <i></i>
               <i></i>
               <span>创世店主权益</span>
               <i></i>
               <i></i>
           </div>

             <!--<div class="creation-purchase" @click="Buying">认购规则 ></div>-->
             <div class="creation-encourage" v-if="warrant.storekeeper_info">
                 <div class="creation-encourage-content">
                     <img v-if="judge" src="./image/encourageJudeg_01.png">
                     <img v-else="judge" src="./image/encourage_01.png">
                     <div>
                         <p>消费奖励</p>
                         <span>在缤纷集平台消费1元可获得5枚UTD奖励</span>
                     </div>
                 </div>
                 <div class="creation-encourage-content">
                     <img v-if="judge" src="./image/encourageJudeg_02.png">
                     <img v-else="judge" src="./image/encourage_02.png">
                     <div>
                         <p>店主奖励</p>
                         <span>自己和直属下级在缤纷集平台每消费1元，可获得1枚UTD奖励</span>
                     </div>
                 </div>
                 <div class="creation-encourage-content">
                     <img v-if="judge" src="./image/encourageJudeg_03.png">
                     <img v-else="judge" src="./image/encourage_03.png">
                     <div>
                         <p>首单奖励</p>
                         <span>邀请好友在缤纷集平台首次消费，可获得500枚UTD奖励</span>
                     </div>
                 </div>

                 <div class="creation-encourage-content encourage-content-one">
                     <img v-if="judge" src="./image/encourageJudeg_05.png">
                     <img v-else="judge" src="./image/encourage_05.png">
                     <div>
                         <p>评论奖励</p>
                         <span>在缤纷集平台订单完成后，对订单商品进行评价可获得25枚UTD奖励</span>
                     </div>
                 </div>
                  <!--
                 <div class="creation-encourage-content encourage-content-two">
                     <img v-if="judge" src="./image/encourageJudeg_06.png">
                     <img v-else="judge" src="./image/encourage_06.png">
                     <div>
                         <p>{{warrant.storekeeper_info.profit[7][0]}}</p>
                         <span>{{warrant.storekeeper_info.profit[7][1][0]}}<br>
                         {{warrant.storekeeper_info.profit[7][1][1]}}<br>
                         {{warrant.storekeeper_info.profit[7][1][2]}}</span>

                     </div>
                 </div>
                 -->
                 <div class="creation-encourage-content encourage-content-three">
                     <img v-if="judge" src="./image/encourageJudeg_07.png">
                     <img v-else="judge" src="./image/encourage_07.png">
                     <div>
                         <p>创世奖励</p>
                         <span>下级家庭店主每获得10枚UTD的店主奖励，创世店主可获得1枚UTD奖励</span>
                     </div>
                 </div>
             </div>

         </div>
         <div v-if="warrant.limit">
         <div v-if="warrant.type === 2" class="creation-rush" @click="community"  >
             <p>加入社区</p>
         </div>
         <div v-if="warrant.type !== 2 && warrant.limit.remain !== 0" class="creation-rush"  @click="showPopup">
             <!--剩余人数注释 （剩余{{warrant.limit.remain}}位）-->
         <p>立即认购</p>
         </div>
         <div class="creation-robbed" v-if="warrant.limit.remain === 0 "><p>已抢完</p></div>
             <div class="creation-robbed" v-if="timeES"><p>不在活动时间内</p></div>
         </div>

         <van-popup :style="{width: '375px',height: '340px'}" v-model="accede" round><img  src="./image/creationillume_01.png" /></van-popup>

         <van-popup
                 v-model="show"
                 round
                 position="bottom"
                 :style="{ height: '308px' }"
         >

                  <div class="defrayal-one">
                      <div class="defrayal">
                      <p>UTD支付</p>
                      <p @click="cancel">取消</p>
                  </div>
                  </div>
                 <div class="defrayal-one">
                     <div class="identifier">
                     <p>可用余额</p>
                     <p><countTo :startVal='0' :decimals="2" :endVal='Number(available)' :duration='1'></countTo>UTD</p>
                     </div>
                 </div>
                 <div class="defrayal-two defrayal-one">
                     <div class="payoff">
                     <p>支付费用</p>
                     <p><countTo :startVal='0' :decimals="2" :endVal='Number(warrant.amount)' :duration='1'></countTo>UTD</p>
                     </div>
                     <div class="identifying" v-if="handle">
                         <input type="text" placeholder="请输入验证码" v-model="code" @input="handleGetStatus" @blur="scrollBack" />
                         <p @click="handleGetCode" v-if="!isCode">获取验证码</p>
                         <p class="identifying-right" v-else>{{codeTime}}S</p>
                     </div>
                 </div>
               <div v-if="isActivw" class="affirm-active" @click="affirmButten">确认支付</div>
                 <div v-else class="affirm">{{usable}}</div>

         </van-popup>
     </div>

</template>
<style src="./creation.css" scoped></style>
<script>
    import mixins from '../../../common/mixin';
    import navBar from '../../../component/navBar';
    import { Toast, Dialog, Popup } from 'vant';
    import countTo from 'vue-count-to';


    export default {
        components: {
            navBar,
            Dialog,
            Toast,
            Popup,
            countTo
        },
        mixins: [mixins],
        data: () => ({
            aaaa:0,
            isLoadSuccess: false,			// 页面是否完成加载
            warrant: {},					// 加载回来的数据
            account: '',					// 登录用户手机
            showImagePreview: false ,		// 是否显示图片预览
            show: false,                    //购买弹窗
            code:"",
            order:""  ,                      //订单编号
            judge:false,                    //判断是否购买创世店主
            accede:false,
            isActivw:false,
            codeTime: 60,                   // 手机倒计时
            isCode: false,                  // 是否显示发生验证码
            robbed:true,
            timeES:false,                   //判断是否在时间内
            available:"",                   //可用余额
            handle:true,                    //判断短信验证
            usable:"确认支付",               //点击按钮文字


        }),
        created () {


        },
        // 设置路由钩子，存储页面来源
        beforeRouteEnter(to, from, next) {
            next(vm=>{          //  这里的vm指的就是vue实例，可以用来当做this使用
                sessionStorage.setItem('url_from', from.path);
            })
        },
        mounted () {
            this.handleGetUserInfo();
            this.handleLoad();
        },
        methods: {
            //处理软键盘导致弹框里的按钮响应区域错位
            scrollBack: function () {
                setTimeout(function() {
                    var scrollHeight = document.documentElement.scrollTop || document.body.scrollTop || 0;
                    window.scrollTo(0, Math.max(scrollHeight - 1, 0));
                }, 100);
            },
            //确认付款
            // 初始化用户信息
            handleGetUserInfo: function() {
                this.request({
                    url: 'api/user',
                    method: 'GET',
                    data: { },
                    success: (response) => {
                        this.account=response.mobile

                    },
                    error: (response) => {

                    },
                    complete: (response) => {

                    }
                });
            },
            //确认付款
            affirmButten:function () {
                //短信验证
                this.request({
                    url: 'api/forgetPassword',
                    method: 'POST',
                    data: {
                        mobile:this.account,
                        code:this.code
                    },
                    success: (response) => {
                        //提交下单
                        this.request({
                            url: 'api/warrant',
                            method: 'PUT',
                            data: {
                                type:2
                            },
                            success: (response) => {
                                this.show = false;
                                this.judge =true;
                                this.$router.go(0);
                                Toast('创世店主升级成功');

                            },
                            error: (response) => {
                                this.show = false;
                                this.code="";
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
            //获取验证码链接
            handleGetCode: function () {
                   this.request({
                    url: 'api/sendMobileCode',
                    data: {
                        mobile: this.account
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
            },
            //激活付款按钮
            handleGetStatus:function () {
                if(this.code.length === 6) {
                    this.isActivw = true;

                } else{
                    this.isActivw = false;
                }
            },
            //加入社区
            community:function () {
                this.accede =true
            },
            // 创世店主权益
            handleLoad: function() {
                this.request({
                    url: 'api/warrant',
                    method: 'GET',
                    data: {
                        type:2
                    },
                    success: (response) => {
                        this.warrant = response;
                        let ts = Math.round(new Date().getTime()/1000).toString();
                        if(response.type === 2){
                             this.judge = true
                         }
                        else {
                            if(response.limit.end_time < ts && ts > response.limit.start_time ){
                                     this.timeES = true;
                            }
                        }
                        //判断短信验证码显示隐藏
                        if(Number(response.wallet.astir_currency) < Number(response.amount) ){
                            this.handle = false;
                            this.usable = "可用余额不足"
                        }
                        else {
                            this.handle = true;
                            this.usable = "确认支付"
                        }
                        //可用余额判断
                        if(response.wallet.astir_currency === null){
                            this.available = 0
                        }else {
                            this.available =  response.wallet.astir_currency;
                        }

                    },
                    error: (response) => {

                    },
                    complete: (response) => {

                    }
                });
            },
            cancel(){


                this.show = false;
                this.code="";

         },
            showPopup(){
                //创世店主立即抢购
                this.request({
                    url: 'api/warrant',
                    method: 'POST',
                    data: {
                        type:2
                    },
                    success: (response) => {

                        this.order =response;





                    },
                    error: (response) => {

                    },
                    complete: (response) => {

                    }
                });
                this.show = true;
            },
            //跳转抢购规则
            Buying:function () {
                this.$router.push({
                    path: '/buying',
                    query: {
                        id:2
                    }
                });
            }



        }
    }
</script>

<style scoped>

</style>

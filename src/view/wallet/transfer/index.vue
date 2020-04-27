<template>
    <div class="transfer">
        <navBar title="转账" class="transferBottom"/>
         <div class="shopkeeper" @click="record">转账记录</div>
        <div class="theTransfer">
            <p>对方账户</p>
            <input type="text" maxlength="11"  placeholder="手机号码"  v-model="mobile"/>
        </div>
        <p class="transferText">资产将实时转入对方账户，无法退还</p>
        <div class="transferButton" @click="transferButton">
            下一步
        </div>
    </div>
</template>
<style src="./index.css" scoped></style>
<script>
    import navBar from '../../../component/navBar';
    import mixins from '../../../common/mixin';
    import { Toast } from 'vant';
    export default {
        components: {
            navBar,
            Toast
        },
        mixins: [mixins],
        data: () => ({
            mobile:"",   //手机号码
            userInfo:[]   //用户信息
        }),
        created() {

        },
        mounted(){
               this.handleGetUserInfo()
        },
        methods:{
            // 初始化用户信息
            handleGetUserInfo: function() {
                this.request({
                    url: 'api/user',
                    method: 'GET',
                    data: { },
                    success: (response) => {
                        this.userInfo = response;
                    },
                    error: (response) => {

                    },
                    complete: (response) => {
                    }
                });
            },
            transferButton:function () {
                this.request({
                    url: 'api/transfer-search',
                    method: 'GET',
                    data: {
                      mobile:this.mobile
                    },
                    success: (response) => {
                        if(this.userInfo.status == 1) {
                            this.$toast.center('请先认证身份');
                            this.$router.push({
                                path: '/identity',
                                query: {
                                    status: this.userInfo.status,
                                    datum: JSON.stringify(this.userInfo.datum),
                                    name: this.userInfo.name,
                                    id_card: this.userInfo.id_card
                                }
                            });
                        } else if(this.userInfo.status == 2) {
                            this.$toast.center('身份正在审核，请耐心等待');
                        } else if(this.userInfo.status == 3) {

                            if(this.userInfo.mobile === this.mobile){
                                this.$toast.center('不可向自己转账');
                            }
                            else {
                                if(response.status === 3){
                                    this.$router.push({
                                        path:"/wallet/message",
                                        query: {
                                            id: this.$route.query.id,
                                            mobile:response.mobile,
                                            name:response.name,
                                            userId:response.id
                                        }
                                    })
                                }
                                else {
                                    this.$toast.center('对方账户未实名认证');
                                }
                            }

                        } else if(this.userInfo.status == 4) {
                            this.$router.push({
                                path: '/identityError',
                                query: {
                                    break: this.userInfo.audit ? this.userInfo.audit.break : ''
                                }
                            });
                        }









                    },
                    error: (response) => {

                    },
                    complete: (response) => {

                    }
                });

            },
            record(){
                this.$router.push({
                    path:"/wallet/record"
                })
            }
        }
    }
</script>

<style scoped>

</style>
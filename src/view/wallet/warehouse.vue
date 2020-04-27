<template>
    <div>
        <navBar title="锁仓账户"></navBar>
        <div class="warehouse-account" @click="handleCommittee">
            <div class="account">
                <div class="account-left">
                    <img src="./image/account_01.png"/>
                    <p>自治委员会</p>
                </div>
                <div class="account-right">
                    <div class="account-right-text">
                        <div>
                            锁仓
                            <countTo :startVal='0' :decimals="2" :endVal='Number(committee.lock_number ? committee.lock_number : 0)' :duration='1'></countTo>
                            UTD
                        </div>
                        <div>
                            奖励
                            <countTo :startVal='0' :decimals="2" :endVal='Number(committee.profit ? committee.profit : 0)' :duration='1'></countTo>
                            UTD
                        </div>
                    </div>
                    <div class="account-right-ico"> <van-icon name="arrow"  /></div>
                </div>
            </div>

        </div>
    </div>
</template>
<style src="./warehouse.css"></style>
<script>
    import mixins from '../../common/mixin';
    import navBar from '../../component/navBar';
    import {Toast, Notify } from 'vant';
    import countTo from 'vue-count-to';

    export default {
        components: {
            navBar,
            Toast,
            Notify,
            countTo
        },
        mixins: [mixins],
        data: () => ({
            userInfo: {},
            committee: {},
        }),
        mounted() {
            this.handleLoad();
            this.handleGetUserInfo()
        },
        methods:{
            // 初始化
            handleLoad: function() {
                this.request({
                    url: 'api/committee',
                    method: 'GET',
                    data: {
                        type: 1
                    },
                    success: (response) => {
                        this.committee = response;
                    },
                    error: (response) => {

                    },
                    complete: (response) => {
                        Toast.clear();
                    }
                });
            },
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
            handleCommittee: function () {
                this.$router.push({
                    path: '/plus/committee',
                    query: {
                        account: encodeURIComponent(JSON.stringify(this.userInfo))
                    }
                });
            },
        }

    }
</script>

<style scoped>

</style>

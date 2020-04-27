<template>
    <div class="search"
         v-if="isLoadSuccess">
        <navBar title="我的邀请"></navBar>
        <div class="search-input">
            <van-icon class="search-ico" name="search" />
                <input type="text" @keyup.enter="handleSeach" v-model="seachKey" placeholder="搜索手机号"/>
        </div>
        <div class="userinfo"
             v-for="(item, index) in inviteeList[0].list"
             :key="index">
            <div class="userinfo-name">
                <p>{{item.mobile}}</p>
                <p>{{item.created_at}}</p>
            </div>
            <p v-if="item.status == 3">
                +{{inviteeList[0].utd}} UTD
            </p>
            <p v-else>
                未认证
            </p>
        </div>
    </div>
</template>
<style src="./search.css" scoped></style>
<script>
    import navBar from '../../../../component/navBar';
    import mixins from '../../../../common/mixin';
    import { Icon } from 'vant';
    export default {
        mixins: [mixins],
        components: {
            navBar,
            Icon
        },
        data: () => ({
            isLoadSuccess: false,
            seachKey: '',
            inviteeList: []
        }),
        created() {
            this.handleInvitee();
        },
        methods: {
            // 邀请人列表
            handleInvitee: function () {
                this.request({
                    url: 'api/invitee',
                    method: 'GET',
                    data: { },
                    success: (response) => {
                        this.isLoadSuccess = true;
                        this.inviteeList = response;

                        // 手机号加密
                        var reg=/(\d{3})\d{4}(\d{4})/;
                        this.inviteeList[0].list.map((data) => {
                            data.mobile = data.mobile.replace(reg, "$1****$2")
                        });
                    },
                    error: (response) => {

                    },
                    complete: (response) => {

                    }
                });
            },
            handleSeach: function () {
                this.request({
                    url: 'api/invitee',
                    method: 'GET',
                    data: {
                        mobile: this.seachKey
                    },
                    success: (response) => {
                        this.inviteeList = response;

                        // 手机号加密
                        var reg=/(\d{3})\d{4}(\d{4})/;
                        this.inviteeList[0].list.map((data) => {
                            data.mobile = data.mobile.replace(reg, "$1****$2")
                        });
                    },
                    error: (response) => {

                    },
                    complete: (response) => {

                    }
                });
            }
        }
    }
</script>

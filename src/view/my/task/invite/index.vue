<template>
    <div class="invite">
        <navBar class="inviteNavBar" title="邀请有礼"></navBar>
        <div class="invite-name" @click="inviteRoute">
            <div class="invite-left">
                <div class="handle-right-author">{{userInfo.account}}</div>
                <div v-if="userInfo.old != null">
                    <p v-if="userInfo.is_node == 2">创世店主</p>
                    <p v-if="userInfo.is_node == 1">创世节点</p>
                </div>
                <p v-else>普通用户</p>
            </div>
            <div class="invite-right">
                <img src="../../../my/image/author.png"/>
                <i class="van-icon van-icon-arrow" style="color:rgba(255, 255, 255, 1); font-size: 18px;"></i>
            </div>
        </div>
        <div class="direct-invite" @click="inviteRoute">
               <div class="direct-invite-people">
                   <p>直接邀请</p>
                    <p v-if="inviteeList[0]">{{inviteeList[0].list.length}} (人)</p>
               </div>
               <div class="direct-invite-ico">
               </div>
               <div class="direct-invite-indirect">
                   <p>间接邀请</p>
                   <p v-if="inviteeList[1]">{{inviteeList[1].list.length}} (人)</p>
               </div>
        </div>
        <div class="activity-invite">
             <p>活动规则:</p>
             <div class="activity-invite-text">
               <i></i><span>好友接受邀请后，通过身份认证之后奖励立即发放。</span>
             </div>
            <div class="activity-invite-text">
                <i></i><span>每个邀请一位好友，您将获得 50.00 UTD 奖励。</span>
            </div>
            <div class="activity-invite-text">
                <i></i><span>邀请的好友再每邀请一位好友，您将获得 20.00 UTD 奖励。</span>
            </div>
            <div class="activity-invite-text">
                <i></i><span>如被邀请违反邀请奖励的相应风控规则，其奖励将被 收回同时，状态将变为【已失效】。</span>
            </div>
            <div class="activity-invite-text">
                <i></i><span>如活动有调整，以UTD平台更新为准，最终解释权归UTD 项目团队所有。</span>
            </div>
            <div class="invite-button" @click="handlePoster">
                分享海报
            </div>
        </div>
        <!--图片预览-->
        <van-image-preview
                v-model="isShowPoster"
                :images="poster_url"
        />
    </div>
</template>
<style src="./index.css" scoped></style>
<script>
    import { Toast, ImagePreview } from 'vant';
    import mixins from '../../../../common/mixin';
    import navBar from '../../../../component/navBar';
    export default {
        mixins: [mixins],
        components: {
            navBar,
            Toast,
            ImagePreview
        },

        data: () => ({
            userInfo: {},
            isShowPoster: false,
            inviteeList: [],
            poster_url: []
        }),

        created () {

        },
        mounted() {
            this.handleGetUserInfo();
            this.handleInvitee();
        },
        methods: {
            inviteRoute:function () {
                this.$router.push({
                    path: '/task/invite/search',
                    query: {

                    }
                });
            },
            // 初始化用户信息
            handleGetUserInfo: function() {
                //分享海报接口
                this.request({
                    url: 'api/poster',
                    method: 'GET',
                    data: { },
                    success: (response) => {

                        this.poster_url = [];
                        this.poster_url = this.poster_url.concat(response.poster_url);
                    },
                    error: (response) => {

                    },
                    complete: (response) => {

                    }
                });
                this.request({
                    url: 'api/user',
                    method: 'GET',
                    data: { },
                    success: (response) => {

                        this.userInfo = response;
                        // 手机号加密
                        var tel = this.userInfo.account;
                        this.userInfo.tel = this.userInfo.account;
                        tel = "" + tel;
                        var reg=/(\d{3})\d{4}(\d{4})/;
                        this.userInfo.account = tel.replace(reg, "$1****$2");
                    },
                    error: (response) => {

                    },
                    complete: (response) => {

                    }
                });
            },
            // 邀请人列表
            handleInvitee: function () {
                this.request({
                    url: 'api/invitee',
                    method: 'GET',
                    data: { },
                    success: (response) => {
                        this.inviteeList = response
                    },
                    error: (response) => {

                    },
                    complete: (response) => {

                    }
                });
            },
            // 生成海报
            handlePoster: function () {
                this.isShowPoster = true;

            }
        }
    }
</script>

<style>
    .inviteNavBar{
        background: rgba(41, 66, 151, 1);
        color: #fff!important;
    }
    .inviteNavBar .bar-box {
        color: #fff;
    }
</style>

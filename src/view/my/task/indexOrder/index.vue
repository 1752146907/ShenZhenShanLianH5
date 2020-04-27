<template>
    <div>
        <navBar class="orderNavBar" title="首单消费奖励"></navBar>
        <div class="task">
            <div class="task-hender">
                <img src="../image/code.jpg" @click="codeImagesIsShow = true" alt="">
            </div>
            <div class="task-body">
                <div class="title">活动流程</div>
                <div class="procedure">
                    <div class="procedure-item">
                        <div class="number">1</div>
                        <div class="text">领取任务</div>
                        <div class="line"></div>
                    </div>
                    <div class="procedure-item">
                        <div class="number">2</div>
                        <div class="text">去往缤纷集</div>
                        <div class="line"></div>
                    </div>
                    <div class="procedure-item">
                        <div class="number">3</div>
                        <div class="text">确认收货</div>
                        <div class="line"></div>
                    </div>
                    <div class="procedure-item">
                        <div class="number">4</div>
                        <div class="text">资产到账</div>
                        <div class="line"></div>
                    </div>
                </div>
                <div class="conten">
                    <p>任务奖励：200 UTD/人</p>
                    <p>参与流程：</p>
                    <p>1.用户在当前页面领取缤纷集首单消费任务</p>
                    <p>2.微信扫描上方二维码，进入小程序【缤纷集】</p>
                    <p>3.授权登录之后绑定手机，在平台消费任意金额</p>
                    <p>4.在缤纷集上确认收货 </p>
                    <p>5.确认收货七天后奖励自动到账</p>
                    <p>如果订单发生售后退款，将会失去任务资格。</p>
                    <p>领取任务后的首单消费成功才有效哦</p>
                </div>
            </div>
            <div class="next" v-if="taskStatus.is_received == 1 && taskStatus.status_text.value != 3" @click="handleTask">领取任务</div>
            <div class="next" v-if="taskStatus.is_received == 2 && taskStatus.status_text.value != 3" @click="handleRefresh">刷新任务状态</div>
            <div class="next" v-if="taskStatus.is_received == 2 && taskStatus.status_text.value == 3" @click="handleSuccess">奖励领取</div>
        </div>
        <van-image-preview
                v-model="codeImagesIsShow"
                :images="codeImages"
         />
    </div>
</template>

<style src="./index.css" scoped></style>
<style>
    .orderNavBar{
        background: rgba(41, 66, 151, 1);
        color: #fff!important;
    }
    .orderNavBar .bar-box{
        color: #fff;
    }
</style>
<script>
    import {Toast, ImagePreview } from 'vant';
    import mixins from '../../../../common/mixin';
    import navBar from '../../../../component/navBar';

    export default {
        components: {
            Toast,
            navBar,
            ImagePreview
        },
        mixins: [mixins],
        data: () => ({
            taskStatus: {},                                 // 任务状态(1/2{未领取/已领取})
            codeImagesIsShow: false,
            codeImages: [require('../image/code.jpg')]
        }),
        mounted() {
            this.handleLoad()
        },
        methods: {
            // 初始化
            handleLoad: function () {
                this.request({
                    url: 'api/task',
                    method: 'PATCH',
                    data: {
                        "type": 2
                    },
                    success: (response) => {
                        this.taskStatus = response;
                    },
                    error: (response) => {
                    },
                    complete: () => {
                    }
                });
            },
            // 刷新任务状态
            handleRefresh: function () {
                this.request({
                    url: 'api/task',
                    method: 'PATCH',
                    data: {
                        "type": 2
                    },
                    success: (response) => {
                        this.taskStatus = response;

                        setTimeout(() => {
                            Toast(this.taskStatus.status_text.text)
                        }, 300)
                    },
                    error: (response) => {
                    },
                    complete: () => {
                    }
                });
            },
            // 接任务
            handleTask: function () {
                this.request({
                    url: 'api/task',
                    method: 'PUT',
                    data: {
                        "type": 2
                    },
                    success: (response) => {
                        this.$toast.center('任务领取成功');

                        this.handleLoad();
                    },
                    error: (response) => {
                    },
                    complete: () => {
                    }
                });
            },
            // 完成成任务
            handleSuccess: function () {
                this.request({
                    url: 'api/task',
                    method: 'DELETE',
                    data: {
                        "type": 2
                    },
                    success: (response) => {
                        this.$toast.center('奖励领取成功');

                        this.handleBack();
                    },
                    error: (response) => {
                    },
                    complete: () => {
                    }
                });
            }
        }
    }
</script>

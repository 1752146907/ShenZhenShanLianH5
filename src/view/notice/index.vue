<template>
    <div class="main">
        <img class="bar-back"
             @click="handleHome"
             style="z-index: 9999;background: #ffffff"
             src="../../image/back.png" alt="">
        <navBar title="公告中心"></navBar>
        <div class="banner">
            <img src="./image/banner.png" alt="">
        </div>
        <div class="nav">
            <div class="nav-item" v-for="(item, index) in notice" :key="index" @click="handleNoticeSecond(item.id, item.title)">{{item.title}}</div>
        </div>
        <div class="activity">
            <div class="activity-title">最近的活动</div>
            <div class="activity-item" v-for="(item, index) in newNotice" :key="index" @click="handleNoticeThree(item.id)">
                <div class="activity-item-title">{{item.title}}</div>
                <!--<div class="activity-item-text">收入分配-19972{{index}}期</div>-->
                <div class="activity-item-time">{{item.created_at}}</div>
            </div>
            <!--<div class="more">查看更多</div>-->
        </div>
    </div>
</template>

<style src="./index.css" scoped></style>

<script>
    import mixins from '../../common/mixin';
    import navBar from '../../component/navBar';

    export default {
        components: {
            navBar
        },
        mixins: [mixins],
        data: () => ({
            newNotice: [],   // 最新公告
            notice: []       // 一级分类标题
        }),
        mounted() {
            this.handleLoad();
            this.handleNewNotice();
        },
        // 设置路由钩子，存储页面来源
        beforeRouteEnter(to, from, next) {
            next(vm=>{          //  这里的vm指的就是vue实例，可以用来当做this使用
                sessionStorage.setItem('url_from', from.path);
            })
        },
        methods: {
            handleLoad() {
                this.request({
                    url: 'api/notice',
                    method: 'GET',
                    data: {
                        // article: this.$route.query.id
                    },
                    success: (response) => {
                        this.notice = response;
                    },
                    error: (response) => {
                    },
                    complete: () => {

                    }
                });
            },
            handleNewNotice: function() {
                this.request({
                    url: 'api/new-notice',
                    method: 'GET',
                    data: {

                    },
                    success: (response) => {
                        this.newNotice = response;
                    },
                    error: (response) => {
                    },
                    complete: () => {

                    }
                });
            },
            handleNoticeSecond: function(id, title) {
                this.$router.push({
                    path: '/noticeSecond',
                    query: {
                        id: id,
                        title: title
                    }
                });
            },
            handleNoticeThree: function(id) {
                this.$router.push({
                    path: '/noticeDetail',
                    query: {
                        id: id
                    }
                });
            },
            handleHome: function () {
                this.$router.push({
                    path: '/',
                    query: {

                    }
                });
            }
        }
    }
</script>

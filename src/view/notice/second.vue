<template>
    <div class="main">
        <navBar title="帮助文档"></navBar>
        <div class="hender">
            <div class="crumbs">
                <span @click="handleUTD">UTD</span>
                >
                {{title}}
            </div>
            <Seach></Seach>
        </div>
        <div class="document">
            <div class="document-title">{{title}}</div>
            <div class="document-body">
                <div v-for="item in notice" :key="item.id">
                    <div class="title">{{item.title}}</div>
                    <div class="dociment-body-box">
                        <div v-for="(article, i) in item.article" :key="article.id" v-if="i < 5">
                            <div class="item" @click="handleNoticeDetail(article.id)">{{article.title}}</div>
                        </div>
                        <div class="more" @click="handleMore(item.id, item.title)">查看所有</div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style src="./second.css" scoped></style>

<script>
    import mixins from '../../common/mixin';
    import navBar from '../../component/navBar';
    import Seach from '../../component/seach';

    export default {
        components: {
            navBar,
            Seach
        },
        mixins: [mixins],
        data: () => ({
            title: '',       // 标题
            notice: []       // 初始化数据
        }),
        mounted() {
            this.title = this.$route.query.title;
            this.handleLoad();
        },
        // 设置路由钩子，存储页面来源
        beforeRouteEnter(to, from, next) {
            next(vm=>{          //  这里的vm指的就是vue实例，可以用来当做this使用
                sessionStorage.setItem('url_from', from.path);
            })
        },
        methods: {
            // 初始化数据
            handleLoad() {
                this.request({
                    url: 'api/notice',
                    method: 'POST',
                    data: {
                        category: this.$route.query.id
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
            handleNoticeDetail: function(id){
                this.$router.push({
                    path: '/noticeDetail',
                    query: {
                        id: id
                    }
                });
            },
            handleMore(id, title) {
                this.$router.push({
                    path: '/noticeThree',
                    query: {
                        id: id,
                        title: ' > ' + this.title + ' > ' + title
                    }
                });
            },
            handleUTD() {
                this.$router.replace({
                    path: '/notice',
                    query: {

                    }
                });
            }
        }
    }
</script>

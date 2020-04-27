<template>
    <div class="main">
        <navBar title="文档详情"></navBar>
        <div class="hender">
            <div class="crumbs">
                <span @click="handleUTD">UTD</span>
                >
                文档详情
            </div>
            <Seach></Seach>
        </div>
        <div class="document">
            <div class="document-title">{{article.title}}</div>
            <div class="document-time">{{article.updated_at}}</div>
            <div v-html="article.content"></div>
        </div>
    </div>
</template>

<style src="./detail.css" scoped></style>

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
            article: {}
        }),
        mounted() {
            this.handleLoad();
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
                    url: 'api/article',
                    method: 'POST',
                    data: {
                        article: this.$route.query.id
                    },
                    success: (response) => {
                        this.article = response;
                    },
                    error: (response) => {
                    },
                    complete: () => {

                    }
                });
            },
            handleUTD() {
                this.$router.replace({
                    path: '/notice',
                    query: {}
                });
            }
        }
    }
</script>

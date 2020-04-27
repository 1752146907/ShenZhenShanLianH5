<template>
    <div class="main">
        <navBar title="帮助文档"></navBar>
        <div class="hender">
            <div class="crumbs">
                <span @click="handleUTD">UTD</span>
                {{title}}
            </div>
            <Seach></Seach>
        </div>
        <div class="document">
            <div class="document-title" v-if="notice.list">{{notice.list[0].category.parent_category.title}}</div>
            <div class="document-body">
                <div class="title" v-if="notice.list">{{notice.list[0].category.title}}</div>
                <div class="dociment-body-box">
                    <div class="item" v-for="item in notice.list" :key="item.id" @click="handleNoticeDetail(item.id)">{{item.title}}</div>
                </div>
            </div>
        </div>
        <div class="page">
            <!--<div class="page-item" :class="index == 1 ? 'page-item-active' : ''" v-for="index in 6" :key="index">{{index}}</div>
            <div class="page-item"><van-icon name="arrow" size="10" /></div>-->
            <van-pagination
                    v-model="currentPage"
                    :total-items="notice.total"
                    :show-page-size="notice.size"
                    :page-count="pageCount"
                    prev-text="<"
                    next-text=">"
                    force-ellipses
                    @change="handleChangePage"
            />
        </div>
    </div>
</template>

<style src="./three.css" scoped></style>

<script>
    import mixins from '../../common/mixin';
    import { Pagination } from 'vant';
    import navBar from '../../component/navBar';
    import Seach from '../../component/seach';

    export default {
        components: {
            Pagination,
            navBar,
            Seach
        },
        mixins: [mixins],
        data: () => ({
            currentPage: 1,
            title: '',       // 标题
            notice: [],      // 数组列表
            page: 1,
            pageCount: 0            // 总页数
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
            handleLoad() {
                this.request({
                    url: 'api/article',
                    method: 'GET',
                    data: {
                        category: this.$route.query.id,
                        page: this.page
                    },
                    success: (response) => {
                        this.notice = response;
                        // 计算页码
                        let pageCount = Math.ceil(this.notice.total / this.notice.size);
                        this.pageCount = pageCount;
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
            handleChangePage: function(e) {
                this.page = e;
                this.handleLoad();
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

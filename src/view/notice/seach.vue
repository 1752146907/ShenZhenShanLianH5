<template>
    <div class="main">
        <navBar title="公告中心"></navBar>
        <div class="hender">
            <div class="crumbs">
                <span @click="handleUTD">公告中心</span>
                >
                搜索结果
            </div>
            <Seach></Seach>
        </div>
        <div class="document">
            <div class="document-title">收入分配</div>
            <div class="document-sub">“{{seachKey}}”的结果：{{notice.total}}条</div>
            <div class="document-body">
                <div class="dociment-body-box">
                    <div class="item" v-for="(item, index) in notice.list" :key="index" @click="handleNoticeDetail(item.id)">
                        {{item.title}}
                        <p>
                            <span>公告中心</span>
                            >
                            <span>{{item.category.title}}</span></p>
                    </div>
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

<style src="./seach.css" scoped></style>

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
            seachKey: "",           // 搜索关键字
            notice: {},             // 初始化数据
            page: 1,                // 请求页码
            pageCount: 0            // 总页数
        }),
        mounted() {
            if(this.$route.query.key) {
                this.seachKey = this.$route.query.key;
                this.handleSearch()
            }
        },
        watch: {
            // 监听路由变化
            $route(){
                if(this.$route.query.key) {
                    this.seachKey = this.$route.query.key;
                    this.handleSearch()
                }
            },
        },
        // 设置路由钩子，存储页面来源
        beforeRouteEnter(to, from, next) {
            next(vm=>{          //  这里的vm指的就是vue实例，可以用来当做this使用
                sessionStorage.setItem('url_from', from.path);
            })
        },
        methods: {
            // 搜索
            handleSearch() {
                this.request({
                    url: 'api/notice-search',
                    method: 'POST',
                    data: {
                        title: this.seachKey,
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
                this.handleSearch();
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

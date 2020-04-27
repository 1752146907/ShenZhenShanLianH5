<template>
    <div class="seach">
        <div @click="handleGoHome" class="back-1"></div>
        <navBar title="商品搜索"></navBar>
        <van-search
                placeholder="搜索商品"
                v-model="name"
                autofocus
                @search="handleSeach"
                @input="handleClearSeach"
                show-action>
            <div slot="action" @click="handleSeach">搜索</div>
        </van-search>
        <div class="seach-body" v-if="seachHistory.length > 0 && !noSeach">
            <div class="title-box">
                <div class="title-box-title">历史记录</div>
                <img src="./image/del.png" @click="handleDelteaHistroy" alt="">
            </div>
            <div class="sale-button-box">
               <span class="li"
                     v-for="(item, index) in seachHistory"
                     :key="index"
                     @click="handleSeachName(item)">
                   {{item}}
               </span>
            </div>
        </div>
        <div v-if="noSeach" class="no-data" style="padding-top: 150px">
            <img src="./image/seach.png" class="no-data-image-icon" alt="">
            <p>抱歉，没有找到“<span v-html="name"></span>”相关的商品</p>
            <p>您可以换个词再试试</p>
        </div>
    </div>
</template>

<style src="./index.css" scoped></style>
<script>
    import { Dialog } from 'vant';
    import mixins from '../../../../common/mixin';
    import navBar from '../../../../component/navBar';
    import Goods from '../component/goods/goods.css';
    import Store from './store'

    export default {
        components: {
            navBar,
            Goods,
            Dialog
        },
        mixins: [mixins],
        data: () => ({
            noSeach: false,
            name: '',
            seachHistory: Store.state.seachKey
        }),
        // 设置路由钩子，存储页面来源
        beforeRouteEnter(to, from, next) {
            next(vm => {          //  这里的vm指的就是vue实例，可以用来当做this使用
                sessionStorage.setItem('url_from', from.path);
            })
        },
        created() {

        },
        mounted() {
            if (this.$route.query.noSeach) {
                this.noSeach = true
            }
            if (this.$route.query.name) {
                this.name = this.$route.query.name
            }
        },
        methods: {
            handleSeach: function () {
                if (this.name == '') {
                    this.$toast.center('搜索内容不能为空');
                    return
                }

                this.$router.push({
                    path: '/plus/category/index',
                    query: {
                        name: this.name,
                        title: '搜索结果',
                        isSeach: true
                    }
                });
                Store.state.seachKey = Store.state.seachKey.concat(this.name);
                this.seachHistory = Store.state.seachKey;
                this.isSeach = !this.isSeach;
            },
            handleClearSeach: function () {
                this.noSeach = false;
            },
            handleSeachName: function (name) {
                this.$router.push({
                    path: '/plus/category/index',
                    query: {
                        name: name,
                        title: '搜索结果',
                        isSeach: true
                    }
                });
                this.isSeach = !this.isSeach;
            },
            handleDelteaHistroy: function () {
                Dialog.confirm({
                    title: '温馨提示',
                    message: '确认删除搜索记录吗？',
                    confirmButtonColor: '#FF311E'
                }).then(() => {
                    Store.state.seachKey = [];
                    this.seachHistory = Store.state.seachKey;
                }).catch(() => {
                    // on cancel
                });
            },
            handleGoHome: function () {
                this.$router.replace({
                    path: '/plus/shopx/index',
                    query: {

                    }
                });
            }
        }
    }
</script>

<style scoped>

</style>

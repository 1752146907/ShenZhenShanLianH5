<template>
    <div class="addres addres-index">
        <div class="navBar">
            <navBar title="选择地址"></navBar>
            <span class="edit" @click="handleEdit">编辑</span>
        </div>
        <van-list v-model="loading"
                  :finished="finished"
                  :offset="100"
                  :immediate-check="false"
                  finished-text="没有更多了"
                  @load="rollLoad" >
            <div class="addres-title">
                <div class="addres-left">
                    名称
                </div>
                <div class="addres-right">
                    地址
                </div>
            </div>
                <div class="addres-body">
                    <div class="addres-body-item"
                         v-for="item in List"
                         :key="item.id"
                         @click="handleCollAddres(item)" >
                        <div class="title">{{item.name}}</div>
                        <div class="addres">{{item.address}}</div>
                    </div>
                </div>
            <div class="from">
                <div class="from-submit" @click="handleAdd">新增地址</div>
            </div>
        </van-list>
    </div>
</template>

<style src="./index.css" scoped></style>

<script>
    import countTo from 'vue-count-to';
    import mixins from '../../../common/mixin';
    import navBar from '../../../component/navBar';

    export default {
        components: {
            countTo,
            navBar
        },
        mixins: [mixins],
        data: () => ({
            page: 1,
            size: 15,
            List: [],
            addresList: [],
            loading: false,         // 滚动加载参数
            finished: false         // 滚动加载参数
        }),
        created() {

        },
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
            // 下拉加载
            rollLoad: function() {
                if(this.List.length < this.addresList.total) {
                    this.page += 1;
                    this.handleLoad();
                } else{
                    this.loading = false;
                    this.finished = true;
                }
            },
            handleLoad: function () {
                this.request({
                    url: 'api/address',
                    method: 'GET',
                    data: {
                        currency_id: this.$route.query.id,
                        size: this.size,
                        page: this.page
                    },
                    success: (response) => {
                        this.List = this.List.concat(response.data);
                        this.addresList = response;
                    },
                    error: (response) => {

                    },
                    complete: (response) => {
                        // 关闭列表滚动
                        this.loading = false;
                        if(this.List.length >= this.addresList.total){
                            this.finished = true;
                        }
                    }
                });
            },
            handleEdit: function () {
                this.$router.push({
                    path: '/walletAddresEdit',
                    query: {
                        title: this.$route.query.title,
                        id: this.$route.query.id
                    }
                });
            },
            handleAdd: function () {
                this.$router.push({
                    path: '/walletAddresDetail',
                    query: {
                        title: this.$route.query.title,
                        id: this.$route.query.id,
                        amount: this.$route.query.amount
                    }
                });
            },
            handleCollAddres: function (item) {
                this.$router.replace({
                    path: '/walletExtract',
                    query: {
                        id: this.$route.query.id,
                        title: this.$route.query.title,
                        addres: item.address,
                        amount: this.$route.query.amount
                    }
                });
            }
        }
    }
</script>

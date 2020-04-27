<template>
    <div class="addres addres-edit">
        <div class="navBar">
            <navBar title="编辑地址"></navBar>
            <span class="edit" @click="handleBack">完成</span>
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
                     v-for="(item, index) in List"
                     :key="item.id"
                     @click="handleSelect(item.id, index)" >
                    <div class="radio">
                        <van-icon v-if="item.active" size="21" name="checked" />
                        <van-icon v-else size="20" name="circle" />
                    </div>
                    <div class="title">{{item.name}}</div>
                    <div class="addres">{{item.address}}</div>
                </div>
            </div>
            <div class="from">
                <div class="from-submit" @click="handleDelte">删除地址</div>
            </div>
        </van-list>
    </div>
</template>

<style>
    .addres-edit .bar .bar-back{
        display: none !important;
    }
</style>
<style src="./edit.css" scoped></style>

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
        mounted() {
            this.handleLoad();
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

                        this.List.map((data) => {
                            data.active = false;
                        })
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
            handleSelect: function (id, index) {
                this.List[index].active = !this.List[index].active;
                // 防止视图不更新
                this.$set(this.List, index, this.List[index]);
            },
            handleDelte: function () {
                let idArr = []
                this.List.map((data) => {
                    if(data.active) {
                        idArr.push(data.id)
                    }
                });

                this.request({
                    url: 'api/address',
                    method: 'PUT',
                    data: {
                        id: idArr
                    },
                    success: (response) => {
                        this.$toast.center('删除成功');
                        this.List = [];

                        this.handleLoad();
                    },
                    error: (response) => {

                    },
                    complete: (response) => {

                    }
                });
            }
        },
        // 设置路由钩子，存储页面来源
        beforeRouteEnter(to, from, next) {
            next(vm=>{          //  这里的vm指的就是vue实例，可以用来当做this使用
                sessionStorage.setItem('url_from', from.path);
            })
        }
    }
</script>

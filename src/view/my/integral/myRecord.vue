<template>
    <div>
        <navBar title="操作记录" class="operate"></navBar>
        <div class="record">
            <van-list v-model="loading"
                      :finished="finished"
                      :offset="100"
                      :immediate-check="false"
                      finished-text="没有更多了"
                      @load="rollLoad" >
                <div class="record-item"
                     @click="handleRecordDetail(item.id)"
                     v-for="(item, index) in transferList"
                     :key="index" >
                   <!-- <div class="record-title">{{item.remark}}</div>-->
                    <div class="record-item-body">
                        <div class="record-item-body-number">
                            划转
                            <p>{{item.created_YMD}} {{item.created_TMS}}</p>
                        </div>
                        <div class="record-item-body-status">
                           +
                            <countTo :startVal='0' :decimals="2" :endVal='Number(item.amount)' :duration='1'></countTo>
                        </div>

                    </div>
                </div>
            </van-list>
        </div>
    </div>
</template>

<style src="./myRecord.css" scoped></style>

<script>
    import mixins from '../../../common/mixin';
    import navBar from '../../../component/navBar';
    import { Toast } from 'vant';
    import countTo from 'vue-count-to';

    export default {
        components: {
            Toast,
            navBar,
            countTo
        },
        mixins: [mixins],
        data: () => ({
            loading: false,
            finished: false,
            page: 1,
            size: 10,
            transfer: {},   // 返回数据
            transferList: []
        }),
        created () {
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
                if(this.transferList.length < this.transfer.total) {
                    this.page += 1;
                    this.handleLoad();
                } else{
                    this.loading = false;
                    this.finished = true;
                }
            },
            // 请求列表
            handleLoad: function() {
                this.request({
                    url: 'api/transfer',
                    method: 'GET',
                    data: {
                        page: this.page,
                        size: this.size
                    },
                    success: (response) => {
                        this.transfer = response;

                        this.transfer.list.map((data) => {
                            // 截取年月日
                            let YMD = data.created_at.indexOf(' ');
                            data.created_YMD = data.created_at.slice(0, YMD)
                            // 截取时分秒
                            let TMS = data.created_at.indexOf(' ');
                            data.created_TMS = data.created_at.slice(TMS+1, data.created_at.length)
                        });

                        // 把数组拼接上去
                        this.transferList = this.transferList.concat(this.transfer.list);
                    },
                    error: (response) => {

                    },
                    complete: () => {
                        // 关闭列表滚动
                        this.loading = false;
                        if(this.transferList.length >= this.transfer.total){
                            this.finished = true;
                        }
                        Toast.clear();
                    }
                });
            },
            // 跳转详情
            handleRecordDetail: function(id) {
                this.$router.push({
                    path: '/myRecordDetail',
                    query: {
                        id: id
                    }
                });
            }
        }
    }
</script>

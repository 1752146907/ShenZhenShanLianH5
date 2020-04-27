<template>
    <div class="record">
        <navBar title="详情"></navBar>
        <div>
            <div class="price">
                <div class="price-title">金额</div>
                <div class="price-body">
                    <!--<div class="price-body-number">+100.00</div>-->
                    <div class="price-body-number on">
                        -
                        <countTo :startVal='0' :decimals="2" :endVal='Number(withdraw.amount ? withdraw.amount : 0)' :duration='1'></countTo>
                    </div>
                    <div class="price-body-type" v-if="withdraw.currency">{{withdraw.currency.short}}</div>
                </div>
            </div>
            <div class="record-body">
                <div class="record-item">
                    <div class="record-item-title">状态</div>
                    <div class="record-item-detailed" v-if="withdraw.handle_status">{{withdraw.handle_status.text}}</div>
                </div>
                <div class="record-item">
                    <div class="record-item-title">类型</div>
                    <div class="record-item-detailed" v-if="withdraw.type == 1">充币</div>  
                    <div class="record-item-detailed" v-if="withdraw.type == 2">提币</div>
                    <div class="record-item-detailed" v-if="withdraw.type == 3">划转</div>
                    <div class="record-item-detailed" v-if="withdraw.type == 4">空投</div>
                </div>
                <div class="record-item">
                    <div class="record-item-title">手续费</div>
                    <div class="record-item-detailed">{{withdraw.charge_nums}} UTD</div>
                </div>
                <div class="record-item" v-if="withdraw.handle_code">
                    <div class="record-item-title">交易哈希</div>
                    <div class="record-item-detailed">
                        <span style="position: relative; top: 3px;">{{withdraw.handle_code}}1212</span>
                        <img class="handleCopyCode"
                             v-clipboard:copy="withdraw.handle_code"
                             v-clipboard:success="handleCopyCode"
                             v-clipboard:error="handleOnError"
                             src="./image/icon05.png" alt="">
                    </div>
                </div>
                <div class="record-item">
                    <div class="record-item-title">收款地址</div>
                    <div class="record-item-detailed">
                        <span>{{withdraw.address_to}}</span>
                    </div>
                </div>
                <div class="record-item">
                    <div class="record-item-title">交易号</div>
                    <div class="record-item-detailed">{{withdraw.deal_code}}</div>
                </div>
                <div class="record-item">
                    <div class="record-item-title">时间</div>
                    <div class="record-item-detailed">{{withdraw.updated_at}}</div>
                </div>
                <div class="record-item" v-if="withdraw.audit.remark" style="height: auto;padding: 15px 0px">
                    <div class="record-item-title">备注</div>
                    <div class="record-item-detailed">{{withdraw.audit.remark}}</div>
                </div>

                <div class="from-submit" v-if="withdraw.status == 1 && withdraw.audit.result == 1" @click="handledel">取消</div>
            </div>
        </div>
    </div>
</template>

<style src="./detail.css" scoped></style>

<script>
    import mixins from '../../../common/mixin';
    import navBar from '../../../component/navBar';
    import { Toast } from 'vant';
    import countTo from 'vue-count-to';

    export default {
        components: {
            navBar,
            Toast,
            countTo
        },
        mixins: [mixins],
        data: () => ({
            withdraw: {}
        }),
        created () {
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
            handleCopyCode: function() {
                this.$toast.center('复制成功！');
            },
            handleOnError: function() {
                this.$toast.center('复制失败，请稍后重试');
            },
            handleLoad: function() {
                this.request({
                    url: 'api/withdraw',
                    method: 'PUT',
                    data: {
                        id: this.$route.query.id
                    },
                    success: (response) => {
                        this.withdraw = response;
                    },
                    error: (response) => {

                    },
                    complete: (response) => {
                        // 关闭列表滚动
                    }
                });
            },
            handledel: function () {
                this.request({
                    url: 'api/withdraw',
                    method: 'DELETE',
                    data: {
                        id: this.$route.query.id
                    },
                    success: (response) => {
                        this.$toast.center('转账取消成功');
                        this.handleLoad();

                        // 触发刷新列表监听事件
                        this.$notification.emit("handleDeleteWithdraw", {});
                    },
                    error: (response) => {

                    },
                    complete: (response) => {
                        // 关闭列表滚动
                    }
                });
            }
        },
        beforeDestroy() {
            // 销毁刷新列表监听事件
            this.$notification.remove("handleDeleteWithdraw");
        }
    }
</script>

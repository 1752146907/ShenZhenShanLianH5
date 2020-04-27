<template>
    <div>
        <navBar title="详情" class="operate"></navBar>
        <div class="record">
            <div class="price">
                <div class="price-title">金额</div>
                <div class="price-body">
                    <div class="price-body-number">
                        +
                        <countTo :startVal='0' :decimals="2" :endVal='Number(transfer.amount ? transfer.amount : 0)' :duration='1'></countTo>
                    </div>
                    <div class="price-body-type" v-if="transfer.currency">{{transfer.currency.short}}</div>
                </div>
            </div>
            <div class="record-body">
                <div class="record-item">
                    <div class="record-item-title">交易号</div>
                    <div class="record-item-detailed">{{transfer.deal_code}}</div>
                </div>
                <div class="record-item">
                    <div class="record-item-title">类型</div>
                    <div class="record-item-detailed" v-if="transfer.type == 1">收款</div>
                    <div class="record-item-detailed" v-if="transfer.type == 2">转账</div>
                    <div class="record-item-detailed" v-if="transfer.type == 3">划转</div>
                    <div class="record-item-detailed" v-if="transfer.type == 4">空投</div>
                </div>

                <!--<div class="record-item">
                    <div class="record-item-title">划转地址</div>
                    <div class="record-item-detailed">{{transfer.address_to}}</div>
                </div>-->
                <div class="record-item">
                    <div class="record-item-title">状态</div>
                    <div class="record-item-detailed">已完成</div>
                </div>
                <div class="record-item">
                    <div class="record-item-title">时间</div>
                    <div class="record-item-detailed">{{transfer.created_at}}</div>
                </div>
                <div class="record-item">
                    <div class="record-item-title">备注</div>
                    <div class="record-item-detailed">缤纷集划转</div>
                </div>
            </div>
        </div>
    </div>
</template>

<style src="./myRecordDetail.css" scoped></style>

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
            transfer: {}
        }),
        created () {
            this.handleLoad(this.$route.query.id);
        },
        // 设置路由钩子，存储页面来源
        beforeRouteEnter(to, from, next) {
            next(vm=>{          //  这里的vm指的就是vue实例，可以用来当做this使用
                sessionStorage.setItem('url_from', from.path);
            })
        },
        methods: {
            handleLoad: function(id) {
                this.request({
                    url: 'api/transfer',
                    method: 'PATCH',
                    data: {
                        id: id
                    },
                    success: (response) => {
                        this.transfer = response;
                    },
                    error: (response) => {

                    },
                    complete: () => {
                        Toast.clear();
                    }
                });
            }
        }
    }
</script>

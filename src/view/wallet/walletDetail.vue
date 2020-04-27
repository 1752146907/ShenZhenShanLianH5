<template>
    <div class="record">
        <navBar title="详情"></navBar>
        <div>
            <div class="price">
                <div class="price-title">金额</div>
                <div class="price-body">
                    <div class="price-body-number on" v-if="transferRecord.type == 2 || transferRecord.type == 5 || transferRecord.type == 7">
                        -
                        <countTo :startVal='0' :decimals="2" :endVal='Number(transferRecord.amount ? transferRecord.amount : 0)' :duration='1'></countTo>
                    </div>
                    <div class="price-body-number" v-else>
                        +
                        <countTo :startVal='0' :decimals="2" :endVal='Number(transferRecord.amount ? transferRecord.amount : 0)' :duration='1'></countTo>
                    </div>
                    <div class="price-body-type" v-if="transferRecord.currency">{{transferRecord.currency.short}}</div>
                </div>
            </div>
            <div class="record-body">
                <div class="record-item">
                    <div class="record-item-title">类型</div>
                    <div class="record-item-detailed" v-if="transferRecord.type == 1">充币</div>
                    <div class="record-item-detailed" v-if="transferRecord.type == 2">提币</div>
                    <div class="record-item-detailed" v-if="transferRecord.type == 3">划转</div>
                    <div class="record-item-detailed" v-if="transferRecord.type == 4">空投</div>
                    <div class="record-item-detailed" v-if="transferRecord.type == 5">支付</div>
                    <div class="record-item-detailed" v-if="transferRecord.type == 6">奖励</div>
                    <div class="record-item-detailed" v-if="transferRecord.type == 7">锁仓</div>
                </div>
                <div class="record-item">
                    <div class="record-item-title">交易号</div>
                    <div class="record-item-detailed">{{transferRecord.deal_code}}</div>
                </div>
                <!--                <div class="record-item">
                                    <div class="record-item-title">划转地址</div>
                                    <div class="record-item-detailed">{{transferRecord.address_to}}</div>
                                </div>-->
                <div class="record-item" v-if="transferRecord.type != 7">
                    <div class="record-item-title">状态</div>
                    <div class="record-item-detailed" v-if="transferRecord.handle_status">{{transferRecord.handle_status.text}}</div>
                </div>
                <div class="record-item">
                    <div class="record-item-title">时间</div>
                    <div class="record-item-detailed">{{transferRecord.updated_at}}</div>
                </div>
                <div class="record-item" v-if="transferRecord.remark" style="height: auto;padding: 15px 0px">
                    <div class="record-item-title">备注</div>
                    <div class="record-item-detailed">{{transferRecord.remark}}</div>
                </div>
            </div>
        </div>
    </div>
</template>

<style src="./walletDetail.css" scoped></style>

<script>
    import mixins from '../../common/mixin';
    import navBar from '../../component/navBar';
    import countTo from 'vue-count-to';

    export default {
        components: {
            navBar,
            countTo
        },
        mixins: [mixins],
        data: () => ({
            transferRecord: {}
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
            // 初始化数据
            handleLoad: function() {
                this.request({
                    url: 'api/assets',
                    method: 'PUT',
                    data: {
                        id: this.$route.query.id
                    },
                    success: (response) => {
                        this.transferRecord = response;
                    },
                    error: (response) => {

                    },
                    complete: (response) => {

                    }
                });
            }
        }
    }
</script>

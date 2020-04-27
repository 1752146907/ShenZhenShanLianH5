<template>
    <div class="record">
        <navBar title="详情"></navBar>
        <div>
            <div class="price">
                <div class="price-title">金额</div>
                <div class="price-body">
                    <!--<div class="price-body-number on">+{{recharge.amount}}</div>-->
                    <div class="price-body-number">
                        +<countTo :startVal='0' :decimals="2" :endVal='Number(recharge.amount ? recharge.amount : 0)' :duration='1'></countTo>
                    </div>
                    <div class="price-body-type" v-if="recharge.currency">{{recharge.currency.short}}</div>
                </div>
            </div>
            <div class="record-body">
                <div class="record-item">
                    <div class="record-item-title">交易号</div>
                    <div class="record-item-detailed">{{recharge.deal_code}}</div>
                </div>
                <div class="record-item">
                    <div class="record-item-title">类型</div>
                    <div class="record-item-detailed" v-if="recharge.type == 1">充币</div>
                    <div class="record-item-detailed" v-if="recharge.type == 2">提币</div>
                    <div class="record-item-detailed" v-if="recharge.type == 3">划转</div>
                    <div class="record-item-detailed" v-if="recharge.type == 4">空投</div>
                </div>
                <!--                <div class="record-item">
                                    <div class="record-item-title">划转地址</div>
                                    <div class="record-item-detailed">{{recharge.address_to}}</div>
                                </div>-->
                <div class="record-item">
                    <div class="record-item-title">状态</div>
                    <div class="record-item-detailed" v-if="recharge.handle_status  ">{{recharge.handle_status.text}}</div>
                </div>
                <div class="record-item">
                    <div class="record-item-title">时间</div>
                    <div class="record-item-detailed">{{recharge.updated_at}}</div>
                </div>
                <div class="record-item">
                    <div class="record-item-title">备注</div>
                    <div class="record-item-detailed">{{recharge.remark ? recharge.remark : '暂无'}}</div>
                </div>
                <div class="record-item" v-if="recharge.handle_code">
                    <div class="record-item-title">交易哈希</div>
                    <div class="record-item-detailed">{{recharge.handle_code}}</div>
                </div>
            </div>
        </div>
    </div>
</template>

<style src="./detail.css" scoped></style>

<script>
    import mixins from '../../../common/mixin';
    import navBar from '../../../component/navBar';
    import countTo from 'vue-count-to';

    export default {
        components: {
            navBar,
            countTo
        },
        mixins: [mixins],
        data: () => ({
            recharge: {}
        }),
        created () {

        },
        mounted () {
            this.handleLoad();
        },
        // 设置路由钩子，存储页面来源
        beforeRouteEnter(to, from, next) {
            next(vm=>{          //  这里的vm指的就是vue实例，可以用来当做this使用
                sessionStorage.setItem('url_from', from.path);
            })
        },
        methods: {
            handleLoad: function() {
                this.request({
                    url: 'api/recharge',
                    method: 'PUT',
                    data: {
                        id: this.$route.query.id
                    },
                    success: (response) => {
                        this.recharge = response;
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

<template>
    <div class="express" >
        <navBar title="物流详情"></navBar>
        <!-- 物流公司 -->
        <div class="express-info">
            <div>
                配送单号：15235151215135
            </div>
            <div>
                配送公司：顺丰快递
            </div>
        </div>
        <!-- 物流动态 -->
        <div class="logis-detail">
            <div :class="index==0? 'logis-item first':'logis-item'" v-for="(item,index) in express.list">
                <div class="logis-item-content">
                    <div class="logis-item-content__describe">
                        <div class="item-info">yagdjsgasghjagjad</div>
                    </div>
                    <div class="logis-item-content__time">
                        <div class="item-time">2019-9-27 14:43</div>
                    </div>
                </div>
            </div>
            <div v-if="express.list.length == 0" class="no-data" style="padding-top: 150px">
                <img src="./image/seach.png" class="no-data-image-icon" alt="">
                <p>抱歉，暂无该物流信息</p>
            </div>
        </div>
    </div>
</template>
<style src="./express.css" scoped></style>
<script>
    import mixins from '../../common/mixin';
    import navBar from '../../component/navBar';

    export default {
        components: {
            navBar
        },
        mixins: [mixins],

        data: () => ({
            express: {list:[]},
         }),
        // 设置路由钩子，存储页面来源
        beforeRouteEnter(to, from, next) {
            next(vm=>{          //  这里的vm指的就是vue实例，可以用来当做this使用
                sessionStorage.setItem('url_from', from.path);
            })
        },
        created () {

        },
        mounted() {

        },
        methods: {


        }
    }
</script>


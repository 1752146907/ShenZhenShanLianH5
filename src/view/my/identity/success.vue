<template>
    <div>
        <navBar title="身份认证"></navBar>
        <img class="img" src="./image/status01.png" alt="">
        <div class="title">信息提交成功</div>
        <div class="title-text">客服小姐姐将在一个工作日内为您审核~</div>
        <div class="chack" @click="handleChack">确定</div>
    </div>
</template>

<style src="./success.css" scoped></style>

<script>
    import mixins from '../../../common/mixin';
    import navBar from '../../../component/navBar';

    export default {
        components: {
            navBar
        },
        mixins: [mixins],
        data: () => ({
            reason: ''     // 拒绝原因
        }),
        created () {
            if(this.$route.query.break) {
                this.reason = this.$route.query.break
            }
        },
        // 设置路由钩子，存储页面来源
        beforeRouteEnter(to, from, next) {
            next(vm=>{          //  这里的vm指的就是vue实例，可以用来当做this使用
                sessionStorage.setItem('url_from', from.path);
            })
        },
        methods: {
            handleChack: function() {
                this.handleBack();
            }
        }
    }
</script>

<template>
    <div>
        <navBar title="身份认证"></navBar>
        <img class="img" src="./image/status02.png" alt="">
        <div class="title">审核不通过</div>
        <div class="title-text">{{reason}}</div>
        <div class="chack" @click="handleChack">重新认证</div>
    </div>
</template>

<style src="./error.css" scoped></style>

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
            //  跳转去认证
            handleChack: function() {
                this.$router.replace({
                    path: '/identity',
                    query: {
                        datum: JSON.stringify([]),  // 必须填，否则数组报错
                        status: 1
                    }
                });
            }
        }
    }
</script>

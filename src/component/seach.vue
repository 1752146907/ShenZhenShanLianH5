<template>
    <div>
        <van-search shape="round"
                    v-model="seachKey"
                    @search="onSearch"
                    placeholder="搜索" />
    </div>
</template>

<style scoped>
    .van-search__content{
        background: #ffffff;
        border: 1px solid #D8D8D8;
    }
    .van-icon-search{
        color: #D8D8D8;
    }
    .van-field__control{
        color: #D8D8D8;
    }
</style>

<script>
    import mixins from '../common/mixin';
    export default {
        components: {

        },
        mixins: [mixins],
        data: () => ({
            seachKey: '',    // 搜索关键字
        }),
        mounted () {
        },
        methods: {
            onSearch: function () {
                this.$router.push({
                    path: '/noticeSeach',
                    query: {
                        key: this.seachKey
                    }
                });
            }
        }
    }
</script>
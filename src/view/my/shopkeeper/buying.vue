<template>
    <div class="creation" v-if="warrant.storekeeper_info">
        <navBar title="抢购规则"></navBar>
        <div class="buying">
            <div class="buying-text"
                 v-for="(item, index) in warrant.storekeeper_info.rule" v-if="index >0 " :key="index"><i></i>
                <p>{{item}}</p>
            </div>
        </div>
    </div>

</template>
<style src="./buying.css" scoped></style>
<script>
    import mixins from '../../../common/mixin';
    import navBar from '../../../component/navBar';
    import {Toast, Dialog, Popup} from 'vant';

    export default {
        components: {
            navBar,
            Dialog,
            Toast,
            Popup
        },
        mixins: [mixins],
        data: () => ({
            isLoadSuccess: false,			// 页面是否完成加载
            warrant: {},					// 加载回来的数据
            account: '',					// 用户身份
            showImagePreview: false 		// 是否显示图片预览
        }),
        created() {

        },
        // 设置路由钩子，存储页面来源
        beforeRouteEnter(to, from, next) {
            next(vm => {          //  这里的vm指的就是vue实例，可以用来当做this使用
                sessionStorage.setItem('url_from', from.path);
            })
        },
        mounted() {

            this.account = this.$route.query.id;
            this.handleLoad();
        },
        methods: {
            handleLoad: function () {
                this.request({
                    url: 'api/warrant',
                    method: 'GET',
                    data: {
                        type: this.account
                    },
                    success: (response) => {
                        this.warrant = response;
                    },
                    error: (response) => {

                    },
                    complete: (response) => {

                    }
                });
            },


        }
    }
</script>

<style scoped>

</style>
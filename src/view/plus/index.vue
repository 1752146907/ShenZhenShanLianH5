<template>
   <div class="back-plus">
      <div class="plus-head">
         <img src="../home/image/utd.png">
         <p>Plus</p>
         <div>
            <div class="more" >
               <barOverlay />
            </div>
         </div>
      </div>
      <div class="catalogue">
         <div class="catalogue-shopkeeper" @click="handleShopkeeper">
            <div class="plus-text"><img src="./image/plus_ico_02.png">缤纷集店主</div>
           <i class="van-icon van-icon-arrow" style="color: rgba(26, 26, 26, 0.3); font-size: 18px;"><!----></i>
         </div>
         <div class="catalogue-shopkeeper" @click="handleCommittee">
            <div class="plus-text"><img src="./image/plus_ico_01.png">自治委员会</div>
            <i class="van-icon van-icon-arrow" style="color: rgba(26, 26, 26, 0.3); font-size: 18px;"><!----></i>
         </div>
         <div class="catalogue-shopkeeper" @click="handlemall" v-if="false">
            <div class="plus-text"><img src="./image/plus_ico_03.png">UTD商城</div>
            <i class="van-icon van-icon-arrow" style="color: rgba(26, 26, 26, 0.3); font-size: 18px;"><!----></i>
         </div>
      </div>
      <div class="plus-right"></div>
      <div class="plus-left"></div>
   </div>
</template>
<style src="./index.css" scoped></style>
<script>
    import { Toast, Dialog } from 'vant';
    import mixins from '../../common/mixin';
    import Footer from '../../component/footer/footer';
    import barOverlay from '../../component/barOverlay/index';

    export default {
        components: {
            Toast,
            Dialog,
            Footer,
            barOverlay
        },
        mixins: [mixins],

        data: () => ({
            isShowMenu: false,       // 是否显示菜单
            userInfo:{},
            UTDEX_WhitePaper: 'http://www.utdex.net/UTDEX_WhitePaper.pdf'     // PDF下载地址
    }),
        // 设置路由钩子，存储页面来源
        beforeRouteEnter(to, from, next) {
            next(vm=>{          //  这里的vm指的就是vue实例，可以用来当做this使用
                sessionStorage.setItem('url_from', from.path);
            })
        },
        created () {
            this.handleGetUserInfo();
        },
        mounted() {
        },
        methods: {
            // 初始化用户信息
            handleGetUserInfo: function() {
                this.request({
                    url: 'api/user',
                    method: 'GET',
                    data: { },
                    success: (response) => {
                        this.userInfo = response;
                        // 手机号加密

                    },
                    error: (response) => {

                    },
                    complete: (response) => {
                        Toast.clear();
                    }
                });
            },
            handleShopkeeper:function () {
                this.$router.push({
                    path: '/creation',
                    query: {

                    }
                });
            },
            handleCommittee:function () {
                this.$router.push({
                    path: '/plus/committee',
                    query: {
                        account: encodeURIComponent(JSON.stringify(this.userInfo))
                    }
                });
            },
            handlemall:function () {
                this.$router.push({
                    path: '/plus/shopx/index',
                    query: {

                    }
                });
            }

        }
    }
</script>

<style scoped>

</style>


<template>
    <div>
        <!--菜单弹出层-->
        <div class="more"
             v-if="isCheckMenu"
             :style="isShowMenu ? 'position: fixed' : '' "
             @click="handleCloseMenu" >
            <i :class="isShowMenu ? 'rotateY' : ''"></i>
            <i v-if="!isShowMenu"></i>
            <i :class="isShowMenu ? 'rotateX' : ''"></i>
        </div>
        <div class="mask"
             v-if="isShowMenu"
             @click="isShowMenu = false"
             @touchmove.prevent></div>
        <div class="mask-body" v-if="isShowMenu" @touchmove.prevent>
            <router-link to="/home">
                <p @click="isShowMenu = false">首页</p>
            </router-link>
            <router-link to="/wallet">
                <p @click="isShowMenu = false">钱包</p>
            </router-link>
            <router-link to="/plus">
                <p @click="isShowMenu = false">Plus</p>
            </router-link>
            <a :href="UTDEX_WhitePaper" target="_blank">
                <p @click="isShowMenu = false">白皮书</p>
            </a>
            <router-link to="/myIndex" v-if="isToken">
                <p @click="isShowMenu = false">个人中心</p>
            </router-link>
            <router-link to="/login" v-else>
                <p @click="isShowMenu = false">登录/注册</p>
            </router-link>
        </div>
    </div>
</template>

<script>
    export default {
        data: () => ({
            isCheckMenu: false,
        }),
        created(){
            // 是否显示菜单按钮
            this.handleIsShowMenu();
        },
        mounted(){
            // 读取totek
            this.isToken = this.$storage.getToken();
        },
        beforeDestroy(){
            // 页面离开销毁
        },
        methods:{
            // 是否显示菜单按钮
            handleIsShowMenu: function() {
                if(this.$route.path == '/home' || this.$route.path == '/wallet' || this.$route.path == '/plus' || this.$route.path == '/myIndex') {
                    this.isCheckMenu = true;
                } else {
                    this.isCheckMenu = false;
                }
            },
            // 点击显示按钮
            handleMenu: function() {
                this.isShowMenu = !this.isShowMenu;
                this.isCheckMenu = true;
            },
            // 点击关闭按钮
            handleCloseMenu: function() {
                this.isShowMenu = !this.isShowMenu;
                this.handleIsShowMenu();
            }
        },
        data(){
            return{
                timer:null,
                currentTop:0,
                clientWidth:0,
                clientHeight:0,
                left:0,
                top:0,
                isToken: '',                            // 是否已登录
                UTDEX_WhitePaper: 'http://www.utdex.net/UTDEX_WhitePaper.pdf',     // PDF下载地址
                isShowMenu: false                       // 是否显示按钮
            }
        }
    }
</script>

<style scoped>
    /*菜单弹出层*/
    .mask{
        position: fixed;
        top: 0px;
        right: 0px;
        bottom: 0px;
        left: 0px;
        background: #000000;
        opacity: 0.9;
        transition: all .3s ease-in-out;
        z-index: 99;
    }
    .mask-body{
        position: fixed;
        margin:auto auto;
        left:0px;
        right:0px;
        top: 30%;
        z-index: 99;
    }
    .mask-body p{
        text-align: center;
        line-height:26px !important;
        font-size:20px !important;
        font-weight:400 !important;
        color:rgba(255,255,255,1) !important;
        margin-bottom: 37px;
        text-shadow: none;
    }
    .more{
        width: 29px;
        height: 18px;
        font-size:12px;
        color:#333333;
        top: 20px;
        right: 15px;
        z-index: 999;
    }
    .more i{
        display: block;
        width: 29px;
        height: 2px;
        border-radius: 1px;
        background: #ffffff;
        transition: all .3s ease-in-out;
    }
    .more i:nth-child(2) {
        margin: 4px 0px;
    }
    .more .rotateY {
        transform: translateY(5px) rotate(-45deg);
    }
    .more .rotateX {
        transform: translateY(-1px) rotate(45deg);
    }
    .more p{
        line-height: 38px;
        color: #696969;
        font-size:12px;
    }
</style>

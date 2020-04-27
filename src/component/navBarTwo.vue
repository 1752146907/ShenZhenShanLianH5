<template>
    <div class="bar-two">
        <div class="bar-box">
            <van-icon class="bar-back" name="arrow-left" @click="handleBack" size="20" />
            <!--<img class="bar-back" src="../image/back.png" alt="">-->
            {{title}}
        </div>
    </div>
</template>

<style>
    .bar-two{
        height: 44px;
        position: sticky;
        left: 0px;
        top: 0px;
        right: 0px;
        line-height: 44px;
        text-align: center;
        font-size: 20px;
        background: #294297 !important;
        z-index: 99;
    }
    .bar-two .bar-box{
        height: 44px;
        position: relative;
        font-size:17px;
        font-family:PingFangSC;
        font-weight:400;
        color: #FFFFFF !important;

    }
    .bar-two .bar-back{
        position: absolute;
        top: 12px;
        left: 16px;
    }
</style>

<script>
    import { Icon } from 'vant';

    export default {
        components: {
            Icon
        },
        props: {
            title: {
                required: false
            }
        },
        data: () => ({

        }),
        created () {

        },
        methods: {
            handleBack: function () {
                //返回上一层
                if (window.history.length <= 1) {
                    this.$router.push({path:'/'})
                    return false
                } else {
                    if(sessionStorage.getItem('url_from') && sessionStorage.getItem('url_from') != null){
                        this.$router.go(-1)
                    } else{
                        this.$router.push({path:'/'})
                    }
                }
            }
        }
    }
</script>

<template>
    <div class="main">
        <!--banner-->
        <div class="banner">
            <vue-particles color="#ffffff" :particleOpacity="0.2"
                           :particlesNumber="120" shapeType="circle"
                           :particleSize="2" linesColor="#ffffff"
                           :linesWidth="1" :lineLinked="true"
                           :lineOpacity="0.2" :linesDistance="100"
                           :moveSpeed="2" :hoverEffect="true"
                           hoverMode="grab" :clickEffect="true"
                           clickMode="push" class="banner-particles" >
            </vue-particles>
            <div style="position: absolute; top:0px;left: 0px;right: 0px;">
                <div class="utd">
                    <img style="width: 50px;" src="./image/utd.png" alt="">
                    <div class="more">
                        <barOverlay />
                    </div>
                </div>
            </div>
            <div class="banner-body">
                <img src="../../image/login.png" alt="">
                <div class="banner-body-title">全球Token经济践行者</div>
                <div class="banner-body-sub">重构价值　重塑关系</div>
            </div>
        </div>
        <!--缤纷集-->
        <div class="bifenji">
            <p>缤纷集</p>
            <p>基于Token经济链商新模式</p>
            <div class="bifenji-body">
                <img src="./image/binfenji01.png" style="width: 193px;height: 391px;margin: 0 auto;display: block;" alt="">
                <div class="bifenji-body-box"
                     id="bifenji-body-box"
                     v-if="false"
                     @touchmove.prevent >
                    <div class="card"
                         :class="index+1 == binfenji.length ? 'card-last' : '' "
                         :style="{ 'opacity': !isStartBinfenjiAnimation ? '1' : ''}"
                         v-for="(item, index) in binfenji"
                         :key="index" >
                        <img class="slide-product"
                             :style="{ 'left': !isStartBinfenjiAnimation ? '0' : ''}"
                             :src="item" alt="">
                    </div>
                </div>
                <img class="slide-solid"
                     v-if="false"
                     src="./image/phone.png"
                     alt="" />
                <div class="bifenji-body-mask"></div>
                <img v-if="!isStartBinfenjiAnimation" class="bifenji-body-arr-left"
                     src="./image/arr.png"
                     :class="binfenjiClickRight == 0? 'opacity0-2' : ''"
                     @click="handleBifenji(1)"
                     alt="" />
                <img v-if="!isStartBinfenjiAnimation" class="bifenji-body-arr-right"
                     src="./image/arr.png"
                     :class="binfenjiClickRight == (binfenji.length - 1)? 'opacity0-2' : ''"
                     @click="handleBifenji(2)"
                     alt="" />
            </div>
        </div>
        <!--用户-->
        <div class="user">
            <div class="user-top-dot"></div>
            <div class="user-bottom-dot"></div>
            <swiper :options="swiperOption"
                    style="height: 476px;"
                    @slideChange="transitionStart">
                <swiper-slide>
                    <div class="user-title">用户</div>
                    <div class="user-body">
                        <div class="user-body-item">
                            <div class="number">
                                <countTo :startVal='0' :decimals="0" :endVal='Number(pageData.total_users ? pageData.total_users : 0)' :duration='3000'></countTo>
                            </div>
                            <div class="progress1" v-if="userStatistics[0] == '100%'" :style="{width: userStatistics[0]}"></div>
                            <div class="progress1" style="transition: all 0s;" v-else :style="{width: userStatistics[0]}"></div>
                            <div class="text">总数</div>
                        </div>
                        <div class="user-body-item">
                            <div class="number">
                                <countTo :startVal='0' :decimals="0" :endVal='Number(pageData.yesterday_users ? pageData.yesterday_users : 0)' :duration='3000'></countTo>
                            </div>
                            <div class="progress2" v-if="userStatistics[1] == '50%'" :style="{width: userStatistics[1]}"></div>
                            <div class="progress2" style="transition: all 0s;" v-else :style="{width: userStatistics[1]}"></div>
                            <div class="text">昨日新增</div>
                        </div>
                        <div class="user-body-item">
                            <div class="number">
                                <countTo :startVal='0' :decimals="0" :endVal='Number(pageData.today_users ? pageData.today_users : 0)' :duration='3000'></countTo>
                            </div>
                            <div class="progress3" v-if="userStatistics[2] == '30%'" :style="{width: userStatistics[2]}"></div>
                            <div class="progress3" style="transition: all 0s;" v-else :style="{width: userStatistics[2]}"></div>
                            <div class="text">今日新增</div>
                        </div>
                        <!--<div class="user-body-tab">
                            <span class="left">
                                <span class="solid">
                                    <span class="dot"></span>
                                </span>
                                <span class="user-body-tab-text">已有</span>
                            </span>
                            <span class="right">
                                <span class="solid">
                                    <span class="dot"></span>
                                </span>
                                <span class="user-body-tab-text">新增</span>
                            </span>
                        </div>-->
                    </div>
                </swiper-slide>
                <swiper-slide>
                    <div class="user-title">交易</div>
                    <div class="user-body">
                        <div class="user-body-item">
                            <div class="number">
                                <countTo :startVal='0' :decimals="2" :endVal='Number(pageData.total_sums ? pageData.total_sums : 0)' :duration='2000'></countTo>
                            </div>
                            <div class="progress1" v-if="userStatistics[0] == '100%'" :style="{width: userStatistics[0]}"></div>
                            <div class="progress1" style="transition: all 0s;" v-else :style="{width: userStatistics[0]}"></div>
                            <div class="text">总额（元）</div>
                        </div>
                        <div class="user-body-item">
                            <div class="number">
                                <countTo :startVal='0' :decimals="2" :endVal='Number(pageData.yesterday_sums ? pageData.yesterday_sums : 0)' :duration='2000'></countTo>
                            </div>
                            <div class="progress2" v-if="userStatistics[1] == '50%'" :style="{width: userStatistics[1]}"></div>
                            <div class="progress2" style="transition: all 0s;" v-else :style="{width: userStatistics[1]}"></div>
                            <div class="text">昨日（元）</div>
                        </div>
                        <div class="user-body-item">
                            <div class="number">
                                <countTo :startVal='0' :decimals="2" :endVal='Number(pageData.today_sums ? pageData.today_sums : 0)' :duration='2000'></countTo>
                            </div>
                            <div class="progress3" v-if="userStatistics[2] == '30%'" :style="{width: userStatistics[2]}"></div>
                            <div class="progress3" style="transition: all 0s;" v-else :style="{width: userStatistics[2]}"></div>
                            <div class="text">今日（元）</div>
                        </div>
                    </div>
                </swiper-slide>
                <swiper-slide>
                    <div class="user-title">订单</div>
                    <div class="user-body">
                        <div class="user-body-item">
                            <div class="number">
                                <countTo :startVal='0' :decimals="0" :endVal='Number(pageData.total_orders ? pageData.total_orders : 0)' :duration='3000'></countTo>
                            </div>
                            <div class="progress1" v-if="userStatistics[0] == '100%'" :style="{width: userStatistics[0]}"></div>
                            <div class="progress1" style="transition: all 0s;" v-else :style="{width: userStatistics[0]}"></div>
                            <div class="text">总数</div>
                        </div>
                        <div class="user-body-item">
                            <div class="number">
                                <countTo :startVal='0' :decimals="0" :endVal='Number(pageData.yesterday_orders ? pageData.yesterday_orders : 0)' :duration='3000'></countTo>
                            </div>
                            <div class="progress2" v-if="userStatistics[1] == '50%'" :style="{width: userStatistics[1]}"></div>
                            <div class="progress1" style="transition: all 0s;" v-else :style="{width: userStatistics[0]}"></div>
                            <div class="text">昨日新增</div>
                        </div>
                        <div class="user-body-item">
                            <div class="number">
                                <countTo :startVal='0' :decimals="0" :endVal='Number(pageData.today_orders ? pageData.today_orders : 0)' :duration='3000'></countTo>
                            </div>
                            <div class="progress3" v-if="userStatistics[2] == '30%'" :style="{width: userStatistics[2]}"></div>
                            <div class="progress1" style="transition: all 0s;" v-else :style="{width: userStatistics[0]}"></div>
                            <div class="text">今日新增</div>
                        </div>
                    </div>
                </swiper-slide>
                <div class="swiper-pagination" slot="pagination"></div>
            </swiper>
        </div>
        <!--委员会-->
        <div class="slef-community">
            <div class="slef-community-title">UTD自治委员会</div>
            <div class="slef-community-title" style="margin-top: 10px;">一个高度自治的分布式自组织</div>
            <div class="slef-community-tab">
                <span @click="communityTab = true" :class="!communityTab ? 'right' : ''">社区介绍</span>
                <span @click="communityTab = false" :class="communityTab ? 'right' : ''">治理架构</span>
            </div>
            <div v-if="communityTab">
                <p>自治委员会是UTD最高权力和治理机构，加入自治委的理事成员拥有建议权、投票权、知情权、监督权。</p>
                <p>【加入方式】自愿锁仓 100,000 UTD</p>
                <p>【理事特权】每新加入一位理事成员，已加入的理事会成员每人获得 100 UTD奖励。</p>
                <p>【百倍计划】加入UTD自治委员会即自动加入百倍计划：UTD市场价格到达人民币3元时，锁仓的UTD解锁50%，UTD市场价格每增加1元，解锁剩余部分10%，直至全部解锁完毕。</p>
            </div>
            <img v-if="!communityTab" style="width: 298px;margin: 62px 0px 88px 0px;" src="./image/obj04.png" alt="">
            <img class="slef-community-obj01" src="./image/obj01.png" alt="">
            <div class="menber">
                <div class="menber-item">
                    <img src="./image/obj02.png" alt="">
                    <p><countTo :startVal='0' :decimals="0" :endVal='Number(pageData.council_user ? pageData.council_user : 0)' :duration='3000'></countTo></p>
                    <div class="text">理事会成员人数</div>
                </div>
                <div class="menber-item">
                    <img src="./image/obj03.png" alt="">
                    <p><countTo :startVal='0' :decimals="0" :endVal='Number(pageData.locked_nums ? pageData.locked_nums : 0)' :duration='3000'></countTo></p>
                    <div class="text">锁仓UTD(枚)</div>
                </div>
            </div>
        </div>
        <!--战略合作-->
        <div class="cooperation">
            <div class="hender">
                <img class="hender-logo" src="../../image/login.png" alt="">
                <div class="hender-body">
                    <div class="hender-body-title">战略合作</div>
                    <p>{{cooperationList[cooperationNumber].content}}</p>
                </div>
            </div>
            <div class="cooperation-body">
                <img v-for="(item, index) in cooperationList"
                     :key="index"
                     @click="handleClickCooperation(index)"
                     :src="index == cooperationNumber ? item.srcOn : item.src"
                     alt="">
            </div>
        </div>
        <!--链接-->
        <div class="link">
            <a :href="UTDEX_WhitePaper" target="_blank">
                <div class="link-item">白皮书</div>
            </a>
            <router-link to="/wallet">
                <div class="link-item">钱包</div>
            </router-link>
            <router-link to="/myIndex" v-if="isToken">
                <div class="link-item">个人中心</div>
            </router-link>
            <router-link to="/login" v-else>
                <div class="link-item">登录/注册</div>
            </router-link>
        </div>
        <!--其它登录方式-->
        <div class="orter" v-if="false">
            <img src="./image/orter03.png" alt="">
            <img src="./image/orter02.png" alt="">
            <img src="./image/orter04.png" alt="">
            <img src="./image/orter01.png" alt="">
        </div>
        <!--脚部-->
        <div class="footer">
            <p>UTD Group Limited </p>
            <p>(BVI COMPANY NUMBER:1999092)</p>
        </div>
        <!--公告-->
        <div class="notice" v-if="false">
            <van-icon name="volume-o" color="#696969"/>
            <van-swipe style="height: 37px;flex: 1" :show-indicators="false" :autoplay="5000" :duration="1000" vertical>
                <van-swipe-item v-for="(item, index) in newNotice" :key="index" @click="handleNotice(item.id)">
                    <p class="van-ellipsis">{{index + 1}}、{{item.title}}</p>
                </van-swipe-item>
            </van-swipe>
            <span class="more" @click="handleMore">更多</span>
        </div>
        <!--<Footer :active="0"/>-->
    </div>
</template>

<style>
    .user .swiper-pagination-bullet-active{
        background: #ffffff;
    }
</style>
<style src="./index.css" scoped></style>

<script>

    import mixins from '../../common/mixin';
    import Footer from '../../component/footer/footer';
    import countTo from 'vue-count-to';
    import barOverlay from '../../component/barOverlay/index';

    import 'swiper/dist/css/swiper.css';
    import { swiper, swiperSlide } from 'vue-awesome-swiper';

    export default {
        components: {
            Footer,
            swiper,
            swiperSlide,
            countTo,
            barOverlay
        },
        mixins: [mixins],
        data: () => ({
            UTDEX_WhitePaper: 'http://www.utdex.net/UTDEX_WhitePaper.pdf',     // PDF下载地址
            swiperOption: {
                spaceBetween: 30,
                pagination: {
                    el: '.swiper-pagination',
                    clickable: true
                },
                on: {
                    slideChangeTransitionEnd: function (swiper) {
                        console.log(this.activeIndex);
                    }
                }
            },
            pageData: {},            // 请求数据
            newNotice: [],           // 公告跑马灯
            isShowMenu: false,       // 是否显示菜单
            binfenji: [
                'http://cdn.dowebok.com/134/images/i2/13.jpg',
                require('./image/binfenji.png'),
                'http://cdn.dowebok.com/134/images/i2/24.jpg',
                'http://cdn.dowebok.com/134/images/i2/14.jpg',
                'http://cdn.dowebok.com/134/images/i2/12.jpg',
                'http://cdn.dowebok.com/134/images/i2/23.jpg',
            ],         // 缤纷集图片列表
            binfenjiClickRight: 1,   // 点击右侧按钮次数
            cooperationNumber: 0,    // 合作品牌高亮位置
            communityTab: true,      // 委员会标签切换
            cooperationList: [{
                src: require('./image/partner03.png'),
                srcOn: require('./image/partner03_on.png'),
                content: 'UTD以TOKEN经济重构生产资料所有制、以分布式自组织重塑生产关系，期待UTD重构商业价值，书写新商业！'
            },{
                src: require('./image/partner01.png'),
                srcOn: require('./image/partner01_on.png'),
                content: 'UTD以TOKEN经济重构生产资料所有制、以分布式自组织重塑生产关系，期待UTD重构商业价值，书写新商业！'
            },  {
                src: require('./image/partner04.png'),
                srcOn: require('./image/partner04_on.png'),
                content: 'UTD以TOKEN经济重构生产资料所有制、以分布式自组织重塑生产关系，期待UTD重构商业价值，书写新商业！'
            }, {
                src: require('./image/partner05.png'),
                srcOn: require('./image/partner05_on.png'),
                content: 'UTD以TOKEN经济重构生产资料所有制、以分布式自组织重塑生产关系，期待UTD重构商业价值，书写新商业！'
            }, {
                src: require('./image/partner06.png'),
                srcOn: require('./image/partner06_on.png'),
                content: 'UTD以TOKEN经济重构生产资料所有制、以分布式自组织重塑生产关系，期待UTD重构商业价值，书写新商业！'
            }],
            isStartBinfenjiAnimation: true,             // 是否显示缤纷集手机动画
            isStartUserAnimation: true,             // 是否显示用户数据动画
            userStatistics: ['0%', '0%', '0%'],     // 用户数据进度条百分比
            councilAnimation: true,                // 理事会成员动画
            lockUtdAnimation: true,                // 锁仓UTD动画
            swiperOptionTop: {
                spaceBetween: 10,
                navigation: {
                    nextEl: '.swiper-button-next',
                    prevEl: '.swiper-button-prev'
                }
            },
            swiperOptionThumbs: {
                spaceBetween: 10,
                centeredSlides: true,
                slidesPerView: 'auto',
                touchRatio: 0.2,
                slideToClickedSlide: true
            },
            isToken: ''                            // 是否已登录
        }),
        mounted() {
            this.handleLoad();
            this.handleNewNotice();
            // 缤纷集滚动
            // document.getElementById("bifenji-body-box").scrollLeft = 189;
            // 监听页面滚动
            this.handleWinowScroll();
            // 读取totek
            this.isToken = this.$storage.getToken();
            // 滚动到头部
            window.scrollTo(0, 0);
        },
        // 设置路由钩子，存储页面来源
        beforeRouteEnter(to, from, next) {
            next(vm=>{          //  这里的vm指的就是vue实例，可以用来当做this使用
                sessionStorage.setItem('url_from', from.path);
            })
        },
        methods: {
            // 用户数据swiper滑动回调
            transitionStart: function() {
                var pageData = {...this.pageData};
                this.pageData = {};
                this.userStatistics = ['0%', '0%', '0%'];
                setTimeout(() => {
                    this.pageData = pageData;
                    this.userStatistics = ['100%', '50%', '30%']
                }, 100)
            },
            handleWinowScroll: function() {
                window.onscroll = () => {
                    var scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
                    // 缤纷集手机
                    // if(scrollTop >= 126) {
                    //     if(this.isStartBinfenjiAnimation) {
                    //         this.isStartBinfenjiAnimation = false;
                    //     }
                    // }
                    // 用户数据及滚动条
                    if(scrollTop >= 486) {
                        var pageData = {...this.pageData};
                        if(this.isStartUserAnimation) {
                            // 清零后再赋值
                            this.pageData.day_users = 0;
                            this.pageData.total_users = 0;
                            setTimeout(() => {
                                this.pageData = pageData;
                            }, 10)
                            this.userStatistics = ['100%', '50%', '30%'];
                            // 关闭 只执行一次动画
                            this.isStartUserAnimation = false;
                        }
                    }
                    // 理事会成员
                    if(scrollTop >= 1839) {
                        var pageData = {...this.pageData};
                        if(this.councilAnimation) {
                            // 清零后再赋值
                            this.pageData.council_user = 0;
                            setTimeout(() => {
                                this.pageData.council_user = pageData.council_user;
                            }, 100)
                            // 关闭 只执行一次动画
                            this.councilAnimation = false;
                        }
                    }
                    // 锁仓UTD
                    if(scrollTop >= 2109) {
                        var pageData = {...this.pageData};
                        if(this.lockUtdAnimation) {
                            // 清零后再赋值
                            this.pageData.locked_nums = 0;
                            setTimeout(() => {
                                this.pageData.locked_nums = pageData.locked_nums;
                            }, 100)
                            // 关闭 只执行一次动画
                            this.lockUtdAnimation = false;
                        }
                    }
                }
            },
            handleClickCooperation: function(index) {
                this.cooperationNumber = index;
            },
            handleMenu: function() {
                this.isShowMenu = !this.isShowMenu;
            },
            handleBifenji: function(index) {
                if(index == 1) {
                    if(this.binfenjiClickRight == 0) {
                        return
                    }
                    document.getElementById("bifenji-body-box").scrollLeft = document.getElementById("bifenji-body-box").scrollLeft - 189;
                    this.binfenjiClickRight -= 1;
                } else{
                    if(this.binfenjiClickRight == (this.binfenji.length - 1)) {
                        return
                    }
                    document.getElementById("bifenji-body-box").scrollLeft = document.getElementById("bifenji-body-box").scrollLeft + 189;
                    this.binfenjiClickRight += 1;
                }
            },
            handleNewNotice: function() {
                this.request({
                    url: 'api/new-notice',
                    method: 'GET',
                    data: {

                    },
                    success: (response) => {
                        this.newNotice = response;
                    },
                    error: (response) => {
                    },
                    complete: () => {

                    }
                });
            },
            handleNotice: function(id) {
                this.$router.push({
                    path: '/noticeDetail',
                    query: {
                        id: id
                    }
                });
            },
            handleMore: function () {
                this.$router.push({
                    path: '/notice',
                    query: {}
                });
            },
            handleLoad: function () {
                this.request({
                    url: 'api/page',
                    method: 'GET',
                    data: {

                    },
                    success: (response) => {
                        this.pageData = response;
                    },
                    error: (response) => {
                    },
                    complete: () => {

                    }
                });
            }
        }
    }
</script>

import reqwest from 'reqwest';
import {Toast, Dialog} from 'vant';
import application from './application';

export default {
    data() {
        return {
            host: application.host,
            imageHost: application.imageHost
        }
    },
    components: {
        Toast,
        Dialog
    },
    created() {

    },
    // 监听,当路由发生变化的时候执行
    watch:{
        $route(to,from){
            window.scrollTo(0,0)
        }
    },
    methods: {
        request(config) {
            const toast = Toast.loading({
                mask: true,
                duration: 0,
                message: '加载中...'
            });

            config.method = config.method ? config.method : 'POST'
            // config.data.timestamp = Math.round(new Date().getTime() / 1000);

            if (!config.url.startsWith('http')) {
                config.url = this.host + config.url;
            }

            reqwest({
                url: config.url,
                type: 'json',
                method: config.method,
                crossOrigin: true,
                headers: {
                    // 'Content-Type': 'application/json',
                    'Accept': 'application/vnd.website.v1+json',
                    "Authorization": this.$storage.getToken()
                },
                // data: JSON.stringify(config.data),
                data: config.data,
                success: (response) => {
                    config.success(response);
                },
                error: (response) => {
                    if (response.status == 488) {
                        // 需要客户端反馈给客户
                        let message = JSON.parse(response.response).message;

                        this.$toast.center(message);
                    } else if (response.status == 401) {
                        // token过期 换区新token
                        this.handleRefreshToken();
                    } else {
                        // this.$toasted.show('网络出现问题，请稍后再尝试！', {
                        //     theme: "toasted-primary",
                        //     position: "top-right",
                        //     duration : 3000
                        // });
                        this.$toast.center('网络出现问题，请稍后再尝试！');
                    }
                    config.error(response);
                },
                complete: (response) => {
                    toast.clear()
                    config.complete();
                }
            });
        },
        // 定义全局刷新token方法
        handleRefreshToken() {
            let d = new Date();
            let times = d.getTime();
            // token已过期 需重新登录
            if (times >= Number(this.$storage.getTimeStamp()) - 3000) {
                this.$toast.center('登录信息失效，请重新登录！');
                this.$router.push("/login")
            }
            // token失效但还在有效期，发送请求更换新token
            else {
                this.request({
                    url: 'api/refresh',
                    method: 'POST',
                    data: {},
                    success: (response) => {
                        // 存储新access_token
                        let access_token = response.token_type + ' ' + response.access_token;
                        this.$storage.setToken(access_token);
                        // 查讯用户信息
                        this.handleUserInfo();
                    },
                    error: (response) => {
                        this.$toast.center('登录信息失效，请重新登录！');
                        this.$router.push("/login")
                    },
                    complete: (response) => {
                        Toast.clear();
                    }
                });
            }
        },
        // 请求用户信息
        handleUserInfo() {
            reqwest({
                url: this.host + 'api/user',
                type: 'json',
                method: 'GET',
                crossOrigin: true,
                headers: {
                    // 'Content-Type': 'application/json',
                    'Accept': 'application/vnd.website.v1+json',
                    "Authorization": this.$storage.getToken()
                },
                data: {},
                success: (response) => {
                    // 是否查到用户信息
                    Dialog.confirm({
                        title: '温馨提示',
                        message: '登录信息已重新获取，是否立即更新'
                    }).then(() => {
                        // on confirm
                        this.$router.go(0)
                    }).catch(() => {
                        // on cancel
                    });
                },
                error: (response) => {
                    this.$toast.center('登录信息失效，请重新登录！');
                    sessionStorage.clear();
                    localStorage.clear();

                    let timer = setTimeout(()=> {
                        this.$router.push("/login");
                        clearTimeout(timer)
                    }, 2200)
                },
                complete: (response) => {
                    Toast.clear();
                }
            })
        },
        // 返回上一页
        handleBack: function () {
            this.$router.back(-1);
        },
        // 验证手机
        handleChackPnone: function (phone) {
            var myreg = /^[1][3,4,5,6,7,8,9][0-9]{9}$/;
            if (!myreg.test(phone)) {
                return false;
            } else {
                return true;
            }
        },
        //处理软键盘导致弹框里的按钮响应区域错位
        handleInputBlurBack: function () {
            setTimeout(function () {
                var scrollHeight = document.documentElement.scrollTop || document.body.scrollTop || 0;
                window.scrollTo(0, Math.max(scrollHeight - 1, 0));
            }, 100);
        },
    }
}

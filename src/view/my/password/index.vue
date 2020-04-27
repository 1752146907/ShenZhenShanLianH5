<template>
    <div class="login">
        <navBar title="修改密码"></navBar>
        <div class="from">
            <div class="from-item">
                <div class="from-item-title">旧密码</div>
                <div class="from-item-code">
                    <div class="left">
                        <input type="password" @input="handleGetStatus" v-model="old_password" placeholder="请输入密码" />
                    </div>
                </div>
            </div>
            <!--<p class="from-tip">密码必须是8-16位数字加大小写字母。</p>-->
            <div class="from-item">
                <div class="from-item-title">新密码</div>
                <div class="from-item-code">
                    <div class="left">
                        <input type="password" @input="handleGetStatus" v-model="new_password" placeholder="请输入新密码" />
                    </div>
                </div>
            </div>
            <div v-if="!isActivw" class="from-submit">确认修改</div>
            <div v-else class="from-submit-active" @click="handleSubmit">确认修改</div>
        </div>
    </div>
</template>

<style src="./index.css" scoped></style>

<script>
    import { DropdownMenu, DropdownItem, Toast } from 'vant';
    import mixins from '../../../common/mixin';
    import navBar from '../../../component/navBar';

    export default {
        components: {
            DropdownMenu,
            DropdownItem,
            Toast,
            navBar
        },
        mixins: [mixins],
        data: () => ({
            old_password: '',
            new_password: '',
            isActivw: false
        }),
        created() {
        },
        // 设置路由钩子，存储页面来源
        beforeRouteEnter(to, from, next) {
            next(vm=>{          //  这里的vm指的就是vue实例，可以用来当做this使用
                sessionStorage.setItem('url_from', from.path);
            })
        },
        methods: {
            handleGetStatus: function (value) {
                if(this.old_password.length > 0 & this.new_password.length > 0) {
                    this.isActivw = true;
                } else{
                    this.isActivw = false;
                }
            },
            handleSubmit: function () {
                Toast.loading({
                    mask: true,
                    message: '修改中...'
                });
                this.request({
                    url: 'api/password',
                    method: 'PATCH',
                    data: {
                        old_password: this.old_password,
                        new_password: this.new_password
                    },
                    success: (response) => {
                        Toast.success('修改成功');

                        this.handleBack();
                    },
                    error: (response) => {
                    },
                    complete: () => {
                        Toast.clear();
                    }
                });
            }
        }
    }
</script>

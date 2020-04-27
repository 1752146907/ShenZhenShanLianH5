<template>
    <div class="addressAdd">
        <navBar :title="title"></navBar>
        <div>
            <div class="address-info name">
                <div class="info-left">收货人</div>
                <div class="info-right">
                    <input type="text" @focus="handleInputBlurBack" v-model="address.name" placeholder="请填写收人姓名">
                </div>
            </div>
            <div class="address-info phone">
                <div class="info-left">联系电话</div>
                <div class="info-right">
                    <input type="text" @focus="handleInputBlurBack" maxlength="11" v-model="address.phone" placeholder="请填写联系人手机号码">
                </div>
            </div>
            <div class="address-info area" @click="showPopup">
                <div class="info-left">省市区</div>
                <div class="info-right">
                    <input type="text" v-model="area" placeholder="请选择省市区" readonly="readonly">
                </div>
                <i class="van-icon van-icon-arrow"
                   style="color: rgba(51, 51, 51, 0.5); font-size: 18px;"><!----></i>
            </div>
            <div class="address-info detail">
                <div class="info-left">详细地址</div>
                <div><textarea rows="2" @focus="handleInputBlurBack" cols="28" v-model="address.detail" placeholder="街道、楼牌号等 "/></div>
            </div>
<!--            <div class="address-info default">-->
<!--                <div class="info-left">设为默认地址</div>-->
<!--                <div class="info-right"></div>-->
<!--                <van-switch-->
<!--                        v-model="is_default"-->
<!--                        active-color="#FE0000"-->
<!--                        inactive-color="#F5F5F5"-->
<!--                        size="18px"-->
<!--                />-->
<!--            </div>-->
        </div>
        <van-popup v-model="show"
                   round
                   position="bottom">
            <van-area :area-list="areaList"
                      :visible-item-count="6"
                      @cancel="showPopup"
                      @confirm="chooseArea"/>
        </van-popup>
        <div class="save-btn" @click="handleSaveAddress">保存</div>
    </div>
</template>
<style src="./addressAdd.css" scoped></style>
<script>
    import mixins from '../../../../common/mixin';
    import areaList from '../../../../common/myarea';
    import navBar from '../../../../component/navBar';
    import {Toast} from 'vant';

    export default {
        components: {
            navBar,
            Toast
        },
        mixins: [mixins],
        data: () => ({
            areaList,
            show: false,
            address: {},
            area: '',          //所选省市区
            province: '',      //省
            city: '',          //市
            region: '',        //区
            title: '新增地址',
            is_default: false, //是否默认
        }),
        // 设置路由钩子，存储页面来源
        beforeRouteEnter(to, from, next) {
            next(vm => {          //  这里的vm指的就是vue实例，可以用来当做this使用
                sessionStorage.setItem('url_from', from.path);
            })
        },
        created() {
        },
        mounted() {
            //是否为编辑地址
            this.title = this.$route.query.title ? this.$route.query.title : this.title;
            if (this.$route.query.address) {
                let addr = this.$route.query.address;
                this.address = addr;
                this.area = addr.region.province + addr.region.city + addr.region.region;
                this.province = addr.region.province;
                this.city = addr.region.city;
                this.region = addr.region.region;
                this.is_default = addr.is_default;
            }
            this.handleAddressListLength();
        },
        methods: {
            showPopup: function () {
                this.show = !this.show;
            },
            chooseArea: function (val) {
                this.area = val[0].name + val[1].name + val[2].name;
                this.province = val[0].name;
                this.city = val[1].name;
                this.region = val[2].name;
                this.showPopup();
            },
            handleAddressListLength(){
                this.request({
                    url: 'api/store/address',
                    method: 'GET',
                    data: { },
                    success: (response) => {
                        //新增的第一个地址为默认地址
                        if (response.list.length == 0) {
                            this.is_default = true;
                        };
                    },
                    error: (response) => {

                    },
                    complete: (response) => {
                    }
                });
            },
            //保存地址
            handleSaveAddress: function () {
                if (this.address.name < 2) {
                   Toast('收件人名称过短，建议至少两位数以上');
                   return
                }
                if (!this.address.phone) {
                    Toast('手机号码不能为空');
                    return
                }
                if (!this.handleChackPnone(this.address.phone.replace(/[ ]/g, ""))) {
                    Toast('请输入正确的手机格式');
                    return;
                }
                if (JSON.stringify(this.address.detail).length < 10) {
                    Toast('详细地址过短，建议至少十位数以上');
                    return
                }

                this.request({
                    url: 'api/store/address',
                    method: 'POST',
                    data: {
                        "id": this.address.id ? this.address.id : null,
                        "name": this.address.name,
                        "phone": this.address.phone,
                        "province": this.province,
                        "city": this.city,
                        "region": this.region,
                        "detail": this.address.detail,
                        "is_default": this.is_default ? 1 : 0
                    },
                    success: (response) => {
                        this.$toast.center('保存成功');
                        this.handleBack();
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


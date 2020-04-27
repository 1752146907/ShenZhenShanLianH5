<template>
   <div class="address">
      <div class="address-head">
         <navBar v-if="!isDelete" title="地址管理"></navBar>
         <div v-else class="bar">
            <div class="bar-box">
               <van-icon class="bar-back" @click="handleIsDelete" name="arrow-left" size="20" />
               删除地址
            </div>
         </div>
         <div class="delete" v-if="!isDelete && addressList.length > 0" @click="isDelete = true">删除</div>
      </div>
      <div class="address-list">
         <div v-if="addressList.length == 0" class="no-data" style="padding-top: 80px;position: fixed;top: 44px;width: 100%">
            <img src="./image/error.png" class="no-data-image-icon" alt="">
            <p class="no-data-text">暂无记录</p>
         </div>
         <div class="address-list-item" v-for="(item,index) in addressList">
            <div v-if="isDelete" class="checkBox" @click="handleClickAddress(item)">
               <div class="checkBox-unchecked" v-if="deleteList.indexOf(item.id) == -1"></div>
               <div class="checkBox-checked" v-if="deleteList.indexOf(item.id) != -1">
                  <i class="van-icon van-icon-success" style="color: rgb(51, 51, 51); font-size: 12px;"><!----></i>
               </div>
            </div>
            <div class="list-item">
               <div class="item-name-phone" @click="handleClickAddress(item)">
                  <div class="item-name">{{item.name}}</div>
                  <div class="item-phone">{{item.phone}}</div>
                  <div class="item-default" v-if="item.id == transferRecord.default_id">默认</div>
               </div>
               <div class="item-address-edit">
                  <div class="item-address" @click="handleClickAddress(item)">
                     {{item.region.province + item.region.city + item.region.region + " " + item.detail}}
                  </div>
                  <div class="edit-icon" v-if="!isDelete" @click="handleEditAddress(item)">
                     <img src="./image/edit_icon.png" alt="">
                  </div>
               </div>
            </div>
         </div>
         <div style="width: 100px;height: 49px"></div>
      </div>
      <div class="address-btn">
         <div v-if="isDelete && deleteList.length > 0" class="delete-btn" @click="handleDeleteAddress">完成</div>
         <div v-else-if="isDelete && deleteList.length == 0" class="delete-btn" @click="isDelete = false;">取消</div>
         <div v-else class="add-btn" @click="handleAddAddress">新增地址</div>
      </div>
   </div>
</template>
<style src="./index.css" scoped></style>
<script>
    import { Toast, Dialog, Tag, Icon } from 'vant';
    import mixins from '../../../../common/mixin';
    import navBar from  '../../../../component/navBar'
    export default {
        components: {
           Toast,
           Dialog,
           navBar,
           Tag,
           Icon
        },
        mixins: [mixins],

        data: () => ({
           isDelete: false,
           deleteList: [],
           addressList: [],
           transferRecord: {},     // 请求回来的数据
           fromOrder: false,       // 是否来自订单页面
         }),
        // 设置路由钩子，存储页面来源
        beforeRouteEnter(to, from, next) {
            next(vm=>{          //  这里的vm指的就是vue实例，可以用来当做this使用
                sessionStorage.setItem('url_from', from.path);
            })
        },
        created () {
            this.handleGetUserAddress();
        },
        mounted() {
           this.fromOrder = this.$route.query.fromOrder;
        },
        methods: {
           //刪除地址
           handleDeleteAddress: function() {
              this.request({
                 url: "api/store/address",
                 method: "PUT",
                 data: {id:this.deleteList},
                 success: (response) => {
                    this.$toast.center("删除成功");
                    this.deleteList = [];
                    this.handleGetUserAddress();
                    this.isDelete = false;
                 },
                 error: (response) => {},
                 complete: (response) => {}
              })
           },
           //新增地址
           handleAddAddress: function() {
              this.$router.push({
                 path: '/plus/shopx/addressAdd',
                 query: {

                 }
              });
           },
           //编辑地址
           handleEditAddress: function(option) {
              if (this.transferRecord.default_id == option.id){
                 option.is_default = true;
              }
              this.$router.push({
                 path: '/plus/shopx/addressAdd',
                 query: {
                    title: '编辑地址',
                    address: option,
                 }
              });
           },
           // 点击地址列表
           handleClickAddress: function(option) {
              // 是否删除地址
              if(this.isDelete){
                 let i = this.deleteList.indexOf(option.id);
                 if(i === -1){
                    this.deleteList.push(option.id);
                 }else {
                    this.deleteList.splice(i,1);
                 }
              }
              // 是否从订单进来
              else if(this.fromOrder){
                 //选中的地址修改为默认地址
                 this.request({
                    url: 'api/store/address',
                    method: 'POST',
                    data: {
                       "id": option.id,
                       "is_default": 1
                    },
                    success: (response) => {
                       let orderInfo = { 
                          id: JSON.parse(this.$route.query.order).id,
                          sku_id: JSON.parse(this.$route.query.order).sku_id,
                          in_delivery_rule: JSON.parse(this.$route.query.order).in_delivery_rule,
                          order_pay_price: JSON.parse(this.$route.query.order).order_pay_price,
                          express_price: JSON.parse(this.$route.query.order).express_price,
                          order_total_price: JSON.parse(this.$route.query.order).order_total_price,
                          order_total_quantity: JSON.parse(this.$route.query.order).order_total_quantity,
                          goods_list: [{
                             image: JSON.parse(this.$route.query.order).goods_list[0] ? JSON.parse(this.$route.query.order).goods_list[0].image : '',
                             name: JSON.parse(this.$route.query.order).goods_list[0].name
                          }]
                       };
                       this.$router.replace({
                          path: "/plus/shopx/order/order",
                          query: {
                             fromOrder: true,
                             order: JSON.stringify(orderInfo)
                          }
                       })
                    },
                    error: (response) => {

                    },
                    complete: (response) => {
                    }
                 });

              }
           },
           // 返回地址首页
           handleIsDelete: function() {
              this.isDelete = false;
              this.deleteList = []
           },
            // 初始化用户地址信息
            handleGetUserAddress: function() {
                this.request({
                    url: 'api/store/address',
                    method: 'GET',
                    data: { },
                    success: (response) => {
                       this.transferRecord = response;
                       this.addressList = response.list;
                    },
                    error: (response) => {

                    },
                    complete: (response) => {
                    }
                });
            }
        }
    }
</script>


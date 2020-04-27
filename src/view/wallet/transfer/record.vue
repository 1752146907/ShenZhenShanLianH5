<template>
    <div>
        <navBar title="转账记录" class="transferBottom"/>
        <div class="record" v-for="item in minutes" @click="payment(item.id)">
            <div class="recordText">
                <p>{{item.type == 9?item.get_user.mobile:item.set_user.mobile}}（*{{item.type == 9?item.get_user.name.substring(1,10):item.set_user.name.substring(1,10)}}）</p>
                <p>{{item.type == 9? '-' : '+' }}<countTo :startVal='0' :decimals="2" :endVal='Number(item.amount)' :duration='1'></countTo></p>
            </div>
            <div class="recordContent">
                <p>{{item.created_at}}</p>
                <p>{{item.remark}}</p>
            </div>
        </div>

    </div>
</template>
<style src="./record.css" scoped></style>
<script>
    import navBar from '../../../component/navBar';
    import mixins from '../../../common/mixin';
    import countTo from 'vue-count-to';
    export default {
        components: {
            navBar,
            countTo
        },
        mixins: [mixins],
        data: () => ({
            minutes:[]  //列表数据
        }),
        created() {

        },
        mounted(){
           this.recordList();
        },
        methods:{
            recordList:function () {
                this.request({
                    url: 'api/transfer-list',
                    method: 'GET',
                    data: {

                    },
                    success: (response) => {
                        this.minutes = response
                    },
                    error: (response) => {

                    },
                    complete: (response) => {

                    }
                });
            },
            payment:function (e) {
                this.$router.push({
                    path:"/wallet/detailed",
                    query: {
                        id:e
                    }
                })
            }
        }
    }
</script>

<style scoped>

</style>
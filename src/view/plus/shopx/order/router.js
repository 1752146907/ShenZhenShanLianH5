import Index from './index';
import Success from "./success";
import OrderList from  "./orderList"
import Detailed from  "./detailed"
//import Service from "./service"  售后详情
import Seach  from  "./seach"
import express from "./express"
export default [{
    path: '/plus/shopx/order/order',
    component: Index,
    meta: {
        requireAuth: true,            // 添加该字段，表示进入这个路由是需要登录的
    }
},
    {
        path: '/plus/shopx/order/success',
        component: Success,
        meta: {
            requireAuth: true,            // 添加该字段，表示进入这个路由是需要登录的
        }
    },
    {
        path: '/plus/shopx/order/orderList',
        component: OrderList,
        meta: {
            requireAuth: true,            // 添加该字段，表示进入这个路由是需要登录的
        }
    },
    {
        path: '/plus/shopx/order/detailed',
        component: Detailed,
        meta: {
            requireAuth: true,            // 添加该字段，表示进入这个路由是需要登录的
        }
    },
    /*{
        path: '/service',
        component: Service,
        meta: {
            requireAuth: true,            // 添加该字段，表示进入这个路由是需要登录的
        }
    },*/
    {
        path:"/plus/shopx/order/seach",
        component:Seach,
        meta:{
            requireAuth: true,            // 添加该字段，表示进入这个路由是需要登录的
        }
    },
    {
        path:"/plus/shopx/order/express",
        component:express,
        meta:{
            requireAuth: true,            // 添加该字段，表示进入这个路由是需要登录的
        }
    }

];

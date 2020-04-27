import Index from './index';
import AddressAdd from "./addressAdd";
export default [{
    path: '/plus/shopx/address',
    component: Index,
    meta: {
        requireAuth: true,            // 添加该字段，表示进入这个路由是需要登录的
    }
}, {
    path: '/plus/shopx/addressAdd',
    component: AddressAdd,
    meta: {
        requireAuth: true,            // 添加该字段，表示进入这个路由是需要登录的
    }
}, ];

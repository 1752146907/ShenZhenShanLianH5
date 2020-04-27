
import Index from './index';
import Edit from './edit';
import Detail from './detail';

export default [{
    path: '/walletAddresIndex',
    component: Index,
    meta: {
        requireAuth: true,            // 添加该字段，表示进入这个路由是需要登录的
    }
}, {
    path: '/walletAddresEdit',
    component: Edit,
    meta: {
        requireAuth: true,            // 添加该字段，表示进入这个路由是需要登录的
    }
}, {
    path: '/walletAddresDetail',
    component: Detail,
    meta: {
        requireAuth: true,            // 添加该字段，表示进入这个路由是需要登录的
    }
}];

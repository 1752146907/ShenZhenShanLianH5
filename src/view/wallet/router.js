
import Index from './index';
import Type from './type';
import History from './history';
import WalletDetail from './walletDetail';
import warehouse from './warehouse';

export default [{
    path: '/wallet',
    component: Index,
    meta: {
        requireAuth: true,            // 添加该字段，表示进入这个路由是需要登录的
    }
}, {
    path: '/walletType',
    component: Type,
    meta: {
        requireAuth: true,            // 添加该字段，表示进入这个路由是需要登录的
    }
}, {
    path: '/walletDetail',
    component: WalletDetail,
    meta: {
        requireAuth: true,            // 添加该字段，表示进入这个路由是需要登录的
    }
}, {
    path: '/walletHistory',
    component: History,
    meta: {
        requireAuth: true,            // 添加该字段，表示进入这个路由是需要登录的
    }

},{
    path: '/walletWarehouse',
    component: warehouse,
    meta: {
        requireAuth: true,            // 添加该字段，表示进入这个路由是需要登录的
    }
}];

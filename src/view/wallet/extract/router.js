
import Index from './index';
import History from './history';
import Detail from './detail';

export default [{
    path: '/walletExtract',
    component: Index,
    meta: {
        requireAuth: true,            // 添加该字段，表示进入这个路由是需要登录的
    }
}, {
    path: '/walletExtractHistory',
    component: History,
    meta: {
        requireAuth: true,            // 添加该字段，表示进入这个路由是需要登录的
    }
}, {
    path: '/walletExtractDetail',
    component: Detail,
    meta: {
        requireAuth: true,            // 添加该字段，表示进入这个路由是需要登录的
    }
}];

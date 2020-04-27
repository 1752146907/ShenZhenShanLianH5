import Index from './index';
import Code from './code';
import setPassword from './setPassword';

export default [{
    path: '/login',
    component: Index,
    meta: {
        requireAuth: false,            // 添加该字段，表示进入这个路由是需要登录的
    }
}, {
    path: '/login/code',
    component: Code,
    meta: {
        requireAuth: false,            // 添加该字段，表示进入这个路由是需要登录的
    }
}, {
    path: '/setPassword',
    component: setPassword,
    meta: {
        requireAuth: false,            // 添加该字段，表示进入这个路由是需要登录的
    }
}];

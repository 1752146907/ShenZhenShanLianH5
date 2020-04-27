
import Index from './index';
import checkPhone from './checkPhone';
import setPassword from './setPassword';

export default [{
    path: '/loginAccount',
    component: Index,
    meta: {
        requireAuth: false,            // 添加该字段，表示进入这个路由是需要登录的
    }
}, {
    path: '/checkPhone',
    component: checkPhone,
    meta: {
        requireAuth: false,            // 添加该字段，表示进入这个路由是需要登录的
    }
}, {
    path: '/forgetPassword',
    component: setPassword,
    meta: {
        requireAuth: false,            // 添加该字段，表示进入这个路由是需要登录的
    }
}];
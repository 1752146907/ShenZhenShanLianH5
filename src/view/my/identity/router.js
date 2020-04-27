import Index from './index';
import Error from './error';
import Success from './success';
export default [{
	path: '/identity',
	component: Index,
    meta: {
        requireAuth: true,            // 添加该字段，表示进入这个路由是需要登录的
    }
}, {
    path: '/identityError',
    component: Error,
    meta: {
        requireAuth: true,            // 添加该字段，表示进入这个路由是需要登录的
    }
}, {
    path: '/identitySuccess',
    component: Success,
    meta: {
        requireAuth: true,            // 添加该字段，表示进入这个路由是需要登录的
    }
}];

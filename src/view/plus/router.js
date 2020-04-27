import Index from './index';
export default [{
    path: '/plus',
    component: Index,
    meta: {
        requireAuth: true,            // 添加该字段，表示进入这个路由是需要登录的
    }
} ];

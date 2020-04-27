import Index from './index';
import Search from "./search";
export default [{
    path: '/task/invite/index',
    component: Index,
    meta: {
        requireAuth: true,            // 添加该字段，表示进入这个路由是需要登录的
    },

},
    {
        path: '/task/invite/search',
        component: Search,
        meta: {
            requireAuth: true,            // 添加该字段，表示进入这个路由是需要登录的
        }
    }];

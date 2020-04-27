import Index from './index';
import Record from './myRecord';
import recordDetail from './myRecordDetail';
export default [{
	path: '/integral',
	component: Index,
    meta: {
        requireAuth: true,            // 添加该字段，表示进入这个路由是需要登录的
    }
}, {
    path: '/myRecord',
    component: Record,
    meta: {
        requireAuth: true,            // 添加该字段，表示进入这个路由是需要登录的
    }
}, {
    path: '/myRecordDetail',
    component: recordDetail,
    meta: {
        requireAuth: true,            // 添加该字段，表示进入这个路由是需要登录的
    }
}];

import Index from './index';
import Message from "./message";
import Record from "./record";
import Detailed from  "./detailed"

export default [{
    path: '/wallet/transfer',
    component: Index,
    meta: {
        requireAuth: true,            // 添加该字段，表示进入这个路由是需要登录的
    }
},
    {
        path: '/wallet/message',
        component: Message,
        meta: {
            requireAuth: true,            // 添加该字段，表示进入这个路由是需要登录的
        }
    },
    {
        path: '/wallet/record',
        component: Record,
        meta: {
            requireAuth: true,            // 添加该字段，表示进入这个路由是需要登录的
        }
    },
    {
        path: '/wallet/detailed',
        component: Detailed,
        meta: {
            requireAuth: true,            // 添加该字段，表示进入这个路由是需要登录的
        }
    }
];

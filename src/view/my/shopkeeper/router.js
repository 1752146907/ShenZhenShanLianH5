import Index from './index';
import Loading from './loading';
import Family from  './family';
import Creation from './creation';
import  Buying from './buying';

export default [{
	path: '/shopkeeperIndex',
	component: Index,
    meta: {
        requireAuth: true,            // 添加该字段，表示进入这个路由是需要登录的
    }
    ,
    children:[
        {
            path: '/family',
            component: Family,
            meta: {
                requireAuth: true,            // 添加该字段，表示进入这个路由是需要登录的

            },

        },
        {
            path: '/creation',
            component: Creation,
            meta: {
                requireAuth: true,            // 添加该字段，表示进入这个路由是需要登录的

            }
        },

    ],redirect: '/creation'
},
    {
    path: '/shopkeeperLoading',
    component: Loading,
    meta: {
        requireAuth: true,            // 添加该字段，表示进入这个路由是需要登录的
    },

},
    {
        path: '/buying',
        component: Buying,
        meta: {
            requireAuth: true,            // 添加该字段，表示进入这个路由是需要登录的
        }
    }
];
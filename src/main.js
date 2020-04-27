import Vue from 'vue';
import Router from 'vue-router';
import Vuex from 'vuex';

import Vant from 'vant';  // 引入有赞UI
import 'vant/lib/index.css';

import 'vue2-toast/lib/toast.css';                          // toast提示
import toast from 'vue2-toast';                             // toast提示
import VueClipboard from 'vue-clipboard2'; 				 	// 文件拷贝插件
import axios from "axios";                                  // axios请求

import Main from './view/main.vue';

import './font/iconfont.css';
import './font/DINM.css';
import './css/style.css';

import storage from './common/storage.js';
import notification from './common/notification';

import VueParticles from 'vue-particles';		// 粒子动画
Vue.use(VueParticles);							// 粒子动画

Vue.use(toast);									// toast提示

Vue.prototype.axios = axios;		    	    // 另一个请求,仅在极验接口使用
// 导入极验
require('@/common/gt.js');
Vue.prototype.$initGeet=initGeetest;

Vue.prototype.$storage = storage;				// 本地存储
Vue.prototype.$notification = notification;     // 事件通知

Vue.config.productionTip = false;

Vue.use(Vant);          // 引入有赞UI
Vue.use(VueClipboard);  // 文件拷贝插件
Vue.use(Router);        // 引入路由

var routes = [];
var routerContexts = require.context('./view/', true, /^.*\/router\.js$/);
routerContexts.keys().map(fileName => {
    routes = routes.concat(routerContexts(fileName).default);
});
var router = new Router({
	mode: 'history',
	base: process.env.BASE_URL,
	routes: routes
});

var homePath = '/home';
router.beforeEach((to, from, next) => {
	if (to.path == '/') {            //默认跳到首页
		next({
			path: homePath
		});
	}

	/*if(to.meta.requireAuth) {
		if (storage.getToken()) {            //有token,或者token未过期，跳过登录
			next();
		} else {
			next('/login?collBack=' + encodeURIComponent(to.fullPath));      //没有登录过，或者token 过期，跳转到登录页(collBack为登录成功回跳地址)
		}
	} else {                           //不需要跳转，直接往下走
		next();
	}*/

	next();
});

Vue.use(Vuex);
var modules = {};
var storeContexts = require.context('./view/', true, /^.*\/store\.js$/);
storeContexts.keys().map(fileName => {
	for (var name in storeContexts(fileName).default.mutations) {
		modules[name] = storeContexts(fileName).default;
	}
});
var store = new Vuex.Store({
	modules: modules
});

new Vue({
	router,
	store,
	render: h => h(Main) 
}).$mount('#app');

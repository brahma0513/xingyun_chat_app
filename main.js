import App from './App'

import Vue from 'vue'
// 引入 多语言包
import VueI18n from 'vue-i18n'
import language from '@/locale/index'
const i18nConfig = {
  locale: uni.getLocale(),
  fallbackLocale: 'zh-Hans', // 当语言不存在时；使用默认的语言
  messages: language // 多语言资源文件
};
Vue.use(VueI18n); // use一定要放在new VueI18n之前
const i18n = new VueI18n(i18nConfig);

Vue.config.productionTip = false
App.mpType = 'app'
import uView from '@/uni_modules/uview-ui'
Vue.use(uView)

// 注册缓存器  
import MinCache from '@/utils/cache.js'
Vue.use(MinCache)

import api from "./utils/api.js"

import store from '@/store';

import * as Common from '@/utils/common.js'
Vue.prototype.$common = Common;


import * as Config from '@/utils/config.js'
Vue.prototype.$config = Config;

import * as Db from './utils/db.js'
Vue.prototype.$db = Db;

// 引入uView提供的对vuex的简写法文件
let vuexStore = require('@/store/$u.mixin.js');
Vue.mixin(vuexStore);

// 全局跳路由
Vue.prototype.$gor = function(url){
	uni.navigateTo({
	    url: url
	});
}

const app = new Vue({
	i18n,
    store,
    ...App
})

app.$mount()

Vue.prototype.$api = api

Vue.prototype.$onLaunched = new Promise(resolve => {
    Vue.prototype.$isResolve = resolve
})

// #ifdef VUE3
import { createSSRApp } from 'vue'
import { createI18n } from 'vue-i18n'
const i18n = createI18n(i18nConfig)
export function createApp() {
  const app = createSSRApp(App)
  app.use(i18n)
  return {
    app
  }
}
// #endif
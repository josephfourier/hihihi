import 'babel-polyfill'

import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

import VueI18n from 'vue-i18n'

// import './mock'
import '@/utils/message'

import './router-interceptor'
import '@/styles/index.scss'

import filters from './filters'

Vue.use(VueI18n)
Vue.use(ElementUI)

Vue.config.productionTip = false

Vue.prototype.$empty = obj => !obj ? true : Object.keys(obj).length === 0
Vue.prototype.$hasPermission = permission => store.getters.permissions.indexOf(permission) !== -1

Object.keys(filters).forEach(key => Vue.filter(key, filters[key]))

const i18n = new VueI18n({
  locale: 'zh-CN',
  messages: {
    'zh-CN': require('@/local/lang/zh-CN').default
  }
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  i18n,
  router,
  store,
  components: { App },
  template: '<App/>'
})

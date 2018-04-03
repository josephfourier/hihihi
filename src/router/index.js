import Vue from 'vue'
import Router from 'vue-router'
import { NotAccessed } from '@/views/index'

Vue.use(Router)

const _ = require('./' + process.env.NODE_ENV)

const routes = [
  {
    path: '',
    redirect: '/home',
    hidden: true,
    component: _('index/Layout'),
    children: [
      {
        path: '/home',
        component: _('index/home/Home')
      }
    ]
  },
  {
    path: '/test',
    name: 'test',
    hidden: true,
    component: _('test/index')
  },
  {
    path: '/401',
    name: '401',
    hidden: true,
    component: NotAccessed
  },
  {
    path: '/500',
    hidden: true,
    component: _('error/500')
  }
]

export default new Router({
  routes
})

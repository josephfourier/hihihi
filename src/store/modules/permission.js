import * as types from '../mutation-types'
import {resolve} from '@/utils'
import {NotFound} from '@/views/index'

import permissionAPI from '@/api/permission'

const state = {
  permissionRoutes: [],
  permissions: [],
  approves: []
}

const mutations = {
  [types.SET_PERMISSIONS] (state, permissions) {
    state.permissions = permissions
  },

  [types.SET_APPROVES] (state, approves) {
    state.approves = approves
  },

  [types.SET_ROUTES] (state, routes) {
    for (let i = 0; i < routes.length; ++i) {
      resolve(routes[i], routes, state.permissionRoutes, state.permissions)
    }
    state.permissionRoutes = state.permissionRoutes
      .concat([
        {
          path: '/404',
          name: '404',
          hidden: true,
          component: NotFound
        },
        {
          path: '*',
          hidden: true,
          redirect: '/404'
        }
      ])

    // 必须在此处动态添加404，否则刷新任何页面会直接进入404
    // 若存在多个children(>1)则跳转到第一个children
    state.permissionRoutes.forEach((item) => {
      if (item.children) {
        if (item.children.length > 1) item.path = item.children[0].path
        else if (item.children.length === 1) item.redirect = 'no'
      }
    })
  }
}

const actions = {
  setRoutes ({commit}, routes) {
    return new Promise(resolve => {
      commit(types.SET_ROUTES, routes)
      resolve()
    })
  },

  setPermissions ({commit}, permissions) {
    return new Promise(resolve => {
      commit(types.SET_PERMISSIONS, permissions)
      resolve()
    })
  },

  setApproves ({commit}) {
    permissionAPI.getApproves().then(response => {
      commit(types.SET_APPROVES, response.data)
    })
  }
}

export default {
  state,
  mutations,
  actions
}

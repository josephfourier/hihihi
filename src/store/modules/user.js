import { getToken, setToken as _setToken } from '@/utils/cookie'
import userAPI from '@/api/user'
import * as types from '../mutation-types'

const state = {
  fullName: '', // 用户名
  token: getToken(),
  accessed: [], // 权限信息
  schoolName: '', // 学校名
  userDetailId: '',
  usertypeId: ''
}

const mutations = {
  [types.SET_USER] (state, { fullName, schoolName, userDetailId, usertypeId }) {
    state.fullName = fullName
    state.schoolName = schoolName
    state.userDetailId = userDetailId
    state.usertypeId = usertypeId
  },

  [types.SET_TOKEN] (state, token) {
    state.token = token
  },

  [types.SET_ACCESSED] (state, accessed) {
    state.accessed = accessed
  },

  [types.SET_SCHOOL] (state, school) {
    state.school = school
  }
}

const actions = {
  getAccessed ({ commit }) {
    return new Promise((resolve, reject) => {
      userAPI.getAccessed().then(response => {
        if (response.code !== 1) {
          reject(response)
        } else {
          commit(types.SET_ACCESSED, response.data)
          resolve(response.data)
        }
      }).catch(error => {
        reject(error)
      })
    })
  },

  setToken ({ commit }, token) {
    commit(types.SET_TOKEN, token)
  },

  setUser ({ commit }, user) {
    commit(types.SET_USER, user)
  },

  logout ({ commit }) {
    return new Promise((resolve, reject) => {
      userAPI.logout().then(response => {
        if (response.code === 1) {
          commit(types.SET_TOKEN, '')
          _setToken('')
          resolve()
        } else {
          reject(new Error('logout error'))
        }
      })
    })
  }
}

export default {
  state,
  mutations,
  actions
}

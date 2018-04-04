import { getToken } from '@/utils/cookie'
import userAPI from '@/api/user'
import * as types from '../mutation-types'

const state = {
  fullName: '', // 用户名
  token: getToken(),
  accessed: [], // 权限信息
  schoolName: '', // 学校名
  userDetailId: ''
}

const mutations = {
  [types.SET_USER] (state, { fullName, schoolName, userDetailId }) {
    state.fullName = fullName
    state.schoolName = schoolName
    state.userDetailId = userDetailId
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
  }
}

export default {
  state,
  mutations,
  actions
}

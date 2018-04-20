import commonAPI from '@/api/common'
import * as types from '../mutation-types'

const state = {
  specialtyList: []
}

const mutations = {
  [types.SET_SPECIALTY_LIST] (state, specialtyList) {
    state.specialtyList = specialtyList
  }
}

const actions = {
  setSpecialtyList ({commit, state}) {
    if (state.specialtyList.length === 0) {
      commonAPI.querySpecialtyList().then(response => {
        if (response.code !== 1) {
          console.warn('query specialtyList way error')
        } else {
          commit(types.SET_SPECIALTY_LIST, response.data)
        }
      })
    }
  }
}

export default {
  state,
  mutations,
  actions
}

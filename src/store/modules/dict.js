import dictAPI from '@/api/dict'
import * as types from '../mutation-types'

const state = {
  grantWay: []
}

const mutations = {
  [types.SET_GRANT_WAY] (state, grantWay) {
    state.grantWay = grantWay
  }
}

const actions = {
  setGrantWay ({commit, state}) {
    if (state.grantWay.length === 0) {
      dictAPI.queryDict('DICT_GRANT_WAY').then(response => {
        if (response.code !== 1) {
          console.warn('query grant way error')
        } else {
          commit(types.SET_GRANT_WAY, response.data)
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

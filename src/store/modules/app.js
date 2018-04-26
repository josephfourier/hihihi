import * as types from '../mutation-types'

const state = {
  isCollapsed: false
}

const mutations = {
  [types.SET_COLLAPSED] (state, collapsed) {
    state.isCollapsed = collapsed
  }
}

const actions = {
  setCollapsed ({commit}, collapsed) {
    commit(types.SET_COLLAPSED, collapsed)
  }
}

export default {
  state,
  mutations,
  actions
}

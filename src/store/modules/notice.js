import ajax from '@/utils/ajax'
import * as types from '../mutation-types'
const state = {
  noticeList: []
}

const mutations = {
  [types.SET_NOTICE_LIST] (state, list) {
    state.noticeList = list
  }
}

const actions = {
  setNoticeList ({ commit }) {
    return new Promise((resolve, reject) => {
      ajax.get('/manage/swmsNotice/swmsNoticeRead').then(response => {
        if (response.code !== 1) {
          reject(response)
        } else {
          commit(types.SET_NOTICE_LIST, response.data)
          resolve(response.data)
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

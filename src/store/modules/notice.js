import ajax from '@/utils/ajax'
import * as types from '../mutation-types'
const state = {
  noticeList: []
}

const mutations = {
  [types.SET_NOTICE_LIST] (state, list) {
    state.noticeList = list
  },
  [types.REMOVE_FROM_LIST] (state, id) {
    state.noticeList.splice(state.noticeList.findIndex(i => i.noticeUid === id), 1)
  }
}

const actions = {
  removeFromNoticeList ({ commit }, id) {
    return new Promise((resolve, reject) => {
      ajax.post('/manage/swmsNotice/swmsNoticeRead/' + id).then(response => {
        if (response.code !== 1) {
          reject(new Error('remove error'))
        } else {
          commit(types.REMOVE_FROM_LIST, id)
          resolve(response)
        }
      })
    })
  },
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

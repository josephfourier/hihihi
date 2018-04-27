import scheduleAPI from '@/api/schedule'
import * as types from '../mutation-types'
const state = {
  todoList: []
}

const mutations = {
  [types.SET_TODO_LIST] (state, todoList) {
    state.todoList = todoList
  },
  [types.REMOVE_FROM_LIST] (state, id) {
    state.todoList.splice(state.todoList.findIndex(i => i.dataUid === id), 1)
  }
}

const actions = {
  removeFromTodoList ({ commit }, id) {
    commit(types.REMOVE_FROM_LIST, id)
  },

  setTodoList ({ commit }, todoList) {
    commit(types.SET_TODO_LIST, todoList)
  },

  setSchedules ({ commit }) {
    return new Promise((resolve, reject) => {
      scheduleAPI.refresh().then(response => {
        if (response.code !== 1) {
          reject(response)
        } else {
          commit(types.SET_TODO_LIST, response.data)
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

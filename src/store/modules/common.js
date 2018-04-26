import commonAPI from '@/api/common'
import * as types from '../mutation-types'

const state = {
  specialtyList: [],
  facultyList: [],
  classList: []
}

const mutations = {
  [types.SET_SPECIALTY_LIST] (state, specialtyList) {
    state.specialtyList = specialtyList
  },
  [types.SET_FACULTY_LIST] (state, facultyList) {
    state.facultyList = facultyList
  },
  [types.SET_CLASS_LIST] (state, classList) {
    state.classList = classList
  }
}

const actions = {
  setSpecialtyList ({commit, state}) {
    if (state.specialtyList.length === 0) {
      commonAPI.querySpecialtyList().then(response => {
        if (response.code !== 1) {
          console.warn('query specialtyList error')
        } else {
          commit(types.SET_SPECIALTY_LIST, response.data)
        }
      })
    }
  },
  setFacultyList ({commit, state}) {
    if (state.facultyList.length === 0) {
      commonAPI.queryFacultyList().then(response => {
        if (response.code !== 1) {
          console.warn('query facultyList error')
        } else {
          commit(types.SET_FACULTY_LIST, response.data)
        }
      })
    }
  },
  setClassList ({commit, state}) {
    if (state.classList.length === 0) {
      commonAPI.queryClassList().then(response => {
        if (response.code !== 1) {
          console.warn('query classList error')
        } else {
          commit(types.SET_CLASS_LIST, response.data)
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

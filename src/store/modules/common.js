import commonAPI from '@/api/common'
import * as types from '../mutation-types'

const state = {
  specialtyList: [],
  facultyList: [],
  classList: [],
  holidayTypeList: [],
  student: ''
}

const mutations = {
  [types.SET_SPECIALTY_LIST] (state, list) {
    state.specialtyList = list
  },
  [types.SET_FACULTY_LIST] (state, list) {
    state.facultyList = list
  },
  [types.SET_CLASS_LIST] (state, list) {
    state.classList = list
  },
  [types.SET_HOLIDAYTYPE_LIST] (state, list) {
    state.holidayTypeList = list
  },
  [types.SET_STUDENT] (state, student) {
    state.student = student
  }
}

const actions = {
  setStudent ({ commit, state }) {
    return new Promise((resolve, reject) => {
      if (!state.student) {
        commonAPI.queryStudent().then(response => {
          if (response.code !== 1) {
            console.warn('query student error')
            reject(new Error('query student error'))
          } else {
            commit(types.SET_STUDENT, response.data)
            resolve()
          }
        })
      } else {
        resolve()
      }
    })
  },
  setSpecialtyList ({commit, state}) {
    return new Promise((resolve, reject) => {
      if (state.specialtyList.length === 0) {
        commonAPI.querySpecialtyList().then(response => {
          if (response.code !== 1) {
            console.warn('query specialtyList error')
            reject(new Error('query specialtyList error'))
          } else {
            commit(types.SET_SPECIALTY_LIST, response.data)
            resolve()
          }
        })
      } else {
        resolve()
      }
    })
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
  },
  setHolidayTypeList ({commit, state}) {
    if (state.holidayTypeList.length === 0) {
      commonAPI.queryHolidayTypeList().then(response => {
        if (response.code !== 1) {
          console.warn('query holidayTypeList error')
        } else {
          commit(types.SET_HOLIDAYTYPE_LIST, response.data)
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

import Vue from 'vue'
import Vuex from 'vuex'

import user from './modules/user'
import permission from './modules/permission'
import schedule from './modules/schedule'
import dict from './modules/dict'
import common from './modules/common'
import notice from './modules/notice'

import getters from './getters'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    user,
    permission,
    schedule,
    dict,
    common,
    notice
  },
  getters
})

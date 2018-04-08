import ajax from '@/utils/ajax'

export default {
  querySettingList (query) {
    return ajax.get('/manage/scholarship-setting')
  },

  queryStudent (code, uid) {
    return ajax.get('/manage/scholarship/student/' + code + '/' + uid)
  }
}

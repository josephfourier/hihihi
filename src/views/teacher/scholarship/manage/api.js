import ajax from '@/utils/ajax'

export default {
  querySettingList (query) {
    return ajax.get('/manage/scholarship-setting')
  },

  queryStudent (code, uid) {
    return ajax.get('/manage/scholarship/student/' + code + '/' + uid)
  },
  // 教师新增一个学生奖学金
  create (id, arg) {
    return ajax.post('/manage/scholarship/teacher/' + id, arg)
  },

  batchRemove (arg) {
    return ajax({
      method: 'delete',
      url: '/manage/scholarship',
      data: arg
    })
  }
}

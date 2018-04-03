import ajax from '@/utils/ajax'

export default {
  // 获取学生设置档案列表
  queryForList () {
    return ajax.get('/manage/stufile-setting')
  },

  create (d) {
    return ajax.post('/manage/stufile-setting', d)
  },

  update (id, d) {
    return ajax.put('/manage/stufile-setting/' + id, d)
  },

  delete (id) {
    return ajax.delete('/manage/stufile-setting/' + id)
  }
}

import ajax from '@/utils/ajax'

export default {

  queryForList () {
    return  ajax.get('/manage/swmsAllowanceSetting')
  },

  create (d) {
    return ajax.post('/manage/swmsAllowanceSetting', d)
  },

  update (d) {
    return ajax.put('/manage/swmsAllowanceSetting',  d)
  },

  delete (id) {
    return ajax.delete('/manage/swmsAllowanceSetting/' + id)
  }
}

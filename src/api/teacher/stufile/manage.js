import ajax from '@/utils/ajax'
import { selfMerge } from '@/utils'

export default {
  // 获取学生档案列表
  queryForList (query) {
    return ajax.get('/manage/stufile', {
      params: query,
      transformResponse: data => {
        const json = JSON.parse(data)
        if (json.code !== 1) return json

        const total = json.data.total
        const code = json.code

        let rows = []

        for (let i = 0; i < json.data.rows.length; ++i) {
          let row = {}
          selfMerge(json.data.rows[i], row)
          rows.push(row)
        }
        return {
          code,
          total,
          rows
        }
      }
    })
  },

  checkExists (id) {
    return ajax.get('/manage/stufile/student/' + id)
  },

  create (arg) {
    return ajax.post('/manage/stufile', arg)
  },

  update (id, arg) {
    return ajax.put('/manage/stufile/' + id, arg)
  },

  queryForObject (id) {
    return ajax.get('/manage/stufile/' + id)
  }
}

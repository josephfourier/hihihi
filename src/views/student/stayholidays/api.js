import ajax from '@/utils/ajax'
import { selfMerge } from '@/utils'

export default {
  queryForList (query) {
    return ajax.get('/manage/student/swmsStayholidays', {
      params: query,
      transformResponse: data => {
        const json = JSON.parse(data)
        if (json.code !== 1) return json

        const code = json.code
        const total = json.data.total
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

  create (arg) {
    return ajax.post('manage/student/swmsStayholiday', arg)
  },
  update (arg) {
    return ajax.put('manage/student/swmsStayholiday', arg)
  },
  delete (stayholidayUids) {
    return ajax.delete('/manage/student/swmsStayholiday/' + stayholidayUids)
  }
}

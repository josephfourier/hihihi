import ajax from '@/utils/ajax'
import { selfMerge } from '@/utils'

export default {
  queryForList (query) {
    return ajax.get('/manage/insurance/student', {
      params: query,
      transformResponse: data => {
        const json = JSON.parse(data)
        if (json.code !== 1) return json

        const total = json.data.total
        let rows = []

        for (let i = 0; i < json.data.rows.length; ++i) {
          let row = {}
          selfMerge(json.data.rows[i], row)
          rows.push(row)
        }
        return {
          total,
          rows
        }
      }
    })
  }
}

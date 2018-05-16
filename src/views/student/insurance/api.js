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
  pay (id) {
    return ajax.get('/manage/swmsXFTPay/insurancePay/' + id)
  },
  assert (arg) {
    return ajax.put('/manage/insurance/' + arg.insuranceUid, arg)
  },

  delete (insuranceId) {
    return ajax.delete('/manage/insurance/' + insuranceId)
  }
}

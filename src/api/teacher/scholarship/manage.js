import ajax from '@/utils/ajax'
import { selfMerge } from '@/utils'

export default {
  queryForList (query) {
    return ajax.get('/manage/scholarship/teacher', {
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

  queryForObject (id) {
    return ajax.get('/manage/scholarship/teacher/' + id)
  },

  // 提交一个审批
  submit (arg1, arg2) {
    return ajax.put('/manage/scholarship/teacher/', {
      scholarshipUid: arg1,
      swmsApprovalList: arg2
    })
  },

  delete (id) {
    return ajax.delete('/manage/scholarship/' + id)
  },

  batchRemove (ids) {
    return ajax.delete('/manage/scholarship/batch/' + ids)
  }
}

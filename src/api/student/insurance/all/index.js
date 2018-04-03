import ajax from '@/utils/ajax'

export default {
  // 获取所有保险信息
  queryForList (query) {
    return ajax.get('/manage/insurance-setting/student', {
      params: query,
      transformResponse: data => {
        const json = JSON.parse(data)
        if (json.code !== 1) return json

        const total = json.data.total
        const rows = json.data.rows
        return {
          total,
          rows
        }
      }
    })
  },

  queryForObject (id) {
    return ajax.get('/manage/insurance-setting/' + id)
  },

  create (id, swmsApprovalList) {
    return ajax.post('/manage/insurance/' + id, {
      swmsApprovalList
    })
  }
}

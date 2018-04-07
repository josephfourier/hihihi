import ajax from '@/utils/ajax'

export default {
  queryForList (query) {
    return ajax.get('/manage/scholarship-setting/student', {
      params: query,
      transformResponse: data => {
        const json = JSON.parse(data)
        if (json.code !== 1) return json

        const total = json.data.total
        const rows = json.data.rows
        const code = json.code

        return {
          code,
          total,
          rows
        }
      }
    })
  },

  queryForObject (id) {
    return ajax.get('/manage/scholarship-setting/' + id)
  },

  create (id, arg) {
    return ajax.post('/manage/scholarship/' + id, arg)
  }
}

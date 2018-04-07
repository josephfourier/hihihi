import ajax from '@/utils/ajax'

export default {
  queryForList (type, query) {
    return ajax.get('/manage/honorary-setting/category/' + type, {
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
    return ajax.get('/manage/honorary-setting/' + id)
  },

  create (id, arg) {
    return ajax.post('/manage/studentHonorary/' + id, arg)
  }
}

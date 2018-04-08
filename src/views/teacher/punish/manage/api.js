import ajax from '@/utils/ajax'
import { selfMerge } from '@/utils'

export default {
  queryForList (query) {
    return ajax.get('/manage/punish/teacher', {
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
    return ajax.get('/manage/punish/' + id)
  },

  create (arg) {

  },

  update (id, arg) {
    return ajax.put('/manage/punish/teacher/' + id, arg)
  },

  delete (id) {
    return ajax.delete('/manage/punish/' + id)
  },

  queryPunishSettingList (query) {
    return new Promise((resolve, reject) => {
      this.loading = true
      ajax.get('/manage/punish-setting', {params: query}).then(response => {
        const total = response.data.total
        const rows = response.data.rows
        const code = response.code
        const result = {
          code,
          total,
          rows
        }
        this.loading = false
        if (code !== 1) {
          reject(response.message)
        } else {
          resolve(result)
        }
      }).catch(error => {
        reject(error)
      })
    })
  },

  queryStudent (id) {
    return ajax.get('/manage/punish/student/' + id)
  }
}

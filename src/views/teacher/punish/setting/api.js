import ajax from '@/utils/ajax'

export default {
  queryForList (query) {
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

  create (d) {
    return ajax.post('/manage/punish-setting', d)
  },

  update (id, d) {
    return ajax.put('/manage/punish-setting/' + id, d)
  },

  delete (id) {
    return ajax.delete('/manage/punish-setting/' + id)
  }
}

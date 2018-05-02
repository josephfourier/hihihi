import ajax from '@/utils/ajax'

export default {
  queryForList (query) {
    return new Promise((resolve, reject) => {
      this.loading = true
      ajax.get('/manage/insurance-setting', {params: query}).then(response => {
        const total = response.data.total
        const rows = response.data.rows
        const code = response.code
        const result =  {
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

  create (setting) {
    return ajax.post('/manage/insurance-setting', setting)
  },

  update (id, setting) {
    return ajax.put('/manage/insurance-setting/' + id, setting)
  },

  queryForObject (id) {
    return new Promise((resolve, reject) => {
      this.loading = true
      ajax.get('/manage/insurance-setting/' + id).then(response => {
        this.loading = false
        resolve(response)
      }).catch(error => {
        reject(error)
      })
    })
    // return ajax.get('/manage/insurance-setting/' + id)
  },

  delete (id) {
    return ajax.delete('/manage/insurance-setting/' + id)
  },

  batchRemove (ids) {
    return ajax.delete('/manage/insurance-setting/batch/' + ids)
  }
}

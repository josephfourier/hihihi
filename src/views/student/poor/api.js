import ajax from '@/utils/ajax'

export default {
  queryForList (query) {
    return new Promise((resolve, reject) => {
      this.loading = true
      ajax.get('/manage/swmsPoor/student', {params: query}).then(response => {
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
    return ajax.post('/manage/swmsPoor/student', d)
  }
}

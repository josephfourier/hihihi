import ajax from '@/utils/ajax'
import { selfMerge } from '@/utils'

const download = (data, fileName) => {
  if (!data) return

  let url = window.URL.createObjectURL(new Blob([data]))
  let link = document.createElement('a')
  link.style.display = 'none'
  link.href = url
  link.setAttribute('download', fileName)
  document.body.appendChild(link)

  link.click()
}

export default {
  queryForList (query) {
    return ajax.get('/manage/swmsPoor/teacher', {
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

  submit (arg) {
    return ajax.put('/manage/swmsPoor/teacher', arg)
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
  },

  ajaxDownload (url, data, fileName) {
    return new Promise((resolve, reject) => {
      ajax({
        method: 'get',
        url: url,
        data: data,
        responseType: 'blob'
      }).then(res => {
        if (res.type === 'application/x-xls') {
          download(res, fileName)
          resolve()
        } else {
          reject(new Error(res))
        }
      }).catch(error => console.log(error))
    })
  }
}

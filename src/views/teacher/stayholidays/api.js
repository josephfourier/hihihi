import ajax from '@/utils/ajax'
import {selfMerge} from '@/utils'
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
    return ajax.get('/manage/teacher/swmsStayholidays', {
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
    return ajax.get('/manage/teacher/swmsStayholiday/' + id)
  },

  delete (id) {
    return ajax.delete('/manage/student/swmsStayholiday/' + id)
  },

  batchRemove (arg) {
    return ajax({
      method: 'delete',
      url: '/manage/teacher/swmsStayholiday',
      data: arg
    })
  },

  update (arg) {
    return ajax.put('/manage/teacher/swmsStayholiday', arg)
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

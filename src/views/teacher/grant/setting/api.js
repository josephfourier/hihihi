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
  // 助学金名单
  queryList (query) {
    return ajax.get('/manage/swmsStulist/setting', {
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
  // 1 助学金 2 学费减免
  queryFileList (funcationClass) {
    return ajax.get('/manage/swmsNotice/setting/' + funcationClass)
  },

  queryFacultyList () {
    return ajax.get('/manage/insurance/faculty')
  },

  queryClassByFaculty (code) {
    return ajax.get('/manage/common/facultyClass/' + code)
  },

  queryPostList () {
    return ajax.get('/manage/common/ucenterPost')
  },

  uploadFile () {

  },
  saveFile (arg) {
    return ajax.post('/manage/swmsNotice/setting', arg)
  },
  updateFile (arg) {
    return ajax.put('/manage/swmsNotice/setting', arg)
  },
  deleteFile (id) {
    return ajax.delete('/manage/swmsNotice/setting/' + id)
  },
  // 删除一个助学金名单学生
  deleteStudent (stulistUid) {
    return ajax.delete('/manage/swmsStulist//setting/' + stulistUid)
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

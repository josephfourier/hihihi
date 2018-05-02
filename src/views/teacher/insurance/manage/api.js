import ajax from '@/utils/ajax'
import { selfMerge } from '@/utils'

export default {
  queryForList (query) {
    return ajax.get('/manage/insurance/teacher', {
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

  queryForSettingList (query) {
    return new Promise((resolve, reject) => {
      this.loading = true
      ajax.get('/manage/insurance-setting', {params: query}).then(response => {
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

  queryForObject (id) {
    return ajax.get('/manage/insurance/teacher/' + id)
  },

  // 提交一个审批
  submit (arg1, arg2, arg3) {
    return ajax.put('/manage/insurance/teacher/', {
      insuranceUid: arg1,
      inssettingUid: arg2,
      swmsApprovalList: arg3
    })
  },

  batch (arg) {
    return ajax.put('/manage/insurance/batch', arg)
  },

  queryApprovalProcess (sid, did) {
    return ajax({
      url: '/manage/swmsApproval/' + sid + '/' + did,
      method: 'get'
    })
  },
  // 根据范围查询院系
  queryFacultyList () {
    return ajax.get('/manage/insurance/faculty')
  },
  querySpecialtyByFaculty (code) {
    return ajax.get('/manage/insurance/specialty/' + code)
  }
}

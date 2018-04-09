import ajax from '@/utils/ajax'
import { selfMerge } from '@/utils'

export default {
  // 获取教师自己申请的列表
  queryMyApplyList (query) {
    return ajax.get('/manage/classHonorary/teacher/apply', {
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

  // 查询需要自己审核的申请
  queryAppliedList (query) {
    return ajax.get('/manage/classHonorary/teacher', {
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
    return ajax.get('/manage/honorary-setting/' + id)
  },

  // 提交一个审批申请
  create (honorarySettingUid, classId, requestBody) {
    return ajax.post('/manage/classHonorary/' + honorarySettingUid + '/' + classId, requestBody)
  },

  update (id, arg) {
    return ajax.put('/manage/classHonorary/' + id, arg)
  },

  submit (arg) {
    return ajax.put('/manage/classHonorary/teacher', arg)
  },

  batchRemove (arg) {
    return ajax({
      method: 'delete',
      url: '/manage/classHonorary/batch',
      data: arg
    })
  },

  delete (id) {
    return ajax.delete('/manage/classHonorary/' + id)
  }

}

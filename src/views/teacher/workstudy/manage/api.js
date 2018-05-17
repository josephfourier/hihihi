import ajax from '@/utils/ajax'
import { selfMerge } from '@/utils'

export default {
  queryForList (query) {
    return ajax.get('/manage/swmsWorkstud/teacher', {
      params: query,

      transformResponse: data => {
        const json = JSON.parse(data)
        if (json.code !== 1) return json

        const total = json.data.total
        const code = json.code
        let rows = []

        for (let i = 0; i < json.data.rows.length; ++i) {
          let row = {}
          let spec = json.data.rows[i].swmsWorkstudySetting.specialtyName
          if (spec) {
            delete json.data.rows[i].swmsWorkstudySetting.specialtyName
            Object.assign(json.data.rows[i].swmsWorkstudySetting, {
              requriedSpec: spec
            })
          }
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
  submit (arg1, arg2) {
    return ajax.put('/manage/swmsWorkstud/teacher', {
      workstudyUid: arg1.workstudyUid,
      studentId: arg1.studentId,
      swmsApprovalList: arg2
    })
  },
  delete (id) {
    return ajax.delete('/manage/swmsWorkstud/' + id)
  },

  // batchRemove (ids) {
  //   return ajax.delete('/manage/swmsWorkstud/' + ids)
  // },
  // 获取open=1的困难补助
  querySettingList (query) {
    return ajax.get('/manage/swmsWorkstudySetting/open')
  },

  queryStudent (uid, code) {
    return ajax.get('/manage/swmsWorkstud/enableStudent/' + uid + '/' + code)
  },
  // 教师新增一个学生困难补助
  create (arg) {
    return ajax.post('/manage/swmsWorkstud/teacher', arg)
  },

  batchRemove (arg) {
    return ajax({
      method: 'delete',
      url: '/manage/swmsWorkstud/teacher',
      data: arg
    })
  }
}

import ajax from '@/utils/ajax'
import { selfMerge } from '@/utils'

export default {
  queryForList (query) {
    return ajax.get('/manage/swmsAllowance/teacher', {
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
  submit (arg1, arg2) {
    return ajax.put('/manage/swmsAllowance/teacher', {
      allowanceUid: arg1.allowanceUid,
      studentId: arg1.studentId,
      swmsApprovalList: arg2
    })
  },
  delete (id) {
    return ajax.delete('/manage/swmsAllowance/' + id)
  },

  batchRemove (ids) {
    return ajax({
      method: 'delete',
      url: '/manage/swmsAllowance/teacher',
      data: ids
    })
  },
  // 获取open=1的困难补助
  querySettingList (query) {
    return ajax.get('/manage/swmsAllowanceSetting/open')
  },

  queryStudent (uid, code) {
    return ajax.get('/manage/swmsAllowance/enableStudent/' + uid + '/' + code)
  },
  // 教师新增一个学生困难补助
  create (arg) {
    return ajax.post('/manage/swmsAllowance/teacher', arg)
  }

  // batchRemove (arg) {
  //   return ajax({
  //     method: 'delete',
  //     url: '/manage/scholarship',
  //     data: arg
  //   })
  // }
}

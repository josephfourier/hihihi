import ajax from '@/utils/ajax'
import { selfMerge } from '@/utils'

export default {

  // 查询流程进度(当补办信息不为空时发送)
  queryApprovalProcess (sid, did) {
    return ajax({
      url: '/manage/swmsApproval/' + sid + '/' + did,
      method: 'get'
    })
  },

  // ------------------------- 教师端 -------------------------
  // 查询学生证列表
  queryForList (query) {
    return ajax.get('/manage/teacher/swmsStuidcards', {
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
    return ajax.get('/manage/teacher/swmsStuidcard/' + id)
  },

  // 提交审批通过
  approved (reissued, steps) {
    return ajax({
      url: '/manage/teacher/swmsStuidcard',
      method: 'put',
      data: {
        stuidcardUid: reissued.stuidcardUid,
        studentId: reissued.studentId,
        applyDate: reissued.applyDate,
        applyYear: reissued.applyYear,
        applyReason: reissued.applyReason,
        dataStatus: reissued.dataStatus,
        swmsApprovalList: steps
      }
    })
  },

  // 批量删除
  batchRemove (ids) {
    return ajax({
      url: '/manage/teacher/swmsStuidcard/' + ids,
      method: 'delete'
    })
  }
}

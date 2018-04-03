import ajax from '@/utils/ajax'

export default {
  // 查询初始流程信息（当补办信息为空时发送)
  queryInitial (id) {
    return ajax({
      url: '/manage/swmsApproval/initSwmsApproval/' + id,
      method: 'get'
    })
  },
  // 获取补办信息
  queryReissued () {
    return ajax({
      url: '/manage/student/swmsStuidcard',
      method: 'get'
    })
  },

  create (reissued, steps) {
    return ajax({
      url: '/manage/student/swmsStuidcard',
      method: 'post',
      data: {
        applyReason: reissued.applyReason,
        applyDate: new Date().getTime(),
        applyYear: new Date().getFullYear(),
        studentId: reissued.studentId,
        swmsApprovalList: steps
      }
    })
  },

  // 查询流程进度(当补办信息不为空时发送)
  queryApprovalProcess (sid, did) {
    return ajax({
      url: '/manage/swmsApproval/' + sid + '/' + did,
      method: 'get'
    })
  }
}

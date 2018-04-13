import ajax from '@/utils/ajax'

export default {
  queryForList (query) {
    return ajax.get('/manage/swmsApproval/backlogs')
  },

  queryApprovalProcess (id) {
    return ajax.get('/manage/swmsApproval/' + id)
  },

  queryObjectOfInsurance (id) {
    return ajax.get('/manage/insurance/teacher/' + id)
  },
  queryObjectOfStuidcard (id) {
    return ajax.get('/manage/teacher/swmsStuidcard/' + id)
  },
  queryObjectOfStayholiday (id) {
    return ajax.get('/manage/teacher/swmsStayholiday/' + id)
  },

  queryObjectOfScholarship (id) {
    return ajax.get('/manage/scholarship/' + id)
  },

  submitInsurance (arg1, arg2, arg3) {
    return ajax.put('/manage/insurance/teacher/', {
      insuranceUid: arg1,
      inssettingUid: arg2,
      swmsApprovalList: arg3
    })
  },

  submitStuidcard (reissued, steps) {
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

  submitStayholiday (arg) {
    return ajax.put('/manage/teacher/swmsStayholiday', arg)
  },

  submitSscholarship (arg1, arg2) {
    return ajax.put('/manage/scholarship/teacher/', {
      scholarshipUid: arg1,
      swmsApprovalList: arg2
    })
  }
}

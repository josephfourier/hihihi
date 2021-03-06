import ajax from '@/utils/ajax'

export default {
  queryForList (query) {
    return ajax.get('/manage/swmsApproval/backlogs')
  },

  queryApprovalProcess (sid, did) {
    return ajax({
      url: '/manage/swmsApproval/' + sid + '/' + did,
      method: 'get'
    })
  },
  queryNextApproval (dataId, dataUid, honoraryType) {
    return ajax.get('/manage/swmsApproval/' + dataId + '/' + dataUid + '/' + honoraryType)
  },
  // queryApprovalProcess (id) {
  //   return ajax.get('/manage/swmsApproval/' + id)
  // },

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
  queryObjectOfPoor (id) {
    return ajax.get('/manage/swmsPoor/' + id)
  },
  queryObjectOfStudentHonorary (id) {
    return ajax.get('/manage/studentHonorary/' + id)
  },
  queryObjectOfClassHonorary (id) {
    return ajax.get('/manage/classHonorary/' + id)
  },
  queryObjectOfFacultyHonorary (id) {
    return ajax.get('/manage/facultyHonorary/' + id)
  },
  queryObjectOfAllowance (id) {
    return ajax.get('/manage/swmsAllowance/' + id)
  },
  queryObjectOfWorkstudy (id) {
    return ajax.get('/manage/swmsWorkstud/' + id)
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

  submitScholarship (arg1, arg2) {
    return ajax.put('/manage/scholarship/teacher/', {
      scholarshipUid: arg1,
      swmsApprovalList: arg2
    })
  },

  submitPoor (arg) {
    return ajax.put('/manage/swmsPoor/teacher', arg)
  },
  submitAllowance (arg) {
    return ajax.put('/manage/swmsAllowance/teacher', arg)
  },
  submitWorkstudy (arg) {
    return ajax.put('/manage/swmsWorkstud/teacher', arg)
  },

  submitStudentHonorary (arg) {
    return ajax.put('/manage/studentHonorary/teacher', arg)
  },
  submitClassHonorary (arg) {
    return ajax.put('/manage/classHonorary/teacher', arg)
  },
  submitFacultyHonorary (arg) {
    return ajax.put('/manage/facultyHonorary/teacher', arg)
  },
  queryNoticeNotRead () {
    return ajax.get('/manage/swmsNotice/swmsNoticeRead')
  },

  readNotice (noticeUid) {
    return ajax.get('/manage/swmsNotice/swmsNoticeRead/' + noticeUid)
  }
}

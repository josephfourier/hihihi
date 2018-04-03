import ajax from '@/utils/ajax'

export default {
  // 查询初始流程信息（当补办信息为空时发送)
  queryInitial (id) {
    return ajax({
      url: '/manage/swmsApproval/initSwmsApproval/' + id,
      method: 'get'
    })
  },

  // 查询审批流程菜单
  queryApprovalList () {
    return ajax({
      url: '/manage/approvalTemplate/approvalProcess',
      method: 'get'
    })
  },
  // 处理人类型
  queryApprovalHandler () {
    return ajax({
      url: '/manage/common/dict/DICT_APPROVAL_TYPE',
      method: 'get'
    })
  },

  // 处理级别
  queryApprovalLevel () {
    return ajax({
      url: '/manage/common/dict/DICT_POST_LEVEL',
      method: 'get'
    })
  },

  // 根据级别查询职务
  queryPostList (level) {
    return ajax({
      url: '/manage/common/ucenterPost/' + level,
      method: 'get'
    })
  },

  // 根据职务查询教师
  queryTeacherList (id) {
    return ajax({
      url: '/manage/common/ucenterTeacher/' + id,
      method: 'get'
    })
  },

  queryApprovalProcess (sid, did) {
    return ajax({
      url: '/manage/swmsApproval/' + sid + '/' + did,
      method: 'get'
    })
  },

  queryFacultyList () {
    return ajax.get('/manage/insurance/faculty')
  },

  querySpecialtyByFaculty (code) {
    return ajax.get('/manage/insurance/specialty/' + code)
  },

  queryClassList () {
    return ajax.get('/manage/stufile/student/class')
  },

  queryHolidayTypeList () {
    return ajax.get('/manage/common/dict/DICT_HOLIDAY_TYPE')
  },

  queryStudent () {
    return ajax.get('/manage/common/ucenterStudent')
  }
}

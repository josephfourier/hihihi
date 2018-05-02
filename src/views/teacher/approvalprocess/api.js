import ajax from '@/utils/ajax'

export default {
  // 审批流程菜单
  queryApprovalList () {
    return ajax({
      url: '/manage/approvalTemplate/approvalProcess',
      method: 'get'
    })
  },

  // 审批流程步骤
  queryApprovalProcess (id) {
    const url = '/manage/approvalTemplate/' + id
    return ajax({
      url: url,
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

  // 创建一个审批流程步骤
  createProvalProcess (item) {
    return ajax({
      url: '/manage/approvalTemplate',
      method: 'post',
      data: item
    })
  },

  // 删除一个审批流程步骤
  deleteProvalProcess (id) {
    return ajax({
      url: '/manage/approvalTemplate/' + id,
      method: 'delete'
    })
  },

  updateProvalProcess (item) {
    return ajax({
      url: '/manage/approvalTemplate',
      method: 'put',
      data: item
    })
  }
}

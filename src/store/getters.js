export default {
  token: state => state.user.token,
  accessed: state => state.user.accessed,
  routes: state => state.permission.permissionRoutes,
  permissions: state => state.permission.permissions,
  approves: state => state.permission.approves,
  todoList: state => state.schedule.todoList,
  user: state => {
    return {
      fullName: state.user.fullName,
      schoolName: state.user.schoolName,
      userDetailId: state.user.userDetailId,
      usertypeId: state.user.usertypeId
    }
  },
  grantWay: state => state.dict.grantWay,
  noticeList: state => state.notice.noticeList,

  specialtyList: state => state.common.specialtyList,
  facultyList: state => state.common.facultyList,
  classList: state => state.common.classList,
  isCollapsed: state => state.app.isCollapsed
}

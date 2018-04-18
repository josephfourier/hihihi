import ajax from '@/utils/ajax'

export default {
  // 1 助学金 2 学费减免
  queryFileList (funcationClass) {
    return ajax.get('/manage/swmsNotice/setting/' + funcationClass)
  },

  queryFacultyList () {
    return ajax.get('/manage/insurance/faculty')
  },

  queryPostList () {
    return ajax.get('/manage/common/ucenterPost')
  },

  uploadFile () {

  },
  saveFile () {
    return ajax.post('/manage/swmsNotice/setting')
  }

  // queryTypeList () {
  //   return ajax.get('/manage/honorary-setting')
  // },
  // // 根据荣誉称号类别获取名称
  // queryNameByTyep (type) {
  //   return ajax.get('/manage/honorary-setting/teacher/' + type)
  // },

  // queryStudent (code, uid) {
  //   return ajax.get('/manage/scholarship/student/' + code + '/' + uid)
  // },
  // // 教师班级荣誉称号
  // create (uid, id, arg) {
  //   return ajax.post('/manage/facultyHonorary/teacher/' + uid + '/' + id, arg)
  // },
  // batchRemove (arg) {
  //   return ajax({
  //     method: 'delete',
  //     url: '/manage/studentHonorary',
  //     data: arg
  //   })
  // }
}

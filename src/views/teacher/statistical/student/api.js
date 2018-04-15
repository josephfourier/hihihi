import ajax from '@/utils/ajax'

export default {
  queryForList (query) {
    return ajax.get('/manage/common/ucenterStudents', {
      params: query
    })
  },
  queryFacultyList () {
    return ajax.get('/manage/insurance/faculty')
  },

  querySpecialtyList () {
    return ajax.get('/manage/common/schoolSpecialty')
  }
}

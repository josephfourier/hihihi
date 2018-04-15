import ajax from '@/utils/ajax'

export default {
  queryForList (query) {
    return ajax.get('/manage/common/ucenterClasses', {
      params: query
    })
  },
  queryFacultyList () {
    return ajax.get('/manage/insurance/faculty')
  },

  querySpecialtyByFaculty (code) {
    return ajax.get('/manage/insurance/specialty/' + code)
  },

  querySpecialtyList () {
    return ajax.get('/manage/common/schoolSpecialty')
  }
}

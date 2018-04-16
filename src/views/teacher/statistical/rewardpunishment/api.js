import ajax from '@/utils/ajax'

export default {
  queryFacultyList () {
    return ajax.get('/manage/insurance/faculty')
  },

  queryStatistical (query) {
    return ajax.get('/manage/common/rwdAndPnsmtStatistics', {
      params: query
    })
  }
}

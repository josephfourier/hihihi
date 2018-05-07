import ajax from '@/utils/ajax'

export default {
  queryFileList (funcationClass) {
    return ajax.get('/manage/swmsNotice/swmsNoticeReadScope/' + funcationClass)
  },
  queryMy (funcationClass) {
    return ajax.get('/manage/swmsStulist/student/' + funcationClass)
  }
}

import ajax from '@/utils/ajax'
export default {
  queryFileList (funcationClass) {
    return ajax.get('/manage/swmsNotice/swmsNoticeReadScope/' + funcationClass)
  },

  // 查询自己是否具有资格
  queryMy (funcationClass) {
    return ajax.get('/manage/swmsStulist/student/' + funcationClass)
  }
}

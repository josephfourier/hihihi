import ajax from '@/utils/ajax'

export default {
  queryFileList (funcationClass) {
    return ajax.get('/manage/swmsNotice/swmsNoticeReadScope/' + funcationClass)
  }
}

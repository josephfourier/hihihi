import ajax from '@/utils/ajax'
export default {
  getApproves () {
    return ajax.get('/manage/approvalTemplate/approvalProcess')
  }
}

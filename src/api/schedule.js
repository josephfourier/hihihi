import ajax from '@/utils/ajax'

export default {
  refresh () {
    return ajax.get('/manage/swmsApproval/backlogs')
  }
}

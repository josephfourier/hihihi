import ajax from '@/utils/ajax'

export default {
  queryDict (dictCode) {
    return ajax.get('/manage/common/dict/' + dictCode)
  }
}

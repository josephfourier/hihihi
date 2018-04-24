import ajax from '@/utils/ajax'

export default {
  getAccessed () {
    return ajax({
      url: '/manage/menus',
      method: 'get'
    })
  },

  logout () {
    return ajax.get('/manage/logout')
  }
}

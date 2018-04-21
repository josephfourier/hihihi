import ajax from '@/utils/ajax'
import { selfMerge } from '@/utils'
export default {
  queryForList () {
    return ajax.get('/manage/swmsWorkstudySetting/student')
  },

  queryMyApplyList () {
    return ajax.get('/manage/swmsWorkstud/student', {
      transformResponse: d => {
        const json = JSON.parse(d)
        if (json.code !== 1) return json

        const code = json.code
        let data = []

        for (let i = 0; i < json.data.length; ++i) {
          let row = {}
          selfMerge(json.data[i], row)
          data.push(row)
        }
        return {
          code,
          data
        }
      }
    })
  },

  create (arg) {
    return ajax.post('/manage/swmsWorkstud/student', arg)
  },

  update (arg) {
    return ajax.put('/manage/swmsWorkstud/student', arg)
  },

  delete (id) {
    return ajax.delete('/manage/swmsWorkstud/' + id)
  }
}

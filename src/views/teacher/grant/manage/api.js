import ajax from '@/utils/ajax'
import { selfMerge } from '@/utils'

export default {
  // 助学金名单
  queryList (query) {
    return ajax.get('/manage/swmsStulist/setting', {
      params: query,
      transformResponse: data => {
        const json = JSON.parse(data)
        if (json.code !== 1) return json

        const total = json.data.total
        const code = json.code
        let rows = []

        for (let i = 0; i < json.data.rows.length; ++i) {
          let row = {}
          selfMerge(json.data.rows[i], row)
          rows.push(row)
        }
        return {
          code,
          total,
          rows
        }
      }
    })
  },
  // 1 助学金 2 学费减免
  queryFileList (funcationClass) {
    return ajax.get('/manage/swmsNotice/setting/' + funcationClass)
  }
}

import ajax from '@/utils/ajax'

export default {
  queryForList (offset, limit, query) {
    return ajax({
      url: '/manage/dataScopePerms',
      method: 'get',
      params: {
        offset,
        limit,
        teacherName: decodeURIComponent(query.trim())
      },
      transformResponse: (data) => {
        const response = JSON.parse(data).data
        if (JSON.parse(data).code !== 1) return JSON.parse(data)
        const code = JSON.parse(data).code
        let items = []
        response.rows.forEach(item => {
          if (item.departmentInfos.length > 1) {
            for (let i = 0; i < item.departmentInfos.length; ++i) {
              items.push({
                username: item.username,
                teacherName: item.teacherName,
                departmentId: item.departmentInfos[i].departmentId,
                departmentName: item.departmentInfos[i].departmentName,
                postName: item.departmentInfos[i].postName,
                teacherLevel: item.departmentInfos[i].teacherLevel,
                teacherLevelName: item.departmentInfos[i].teacherLevelName,
                busInfoes: (item.departmentInfos[i]).busInfoes.map(i => {
                  return i.name
                }).join(',')
              })
            }
          } else {
            let _ = item.departmentInfos.length !== 0

            items.push({
              username: item.username,
              teacherName: item.teacherName,
              teacherLevel: item.departmentInfos[0].teacherLevel,
              departmentId: item.departmentInfos[0].departmentId,
              departmentName: _
                ? item.departmentInfos[0].departmentName
                : '',
              postName: _
                ? item.departmentInfos[0].postName
                : '',
              teacherLevelName: _
                ? item.departmentInfos[0].teacherLevelName
                : '',
              busInfoes: _
                ? (item.departmentInfos[0]).busInfoes.map(i => {
                  return i.name
                }).join(',')
                : []
            })
          }
        })

        return {
          code,
          total: response.total || 0,
          items
        }
      }
    })
  },

  queryPermissionScope (tlevel, deptId) {
    return ajax({
      url: '/manage/deptbus/' + tlevel + '/' + deptId,
      method: 'get'
    })
  }
}

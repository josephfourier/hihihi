import { hasPermission } from '@/utils'

export default {
  query: {
    offset: 0,
    limit: 10,
    teacherName: ''
  },
  columns: [
    {
      index: true,
      select: false
    },
    {
      label: '账号',
      prop: 'username'
    },
    {
      label: '用户姓名',
      prop: 'teacherName'
    },
    {
      label: '部门',
      prop: 'departmentName'
    },
    {
      label: '职务',
      prop: 'postName'
    },
    {
      label: '操作',
      operators: [
        {
          label: '查看',
          render: _ => hasPermission('swms:permission-tea:read'),
          cmd: 'view'
        }
      ]
    }
  ]
}

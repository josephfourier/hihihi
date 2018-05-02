import { dateFormat, hasPermission } from '@/utils'

export default {
  query: {
    offset: 0,
    limit: 10
  },
  columns: [
    {
      index: true
    },
    {
      label: '学年',
      prop: 'applyYear'
    },
    // {
    //   label: '设置信息',
    //   prop: 'applyDescription'
    // },
    {
      label: '申请时间',
      prop: 'startDate',
      formatter: dateFormat
    },
    {
      label: '结束时间',
      prop: 'endDate',
      formatter: dateFormat
    },
    {
      label: '操作',
      operators: [
        {
          label: '查看',
          cmd: 'view'
        },
        {
          label: '编辑',
          render: _ => hasPermission('swms:poor-set:update'),
          cmd: 'edit'
        }
      ]
    }
  ]
}

import { dateFormat } from '@/utils'

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
      prop: 'applyYear',
      width: 100
    },
    {
      label: '设置信息',
      prop: 'applyDescription',
      width: 400
    },
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
      width: 200,
      operators: [
        {
          label: '查看',
          cmd: 'view'
        },
        {
          label: '编辑',
          cmd: 'edit'
        }
      ]
    }
  ]
}

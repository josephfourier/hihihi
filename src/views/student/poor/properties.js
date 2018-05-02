import { dateFormat, hasPermission } from '@/utils'
const statusFormat = (cellValue) => {
  if (!cellValue) return '未申请'
  return ['待审批', '已通过', '已拒绝', '审批中'][+cellValue.dataStatus]
}

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
      label: '状态',
      prop: 'swmsPoor',
      formatter: statusFormat
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
          label: '申请',
          cmd: 'create',
          render: row => !row.swmsPoor && hasPermission('swms:poor-stu:create')
        }
      ]
    }
  ]
}

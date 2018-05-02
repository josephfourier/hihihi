import { dateFormat, hasPermission } from '@/utils'

const statusFormatALL = (cellValue) => {
  return ['可申请', '申请中'][+cellValue]
}
const statusFormatMY = (cellValue) => {
  return ['待审批', '已通过', '已拒绝', '审批中'][+cellValue]
}

export default {
  columnsALL: [
    {
      index: true
    },
    {
      label: '岗位名称',
      prop: 'postName'
    }, {
      label: '人数限制',
      prop: 'numberLimit'
    },
    {
      label: '专业要求',
      prop: 'specialtyName'
    },
    {
      label: '薪资待遇',
      prop: 'salary'
    },
    {
      label: '状态',
      prop: 'applyStatus',
      formatter: statusFormatALL
    },
    {
      label: '操作',
      operators: [
        {
          label: '查看',
          cmd: 'view'
        },
        {
          label: '申请',
          render: row =>  row.applyStatus === '0' && hasPermission('swms:workstudy-stu:create'),
          cmd: 'create'
        }
      ]
    }
  ],

  columnsMY: [
    {
      index: true
    },
    {
      label: '岗位名称',
      prop: 'postName'
    },
    {
      label: '申请日期',
      prop: 'applyDate',
      formatter: dateFormat
    },
    {
      label: '人数限制',
      prop: 'numberLimit'
    },
    {
      label: '专业要求',
      prop: 'specialtyName'
    },
    {
      label: '薪资待遇',
      prop: 'salary'
    },
    {
      label: '状态',
      prop: 'dataStatus',
      formatter: statusFormatMY
    },
    {
      label: '操作',
      operators: [
        {
          label: '查看',
          cmd: 'view'
        }
      ]
    }
  ]
}

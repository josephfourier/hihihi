import {hasPermission} from '@/utils'

const statusFormat = (cellValue) =>  ['待审批', '已通过', '已拒绝', '审批中'][+cellValue]

export default {
  query: {
    offset: 0,
    limit: 10,
    dataStatus: '',
    enterYear: new Date().getFullYear().toString(),
    studentCode: ''
  },
  status: [
    {
      label: '待审批',
      value: 0
    },

    {
      label: '已通过',
      value: 1
    },
    {
      label: '已拒绝',
      value: 2
    },
    {
      label: '审批中',
      value: 3
    }
  ],
  columns: [
    {
      index: true
    }, {
      label: '学号',
      prop: 'studentCode'
    }, {
      label: '姓名',
      prop: 'studentName'
    }, {
      label: '院系',
      prop: 'facultyName'
    }, {
      label: '入学年份',
      prop: 'enterYear'
    }, {
      label: '申请次数',
      prop: 'appNum'
    }, {
      label: '状态',
      prop: 'dataStatus',
      formatter: statusFormat
    }, {
      label: '操作',

      operators: [
        {
          label: '查看',
          render: _ => hasPermission('swms:stuidcard-tea:update'),
          cmd: 'view'
        },
        {
          label: '删除',
          render: row => hasPermission('swms:stuidcard-tea:delete') && (row.dataStatus === '1' || row.dataStatus === '2'),
          cmd: 'delete'
        }
      ]
    }
  ]
}

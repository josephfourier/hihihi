import {hasPermission} from '@/utils'

const statusFormat = (cellValue) =>  ['待审批', '已通过', '已拒绝', '审批中'][+cellValue]

export default {
  query: {
    offset: 0,
    limit: 10,
    dataStatus: '', // 0:待审批, 1:已通过, 2:已拒绝, 3:审批中
    enterYear: '',
    studentCode: ''
  },
  years: [
    {
      label: '2017年',
      value: 2017
    },
    {
      label: '2018年',
      value: 2018
    }
  ],

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
      index: true,
      select: true
    }, {
      label: '学号',
      prop: 'studentNo'
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
          cmd: 'view'
        },
        {
          label: '删除',
          render: row => row.dataStatus === '1' || row.dataStatus === '2' && hasPermission('swms:stuidcard-tea:delete'),
          cmd: 'delete'
        }
      ]
    }
  ]
}

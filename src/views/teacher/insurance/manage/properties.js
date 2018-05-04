import { dateFormat, hasPermission } from '@/utils'
const operFormat = (row, cellValue) => '查看'
const statusFormat = (cellValue) => ['待审批', '已通过', '已拒绝', '审批中', '待确认', '待付款'][+cellValue]

export default {
  query: {
    offset: 0,
    limit: 10,
    dataStatus: '',
    applyYear: '',
    studentCode: ''
  },
  optionsYear: [
    {
      label: '2017年',
      value: 2017
    },
    {
      label: '2018年',
      value: 2018
    }
  ],

  optionsStatus: [
    {
      label: '待审批',
      value: 0
    }, {
      label: '已通过',
      value: 1
    }, {
      label: '已拒绝',
      value: 2

    }, {
      label: '审批中',
      value: 3
    }, {
      label: '待确认',
      value: 4
    }, {
      label: '待付款',
      value: 5
    }
  ],
  columns: [
    {
      index: true
    }, {
      label: '学号',
      prop: 'studentCode'
    }, {
      label: '学生姓名',
      prop: 'studentName'
    }, {
      label: '院系',
      prop: 'facultyName'
    }, {
      label: '申请日期',
      prop: 'applyDate',
      formatter: dateFormat
    }, {
      label: '险种名称',
      prop: 'insuranceName'
    }, {
      label: '保险费用',
      prop: 'insuranceCost'
    }, {
      label: '状态',
      prop: 'dataStatus',
      formatter: statusFormat
    }, {
      label: '操作',
      operators: [
        {
          label: '查看',
          cmd: 'view',
          render: row => hasPermission('swms:insurance-tea:update'),
          formatter: operFormat
        }
      ]
    }
  ]
}

import { dateFormat } from '@/utils'
const operFormat = (row, cellValue) => '查看'

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
      prop: 'studentNo',
      width: 100
    }, {
      label: '学生姓名',
      prop: 'studentName',
      width: 100
    }, {
      label: '院系',
      prop: 'facultyName'
    }, {
      label: '申请日期',
      prop: 'applyDate',
      width: 80,
      formatter: dateFormat
    }, {
      label: '险种名称',
      prop: 'insuranceName'
    }, {
      label: '保险费用',
      prop: 'insuranceCost',
      width: 70
    }, {
      label: '状态',
      prop: 'dataStatus',
      width: 50,
      formatter: this.statusFormat
    }, {
      label: '操作',
      operators: [
        {
          label: '查看',
          cmd: 'view',
          formatter: operFormat
        }
      ]
    }
  ]
}

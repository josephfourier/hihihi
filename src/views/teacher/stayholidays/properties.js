import { dateFormat } from '@/utils'

const statusFormat = (cellValue) =>  ['待审批', '已通过', '已拒绝', '审批中'][+cellValue]

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
    }
  ],
  //  --------------- 初始化select END ---------------

  //  表格数据
  columns: [
    {
      index: true,
      indexWidth: 50
    }, {
      label: '学号',
      prop: 'studentNo',
      width: 100
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
      label: '申请年份',
      prop: 'applyYear'
    }, {
      label: '假期名称',
      prop: 'holidayName'
    }, {
      label: '电话',
      prop: 'phone'

    }, {
      label: '状态',
      prop: 'dataStatus',
      formatter: statusFormat
    }, {
      label: '操作',
      width: '200',
      operators: [
        {
          label: '查看',
          cmd: 'view'
        },
        {
          label: '删除',
          cmd: 'delete'
        }
      ]
    }
  ]
}

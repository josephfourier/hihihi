import { dateFormat, hasPermission } from '@/utils'

const statusFormat = (cellValue) => {
  return ['待审批', '已通过', '已拒绝', '审批中'][+cellValue]
}

export default {
  query: {
    offset: 0,
    limit: 10,
    dataStatus: '',
    applyYear: '',
    studentCode: ''
  },
  optionsYears: [
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
  columns: [
    {
      index: true,
      select: true
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
    },  {
      label: '荣誉称号名称',
      prop: 'honoraryName'
    }, {
      label: '状态',
      prop: 'dataStatus',
      formatter: statusFormat
    }, {
      label: '操作',
      operators: [
        {
          label: '查看',
          render: _ => hasPermission('swms:stuhonorary-tea:update'),
          cmd: 'view'
        },
        {
          label: '删除',
          render: (row) => row.dataStatus === '1' || row.dataStatus === '2' && hasPermission('swms:stuhonorary:delete'),
          cmd: 'delete'
        }
      ]
    }
  ],
  queryExport: {
    dataStatus: '',
    applyYear: '',
    studentCode: ''
  },
  header: ['学号', '学生姓名', '院系', '申请日期', '奖学金名称', '状态', '申请原因'],
  filter: ['studentCode', 'studentName', 'facultyName', 'applyDate', 'honoraryName', 'dataStatusName', 'applyReson'],
  excelName: '个人荣誉称号申请名单'
}

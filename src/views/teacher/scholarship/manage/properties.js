import { dateFormat, hasPermission } from '@/utils'

const statusFormat = (cellValue) => {
  return ['待审批', '已通过', '已拒绝', '审批中'][+cellValue]
}

export default {
  query: {
    offset: 0,
    limit: 10,
    dataStatus: '',
    applyYear: new Date().getFullYear().toString(),
    studentCode: ''
  },
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
    },
    {
      label: '学号',
      prop: 'studentCode',
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
      label: '奖学金名称',
      prop: 'scholarshipName'
    }, {
      label: '金额(元)',
      prop: 'money'
    }, {
      label: '申请年份',
      prop: 'applyYear'
    }, {
      label: '状态',
      prop: 'dataStatus',
      formatter: statusFormat
    },
    {
      label: '操作',
      operators: [
        {
          label: '查看',
          render: _ => hasPermission('swms:scholarship-tea:update'),
          cmd: 'view'
        },
        {
          label: '删除',
          render: (row) => hasPermission('swms:scholarship:delete') && (row.dataStatus === '1' || row.dataStatus === '2'),
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
  header: ['学号', '学生姓名', '院系', '专业', '班级', '申请日期', '奖学金名称', '金额(元)',  '申请年份', '状态', '申请原因'],
  filter: ['studentCode', 'studentName', 'facultyName', 'facultyName', 'specialtyName', 'applyDate', 'scholarshipName', 'money', 'applyYear', 'dataStatusName', 'applyReson'],
  excelName: '奖学金申请名单'
}

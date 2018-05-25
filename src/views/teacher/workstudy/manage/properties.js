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
      label: '岗位名称',
      prop: 'postName'
    }, {
      label: '薪资(元)',
      prop: 'salary'
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
          render: _ => hasPermission('swms:workstudy-tea:update'),
          cmd: 'view'
        },
        {
          label: '删除',
          render: (row) => hasPermission('swms:workstudy:delete') && (row.dataStatus === '1' || row.dataStatus === '2'),
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
  header: ['学号', '学生姓名', '院系', '申请日期',  '岗位名称', '薪资', '申请年份', '状态', '申请原因'],
  filter: ['studentCode', 'studentName', 'facultyName', 'applyDate', 'postName', 'salary', 'applyYear', 'dataStatus', 'applyReson'],
  excelName: '勤工助学申请名单'
}

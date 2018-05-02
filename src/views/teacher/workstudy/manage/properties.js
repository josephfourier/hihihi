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
  columns: [
    {
      index: true,
      select: true
    },
    {
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
      label: '岗位名称',
      prop: 'postName'
    }, {
      label: '薪资',
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
          render: (row) => row.dataStatus === '1' || row.dataStatus === '2' && hasPermission('swms:workstudy:delete'),
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
  header: ['学号', '学生姓名', '院系', '申请日期',  '岗位名称', '薪资', '申请年份', '状态'],
  filter: ['studentNo', 'studentName', 'facultyName', 'applyDate', 'postName', 'salary', 'applyYear', 'dataStatus'],
  excelName: '勤工助学'
}

import { dateFormat, hasPermission } from '@/utils'

export default {
  query: {
    offset: 0,
    limit: 10,
    enterYear: '',
    classId: '',
    studentNo: ''
  },

  queryExport: {
    enterYear: '',
    classId: '',
    studentNo: ''
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

  optionsStatus: [
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
    },
    {
      label: '学号',
      prop: 'studentNo'
    },
    {
      label: '姓名',
      prop: 'studentName'
    },
    {
      label: '院系',
      prop: 'facultyName'
    },
    {
      label: '专业',
      prop: 'specialtyName'
    },
    {
      label: '班级',
      prop: 'className'
    },
    {
      label: '建档日期',
      prop: 'stufileDate',
      formatter: dateFormat
    },
    {
      label: '入学年份',
      prop: 'enterYear'
    },
    {
      label: '操作',
      operators: [
        {
          label: '查看',
          cmd: 'view'
        },
        {
          label: '编辑',
          render: _ => hasPermission('swms:stufile-tea:update'),
          cmd: 'edit'
        }
      ]
    }
  ],
  header: ['学号', '姓名', '院系', '专业', '班级', '建档日期', '入学年份'],
  filter: ['studentNo', 'studentName', 'facultyName', 'specialtyName', 'className', 'stufileDate', 'enterYear'],
  excelName: '学生档案'
}

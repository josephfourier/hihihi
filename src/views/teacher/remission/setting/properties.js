import { hasPermission } from '@/utils'

const openFormat = cellValue => {
  return ['否', '是'][+cellValue]
}

export default {
  query: {
    offset: 0,
    limit: 10,
    functionClass: '2',
    applyYear: '',
    facultyCode: '',
    classId: '',
    studentCode: ''
  },
  yearList: [
    {
      label: '2017年',
      value: 2017
    },
    {
      label: '2018年',
      value: 2018
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
      label: '电话',
      prop: 'phone'
    },
    {
      label: '申请年份',
      prop: 'applyYear'
    },
    {
      label: '操作',
      operators: [
        {
          label: '删除',
          render: _ => hasPermission('swms:stulist:delete'),
          cmd: 'delete'
        }
      ]
    }
  ],
  columnsFile: [
    {
      index: true
    },
    {
      label: '文件名称',
      prop: 'fileName'
    },
    {
      label: '开放阅读',
      prop: 'isOpen',
      formatter: openFormat
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
          render: _ => hasPermission('swms:notice-file:update'),
          cmd: 'edit'
        },
        {
          label: '删除',
          render: _ => hasPermission('swms:notice-file:delete'),
          cmd: 'delete'
        }
      ]
    }
  ],
  queryExport: {
    functionClass: '2',
    applyYear: '',
    facultyCode: '',
    classId: '',
    studentCode: ''
  },
  header: ['学号', '姓名', '院系', '专业', '班级', '电话', '申请年份'],
  filter: ['studentNo', 'studentName', 'facultyName', 'specialtyName', 'className', 'phone', 'applyYear'],
  excelName: '学费减免'
}

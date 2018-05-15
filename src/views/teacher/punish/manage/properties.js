import { dateFormat, hasPermission } from '@/utils'

const statusFormat = (cellValue) => {
  return ['', '已生效', '已撤销'][+cellValue]
}

export default {
  query: {
    offset: 0,
    limit: 10,
    punishStatus: '',
    punishYear: '',
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
      label: '已生效',
      value: 1
    }, {
      label: '已撤销',
      value: 2
    }
  ],
  columns: [
    {
      index: true,
      select: true
    },
    {
      label: '学号',
      prop: 'studentCode'
    }, {
      label: '学生姓名',
      prop: 'studentName'
    }, {
      label: '院系',
      prop: 'facultyName'
    }, {
      label: '处分日期',
      prop: 'punishDate',
      formatter: dateFormat
    }, {
      label: '处分类型',
      prop: 'punishName'
    },
    {
      label: '状态',
      prop: 'punishStatus',
      formatter: statusFormat
    },
    {
      label: '操作',
      operators: [
        {
          label: '查看',
          render: _ =>  hasPermission('swms:punish-tea:update'),
          cmd: 'view'
        },
        {
          label: '删除',
          render: (row) => row.punishStatus === '2' && hasPermission('swms:punish-tea:delete'),
          cmd: 'delete'
        }
      ]
    }
  ],
  queryExport: {
    punishStatus: '',
    punishYear: '',
    studentCode: ''
  },
  header: ['学号', '学生姓名', '院系', '处分日期', '处分类型', '状态', '处分说明'],
  filter: ['studentCode', 'studentName', 'facultyName', 'punishDate', 'punishName', 'punishStatusName', 'punishDescription'],
  excelName: '违纪处分名单'
}

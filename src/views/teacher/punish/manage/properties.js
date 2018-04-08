import { dateFormat } from '@/utils'

const statusFormat = (cellValue) => {
  return ['', '已生效', '已撤销'][+cellValue]
}

export default {
  query: {
    offset: 0,
    limit: 2,
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
      prop: 'studentNo',
      width: 100
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
      prop: 'punishName',
      width: 200
    },
    {
      label: '状态',
      prop: 'punishStatus',
      formatter: statusFormat
    },
    {
      label: '操作',
      width: '200',
      operators: [
        {
          label: '查看',
          cmd: 'view'
        },
        {
          label: '删除',
          render: (row) => row.punishStatus === '2',
          cmd: 'delete'
        }
      ]
    }
  ]
}

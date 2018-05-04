import { dateFormat } from '@/utils'

export default {
  query: {
    offset: 0,
    limit: 10
  },
  columns: [
    {
      index: true,
      indexWidth: 50
    }, {
      label: '学号',
      prop: 'studentCode',
      width: 100
    }, {
      label: '学生姓名',
      prop: 'studentName'
    }, {
      label: '院系',
      prop: 'facultyName'
    },
    {
      label: '处分日期',
      prop: 'punishDate',
      formatter: dateFormat
    },
    {
      label: '年级',
      prop: 'year'
    }, {
      label: '处分类型',
      prop: 'punishName'

    }, {
      label: '状态',
      prop: 'punishStatusName'
    }, {
      label: '操作',
      operators: [
        {
          label: '查看',
          cmd: 'view'
        }
      ]
    }
  ]
}

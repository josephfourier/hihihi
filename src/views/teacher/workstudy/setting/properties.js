import { dateFormat } from '@/utils'
const openFormat = (val) => ['否', '是'][+val]

export default {
  query: {
    offset: 0,
    limit: 10
  },
  columns: [
    {
      index: true,
      select: true
    },
    {
      label: '岗位名称',
      prop: 'postName'
    }, {
      label: '人数限制',
      prop: 'numberLimit'
    },
    {
      label: '专业要求',
      prop: 'specialtyName'
    },
    {
      label: '申请时间',
      prop: 'startDate',
      formatter: dateFormat
    },
    {
      label: '薪资待遇',
      prop: 'salary'
    },
    {
      label: '开放申请',
      prop: 'isOpen',
      formatter: openFormat
    },
    {
      label: '操作',
      operators: [
        {
          label: '编辑',
          cmd: 'edit'
        },
        {
          label: '删除',
          cmd: 'delete'
        }
      ]
    }
  ]
}

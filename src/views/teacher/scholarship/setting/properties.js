const statusFormat = (cellValue) => ['否', '是'][+cellValue]

export default {
  query: {
    offset: 0,
    limit: 10
  },
  columns: [
    {
      index: true
    },
    {
      label: '奖学金名称',
      prop: 'scholarshipName'
    },
    {
      label: '人员限数',
      prop: 'numberLimit'
    },
    {
      label: '奖学金级别',
      prop: 'scholarshipLevel'
    },
    {
      label: '金额',
      prop: 'money'
    },
    {
      label: '开放申请',
      prop: 'isOpen',
      formatter: statusFormat
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

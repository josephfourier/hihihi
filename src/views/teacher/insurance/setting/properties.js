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
      label: '险种名称',
      prop: 'insuranceName',
      width: '300'
    },
    {
      label: '保险公司',
      prop: 'insuranceCompany',
      width: '200'
    },
    {
      label: '险种类别',
      prop: 'insuranceCategory'
    },
    {
      label: '保险费用',
      prop: 'insuranceCost'
    },
    {
      label: '保险期限',
      prop: 'insuranceLimit'
    },
    {
      label: '操作',
      width: '200',
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

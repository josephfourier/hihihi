const openFormat = (val) => ['否', '是'][+val]

export default {
  columns: [
    {
      index: true,
      select: true
    },
    {
      label: '困难补助名称',
      prop: 'allowanceName'
    }, {
      label: '人数限制',
      prop: 'numberLimit'
    },
    {
      label: '金额',
      prop: 'money'
    },
    {
      label: '开放申请',
      prop: 'isOpen',
      formatter: openFormat
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

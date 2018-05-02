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
      label: '荣誉称号名称',
      prop: 'honoraryName'
    }, {
      label: '人数限制',
      prop: 'numberLimit'
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

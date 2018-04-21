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
      label: '违纪类型',
      prop: 'punishName'
    }, {
      label: '违纪说明',
      prop: 'punishtDescription'
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

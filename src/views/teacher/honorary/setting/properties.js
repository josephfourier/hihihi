import { hasPermission } from "@/utils";

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
          render: _ => hasPermission('swms:honorary-set:update'),
          cmd: 'edit'
        },
        {
          label: '删除',
          render: _ => hasPermission('swms:honorary-set:delete'),
          cmd: 'delete'
        }
      ]
    }
  ]
}

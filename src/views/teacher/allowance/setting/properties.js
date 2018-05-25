import { hasPermission } from '@/utils'

const openFormat = (val) => ['否', '是'][+val]

export default {
  columns: [
    {
      index: true
    },
    {
      label: '困难补助名称',
      prop: 'allowanceName'
    }, {
      label: '人数限制',
      prop: 'numberLimit'
    },
    {
      label: '金额(元)',
      prop: 'money'
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
          render: _ => hasPermission('swms:allowance-set:update'),
          cmd: 'edit'
        },
        {
          label: '删除',
          render: _ => hasPermission('swms:allowance-set:delete'),
          cmd: 'delete'
        }
      ]
    }
  ]
}

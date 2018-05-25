import { hasPermission } from '@/utils'

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
      label: '险种名称',
      prop: 'insuranceName',
      width: 400
    },
    {
      label: '保险公司',
      prop: 'insuranceCompany'
    },
    {
      label: '险种类别',
      prop: 'insuranceCategory'
    },
    {
      label: '保险费用(元)',
      prop: 'insuranceCost'
    },
    {
      label: '保险期限',
      prop: 'insuranceLimit'
    },
    {
      label: '操作',
      operators: [
        {
          label: '编辑',
          render: _ => hasPermission('swms:insurance-set:update'),
          cmd: 'edit'
        },
        {
          label: '删除',
          render: _ => hasPermission('swms:insurance-set:delete'),
          cmd: 'delete'
        }
      ]
    }
  ]
}

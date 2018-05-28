import { hasPermission, dateFormat } from '@/utils'

const statusFormatALL = (cellValue) => {
  return ['可申请', '申请中'][+cellValue]
}

const statusFormatMY = (cellValue) => ['待审批', '已通过', '已拒绝', '审批中', '待确认', '待付款', '未缴费', '预缴费', '已缴费', '待退费', '已退费'][+cellValue]

export default {
  query: {
    offset: 0,
    limit: 10
  },
  columnsALL: [
    {
      index: true
    }, {
      label: '险种名称',
      prop: 'insuranceName'
    }, {
      label: '保险公司',
      prop: 'insuranceCompany'
    }, {
      label: '险种类别',
      prop: 'insuranceCategory'
    }, {
      label: '保险费用(元)',
      prop: 'insuranceCost'
    }, {
      label: '保险期限(年)',
      prop: 'insuranceLimit'
    }, {
      label: '状态',
      prop: 'applyStatus',
      formatter: statusFormatALL
    },
    {
      label: '操作',
      operators: [
        {
          label: '查看',
          cmd: 'view'
        },
        {
          label: '申请',
          render: row => row.applyStatus !== '1' && hasPermission('swms:insurance-stu:create'),
          cmd: 'create'
        }
      ]
    }
  ],
  columnsMY: [
    {
      index: true
    }, {
      label: '险种名称',
      prop: 'insuranceName'
    }, {
      label: '保险公司',
      prop: 'insuranceCompany'
    }, {
      label: '险种类别',
      prop: 'insuranceCategory'
    }, {
      label: '保险费用(元)',
      prop: 'insuranceCost'
    }, {
      label: '保险期限(年)',
      prop: 'insuranceLimit'
    },
    {
      label: '申请时间',
      prop: 'applyDate',
      formatter: dateFormat
    },
    {
      label: '状态',
      prop: 'dataStatus',
      formatter: statusFormatMY
    },
    {
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

import { dateFormat } from '@/utils'

const statusFormatALL = (cellValue) => {
  return ['可申请', '申请中'][+cellValue]
}

const statusFormatMY = (cellValue) => {
  return ['待审批', '已通过', '已拒绝', '审批中', '待确认', '待付款'][+cellValue]
}

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
      prop: 'insuranceName',
      width: 200
    }, {
      label: '保险公司',
      prop: 'insuranceCompany'
    }, {
      label: '险种类别',
      prop: 'insuranceCategory'
    }, {
      label: '保险费用',
      prop: 'insuranceCost'
    }, {
      label: '保险期限',
      prop: 'insuranceLimit'
    }, {
      label: '状态',
      prop: 'applyStatus',
      formatter: statusFormatALL
    },
    {
      label: '操作',
      width: '200',
      operators: [
        {
          label: '查看',
          cmd: 'view'
        },
        {
          label: '申请',
          render: row => row.applyStatus !== '1',
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
      prop: 'insuranceName',
      width: 200
    }, {
      label: '保险公司',
      prop: 'insuranceCompany'
    }, {
      label: '险种类别',
      prop: 'insuranceCategory'
    }, {
      label: '保险费用',
      prop: 'insuranceCost'
    }, {
      label: '保险期限',
      prop: 'insuranceLimit'
    }, {
      label: '状态',
      prop: 'dataStatus',
      formatter: statusFormatMY
    },
    {
      label: '操作',
      width: '200',
      operators: [
        {
          label: '查看',
          cmd: 'view'
        }
      ]
    }
  ]
}

const statusFormatALL = (cellValue) => {
  return ['可申请', '申请中'][+cellValue]
}
const statusFormatMY = (cellValue) => {
  return ['待审批', '已通过', '已拒绝', '审批中'][+cellValue]
}

export default {
  columnsALL: [
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
      label: '金额',
      prop: 'money'
    },
    {
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
          render: row =>  row.applyStatus === '0',
          cmd: 'create'
        }
      ]
    }
  ],

  columnsMY: [
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
      label: '金额',
      prop: 'money'
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

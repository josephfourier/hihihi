const statusFormatALL = (cellValue) => {
  return ['可申请', '申请中'][+cellValue]
}

const statusFormat = (cellValue) => {
  return ['待审批', '已通过', '已拒绝', '审批中'][+cellValue]
}

export default {
  query: {
    offset: 0,
    limit: 10
  },
  columns: [
    {
      index: true
    }, {
      label: '奖学金名称',
      prop: 'scholarshipName'
    }, {
      label: '人数限制',
      prop: 'numberLimit'
    }, {
      label: '奖学金级别',
      prop: 'scholarshipLevel'
    }, {
      label: '金额',
      prop: 'money'
    }, {
      label: '发放对象',
      prop: 'grantObject'
    }, {
      label: '申请年份',
      prop: 'applyYear'
    }, {
      label: '状态',
      prop: 'dataStatus',
      formatter: statusFormat
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
  ],
  columnsALL: [
    {
      index: true
    }, {
      label: '奖学金名称',
      prop: 'scholarshipName',
    }, {
      label: '人数限制',
      prop: 'numberLimit'
    }, {
      label: '奖学金级别',
      prop: 'scholarshipLevel'
    }, {
      label: '金额',
      prop: 'money'
    }, {
      label: '发放对象',
      prop: 'grantObject'
    }, {
      label: '申请年份',
      prop: 'grantWayName'
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
          render: row =>  row.applyStatus === '0',
          cmd: 'create'
        }
      ]
    }
  ],
}

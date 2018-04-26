const statusFormat = (cellValue) =>  ['待审批', '已通过', '已拒绝', '审批中'][+cellValue]

export default {
  columns: [
    {
      index: true,
      select: true
    }, {
      label: '学号',
      prop: 'studentNo'
    }, {
      label: '姓名',
      prop: 'studentName'
    }, {
      label: '院系',
      prop: 'facultyName'
    }, {
      label: '入学年份',
      prop: 'enterYear'
    }, {
      label: '申请次数',
      prop: 'appNum'
    }, {
      label: '状态',
      prop: 'dataStatus',
      formatter: statusFormat
    }, {
      label: '操作',

      operators: [
        {
          label: '查看',
          cmd: 'view'
        },
        {
          label: '删除',
          cmd: 'delete'
        }
      ]
    }
  ]
}

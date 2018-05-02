import { hasPermission, dateFormat } from '@/utils'

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
      label: '学号',
      prop: 'studentNo'
    }, {
      label: '学生姓名',
      prop: 'studentName'
    }, {
      label: '院系',
      prop: 'facultyName'
    }, {
      label: '申请日期',
      prop: 'applyDate',
      formatter: dateFormat
    }, {
      label: '申请年份',
      prop: 'applyYear'
    }, {
      label: '假期名称',
      prop: 'holidayName'
    }, {
      label: '电话',
      prop: 'phone'

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
  ]
}

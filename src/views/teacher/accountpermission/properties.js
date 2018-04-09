import { dateFormat } from '@/utils'

const statusFormatALL = (cellValue) => {
  return ['可申请', '申请中'][+cellValue]
}
const statusFormatMY = (cellValue) => {
  return ['待审批', '已通过', '已拒绝', '审批中'][+cellValue]
}

export default {

  query: {
    offset: 0,
    limit: 10,
    teacherName: ''
  },
  columns: [
    {
      index: true,
      select: false
    },
    {
      label: '账号',
      prop: 'username',
      width: '300'
    },
    {
      label: '用户姓名',
      prop: 'teacherName',
      width: '200'
    },
    {
      label: '部门',
      prop: 'departmentName'
    },
    {
      label: '职务',
      prop: 'postName'
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

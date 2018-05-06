// import { hasPermission } from '@/utils'

const openFormat = cellValue => {
  return ['否', '是'][+cellValue]
}

export default {
  columnsFile: [
    {
      index: true
    },
    {
      label: '文件名称',
      prop: 'fileName'
    },
    {
      label: '开放阅读',
      prop: 'isOpen',
      formatter: openFormat
    },
    {
      label: '操作',
      operators: [
        {
          label: '查看',
          // render: _ => hasPermission('swms:notice-stu:read'),
          cmd: 'view'
        }
      ]
    }
  ]
}

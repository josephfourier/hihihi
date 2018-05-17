const openFormat = cellValue => {
  return ['否', '是'][+cellValue]
}

export default {
  query: {
    offset: 0,
    limit: 10,
    functionClass: '1',
    applyYear: new Date().getFullYear().toString(),
    studentCode: ''
  },
  columns: [
    {
      index: true,
      select: true
    },
    {
      label: '学号',
      prop: 'studentCode'
    },
    {
      label: '姓名',
      prop: 'studentName'
    },
    {
      label: '院系',
      prop: 'facultyName'
    },
    {
      label: '专业',
      prop: 'specialtyName'
    },
    {
      label: '班级',
      prop: 'className'
    },
    {
      label: '电话',
      prop: 'phone'
    },
    {
      label: '申请年份',
      prop: 'applyYear'
    }
  ],
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
          // render: (row) => { return hasPermission('swms:approvaltempate-set:create') },
          cmd: 'view'
        }
      ]
    }
  ],
  queryExport: {
    functionClass: '1',
    applyYear: '',
    studentCode: ''
  },
  header: ['学号', '姓名', '院系', '专业', '班级', '电话', '申请年份'],
  filter: ['studentCode', 'studentName', 'facultyName', 'specialtyName', 'className', 'phone', 'applyYear'],
  excelName: '助学金申请名单'
}

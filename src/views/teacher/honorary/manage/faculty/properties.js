import { dateFormat, hasPermission } from '@/utils'

const statusFormatALL = (cellValue) => {
  return ['可申请', '申请中'][+cellValue]
}
const statusFormatMY = (cellValue) => {
  return ['待审批', '已通过', '已拒绝', '审批中'][+cellValue]
}

export default {

  query: {
    offset: 0,
    limit: 10
  },
  optionsStatus: [
    {
      label: '待审批',
      value: 0
    }, {
      label: '已通过',
      value: 1
    }, {
      label: '已拒绝',
      value: 2

    }, {
      label: '审批中',
      value: 3
    }
  ],
  optionsYears: [
    {
      label: '2017年',
      value: 2017
    },
    {
      label: '2018年',
      value: 2018
    }
  ],
  columnsALL: [
    {
      index: true
    },
    {
      label: '荣誉称号名称',
      prop: 'honoraryName'
    }, {
      label: '人数限制',
      prop: 'numberLimit'
    }, {
      label: '开始时间',
      prop: 'startDate',
      formatter: dateFormat
    }, {
      label: '结束时间',
      prop: 'endDate',
      formatter: dateFormat
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
          render: row =>  row.applyStatus === '0' && hasPermission('swms:fachonorary-tea:create'),
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
      label: '荣誉称号名称',
      prop: 'honoraryName'
    }, {
      label: '人数限制',
      prop: 'numberLimit'
    }, {
      label: '开始时间',
      prop: 'startDate',
      formatter: dateFormat
    }, {
      label: '结束时间',
      prop: 'endDate',
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
  ],
  columnsMANAGE: [
    {
      index: true,
      select: true
    },
    {
      label: '申请人',
      prop: 'teacherName'
    }, {
      label: '院系名称',
      prop: 'facultyName'
    }, {
      label: '申请日期',
      prop: 'applyDate',
      formatter: dateFormat
    },
    {
      label: '荣誉称号名称',
      prop: 'honoraryName'
    }, {
      label: '申请年份',
      prop: 'applyYear'
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
          render: _ => hasPermission('swms:fachonorary-tea-manage:update'),
          cmd: 'view'
        },
        {
          label: '删除',
          render: row => row.dataStatus === '1' || row.dataStatus === '2' && hasPermission('swms:fachonorary-tea:delete'),
          cmd: 'delete'
        }
      ]
    }
  ],
  queryExport: {
    dataStatus: '',
    applyYear: ''
  },
  header: ['申请人', '院系名称', '申请日期', '荣誉称号名称', '申请年份', '状态'],
  filter: ['teacherName', 'facultyName', 'applyDate', 'honoraryName', 'applyYear', 'dataStatusName'],
  excelName: '院系荣誉称号'
}

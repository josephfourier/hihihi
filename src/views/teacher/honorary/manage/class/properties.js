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
    limit: 10,
    dataStatus: '',
    applyYear: new Date().getFullYear().toString()
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
          render: row =>  row.applyStatus === '0' && hasPermission('swms:clahonorary-tea:create'),
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
      label: '班级名称',
      prop: 'className'
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
          render: _ => hasPermission('swms:clahonorary-tea-manage:update'),
          cmd: 'view'
        },
        {
          label: '删除',
          render: row => hasPermission('swms:clahonorary-tea:delete') && (row.dataStatus === '1' || row.dataStatus === '2'),
          cmd: 'delete'
        }
      ]
    }
  ],
  queryExport: {
    dataStatus: '',
    applyYear: ''
  },
  header: ['申请人', '班级名称', '申请日期', '荣誉称号名称', '申请年份', '状态', '申请原因'],
  filter: ['teacherName', 'className', 'applyDate', 'honoraryName', 'applyYear', 'dataStatusName', 'applyReson'],
  excelName: '班级荣誉称号申请名单'
}

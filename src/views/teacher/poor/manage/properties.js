import { dateFormat, hasPermission } from '@/utils'

const statusFormat = (cellValue) => {
  return ['待审批', '已通过', '已拒绝', '审批中'][+cellValue]
}

export default {
  query: {
    offset: 0,
    limit: 10,
    facultyCode: '',
    applyYear: '',
    dataStatus: ''
  },
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

  columns: [
    {
      index: true,
      select: true
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
    }, {
      label: '班主任',
      prop: 'description'
    },
    {
      label: '学生姓名',
      prop: 'studentName'
    },
    {
      label: '手机号码',
      prop: 'phone'
    },
    {
      label: '申请日期',
      prop: 'applyDate',
      formatter: dateFormat
    },
    {
      label: '状态',
      prop: 'dataStatus',
      formatter: statusFormat
    },
    {
      label: '操作',
      operators: [
        {
          label: '查看',
          render: _ => hasPermission('swms:poor-tea:update'),
          cmd: 'view'
        }
      ]
    }
  ],
  queryExport: {
    facultyCode: '',
    applyYear: '',
    dataStatus: ''
  },
  header: ['院系', '专业', '班级', '班主任', '学生姓名', '手机号码', '申请日期', '家庭总人口', '家庭年收入', '人均月收入', '家庭困难类型', '家庭困难情况', '曾受资助情况', '状态'],
  filter: ['facultyName', 'specialtyName', 'className', 'gradHeadteacher', 'studentName', 'phone', 'applyDate', 'totalPopulation', 'annualIncome', 'pcmIncome', 'poorType', 'poorDescription', 'receivedFunding', 'dataStatus'],
  excelName: '困难生申请名单'
}

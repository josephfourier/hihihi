export default {
  query: {
    offset: 0,
    limit: 10,
    specialtyCode: '',
    enterYear: '',
    studentCode: ''
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
  columns: [
    {
      index: true,
      select: true
    }, {
      label: '学号',
      prop: 'studentCode'
    }, {
      label: '姓名',
      prop: 'studentName'
    }, {
      label: '院系',
      prop: 'facultyName'
    }, {
      label: '专业',
      prop: 'specialtyName'
    }, {
      label: '班级',
      prop: 'className'
    },
    {
      label: '家长电话',
      prop: 'familyPhone'
    }, {
      label: '入学年份',
      prop: 'enterYear'
    }
  ],
  queryExport: {
    specialtyCode: '',
    enterYear: '',
    studentCode: ''
  },
  header: ['学号', '姓名', '院系', '专业', '班级', '家长电话', '入学年份'],
  filter: ['studentCode', 'studentName', 'facultyName', 'specialtyName', 'className', 'familyPhone', 'enterYear'],
  excelName: '学生信息'
}

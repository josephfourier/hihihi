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
  //  ---------------- select初始化 ----------------
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
  ]
}

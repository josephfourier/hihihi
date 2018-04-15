export default {
  query: {
    offset: 0,
    limit: 10,
    specialtyCode: '',
    year: '',
    studentCode: '',
    facultyCode: ''
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
      label: '院系',
      prop: 'facultyName'
    }, {
      label: '专业',
      prop: 'specialtyName'
    }, {
      label: '班级',
      prop: 'className'
    }, {
      label: '班主任',
      prop: 'bzrName'
    }, {
      label: '班主任电话',
      prop: 'bzrPhone'
    },
    {
      label: '年级',
      prop: 'year'
    }
  ]
}

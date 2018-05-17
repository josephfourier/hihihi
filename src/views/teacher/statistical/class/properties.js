export default {
  query: {
    offset: 0,
    limit: 10,
    specialtyCode: '',
    year: new Date().getFullYear().toString(),
    studentCode: '',
    facultyCode: ''
  },
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
  ],
  queryExport: {
    specialtyCode: '',
    year: '',
    facultyCode: ''
  },
  header: ['院系', '专业', '班级', '班主任', '班主任电话'],
  filter: ['facultyName', 'specialtyName', 'className', 'bzrName', 'bzrPhone'],
  excelName: '班级信息'
}

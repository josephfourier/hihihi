const dateFormat = val =>  {
  if (!val) return
  const date = new Date(val)
  const m = date.getMonth() + 1
  const d = date.getDate() + 1
  return (
    date.getFullYear() +
    '-' +
    (m < 10 ? '0' + m : m) +
    '-' +
    (d < 10 ? '0' + d : d)
  )
}
const statusFormat = val => ['待审批', '已通过', '已拒绝', '审批中'][+val]
const honoraryTypeFormat = val => ['', '院系', '班级', '个人'][+val]
const scholarshipGrantWayFormat = val => ['', '每学期', '每月', '每年'][+val]
const politicsFormat = val => ['', '党员', '预备党员', '团员', '群众'][+val]

export default {
  dateFormat,
  statusFormat,
  honoraryTypeFormat,
  scholarshipGrantWayFormat,
  politicsFormat
}

const dateFormat = val =>  {
  if (!val) return
  const date = new Date(val)
  const m = date.getMonth() + 1
  const d = date.getDate()
  return (date.getFullYear() + '-' + (m < 10 ? '0' + m : m) + '-' + (d < 10 ? '0' + d : d))
}
const statusFormat = val => ['待审批', '已通过', '已拒绝', '审批中', '待确认', '待付款', '未缴费', '预缴费', '已缴费', '待退费', '已退费'][+val]

const honoraryTypeFormat = val => ['', '院系', '班级', '个人'][+val]
const scholarshipGrantWayFormat = val => ['', '每学期', '每月', '每年'][+val]
const politicsFormat = val => ['', '党员', '预备党员', '团员', '群众'][+val]
const poorTypeFormat = val => {
  if (!val) return
  const arr = val.split(',')
  return arr.map(i => {
    return ['', '单亲', '孤儿', '军烈属', '自然灾害', '父母患重病', '父母双下岗', '残疾人家庭', '其它'][i]
  }).join(',')
}
export default {
  dateFormat,
  statusFormat,
  honoraryTypeFormat,
  scholarshipGrantWayFormat,
  politicsFormat,
  poorTypeFormat
}

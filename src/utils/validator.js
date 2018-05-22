const isNumber = value => {
  if (isNaN(value)) { return false }
  return typeof value === 'number'
}
const isInteger = value => {
  if (typeof value === 'string' && value.trim() === '') return false
  if (typeof value === 'string' && value.indexOf(' ') > -1) return false
  value = +value
  return isNumber(value) && parseInt(value, 10) === value
}
const isFloat = value => {
  return isNumber(value) && !isInteger(value)
}
export default {
  isNumber,
  isInteger,
  isFloat
}

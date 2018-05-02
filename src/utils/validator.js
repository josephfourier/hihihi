const isNumber = value => {
  if (isNaN(value)) { return false }
  return typeof value === 'number'
}
const isInteger = value => {
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

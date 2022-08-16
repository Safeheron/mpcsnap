// 大写字母
const upperCaseLettersReg = /[A-Z]/
// 小写字母
const lowerCaseLettersReg = /[a-z]/

// 密码校验
export const isPasswordValid = (value: string) => {
  const valueLen = value.length
  const lenValid = valueLen >= 10
  const containsUpperCaseLetter = upperCaseLettersReg.test(value)
  const containsLowerCaseLetter = lowerCaseLettersReg.test(value)
  const containsNumber = /\d/.test(value)
  return (
    lenValid &&
    containsUpperCaseLetter &&
    containsLowerCaseLetter &&
    containsNumber
  )
}

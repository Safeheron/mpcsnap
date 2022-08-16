// All of these are defaults except singleQuote, but we specify them
// for explicitness
module.exports = {
  useTabs: false, // 使用空格制表符
  singleQuote: true, // 统一使用单引号
  semi: false, // 禁止使用末尾分号
  insertPragma: false, //不用@format标记
  trailingComma: 'es5', // 多行数组尾部逗号
  arrowParens: 'avoid', // 箭头函数尽可能不添加圆括号
};

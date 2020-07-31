exports.forEach = (options, callback) => {
  Object.values(options).forEach(option => {
    // 把循环的数据,传递给回调callback
    callback(option)
  })
}
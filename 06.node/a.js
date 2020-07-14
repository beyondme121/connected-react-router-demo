// module.exports = "hello"


let a = {
  name: 'sanfeng'
}

setTimeout(() => {
  a.name = 'xxx'
}, 1000)

module.exports = a 
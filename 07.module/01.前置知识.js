// 虚拟机模块, 在全局创建一个沙箱环境, 隔离作用域
const vm = require('vm')
var a = 99
vm.runInThisContext('console.log(77)')

eval('console.log(a)')

// node --inspect-brk xxx.js  在浏览器中断点调试

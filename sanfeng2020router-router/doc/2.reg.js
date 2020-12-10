let reg1 = '1a'.match(/\d[a-z][a-z]/)
console.log(reg1)
let reg2 = '1a'.match(/\d(?=[a-z])([a-z])/)
console.log(reg2) // [ '1a', 'a', index: 0, input: '1a', groups: undefined ]

console.log('1ab'.match(/1([a-z])([a-z])/))

console.log('1ab'.match(/\d(?:[a-z])([a-z])/))

console.log('1a'.match(/\d(?=[a-z])[a-z]/))

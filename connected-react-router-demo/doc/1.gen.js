function* foo (x) {
  yield x + 1
  yield x + 2
  yield x + 100
  return x + 3
}

let foogen = foo(10)

// 1. gen对象调用next方法, 手工判断返回结果对象中的done属性是否为false
console.log(foogen.next())
console.log(foogen.next())
console.log(foogen.next())
console.log(foogen.next())

console.log('-----------')
// 2. 使用 for ... of 
for (let g of foogen) {
  console.log(g)
}

function * next_id () {
  let id = 1
  while(true) {
    yield id++
  }
}

let gen = next_id()
console.log(gen)
console.log(gen.next())
console.log(gen.next())
console.log(gen.next())
console.log(gen.next())
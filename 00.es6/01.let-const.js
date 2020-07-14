let a = 100
{
  console.log(a)  // 作用域内查找变量，如果没有向上查找
  let a = 200     // a没有变量提升
}

for (var i = 0; i < 10; i++) {
  setTimeout(function () {
    console.log(i)
  });
}

for (var i = 0; i < 10; i++) {
  (function (i) {
    setTimeout(() => {
      console.log(i)
    });
  })(i)
}

for (let i = 0; i < 3; i++) {
  setTimeout(() => {
    console.log(i)
  });
}

// 
let obj1 = { name: 'zf' }
let obj2 = { age: 18, like: { name: 'pingpang' } }
let obj = { ...obj1, ...obj2 }
obj2.like.name = 'basketball'
console.log(obj)

let obj = { name: 'xxx', age: 18 }
console.log({ ...obj })

let newObj = Object.assign(obj)
console.log(newObj)


let obj = { name: 'sanfeng', age: 18, fn: () => { }, sex: undefined, xx: null, arr: [1, 2, [3, 4, [5, 6]]] }
// console.log(obj)

let newObj = JSON.parse(JSON.stringify(obj))
console.log(newObj)


function deepClone(obj) {
  if (obj == null) return obj     // null == undefined => true, 所以同时判断了undefined
  if (obj instanceof Date) return new Date(obj)
  if (obj instanceof RegExp) return new RegExp(obj)
  if (typeof obj !== 'object') return obj     // 不是对象类型, 不许哟啊深拷贝
  let newObj = new obj.constructor
  for (key in obj) {
    if (obj.hasOwnProperty(key)) {
      newObj[key] = deepClone(obj[key])
    }
  }
  return newObj
}
let obj = { age: 18, like: { name: 'pingpang' } }
let newObj = deepClone(obj)
obj.like.name = 'basketball'
console.log(newObj)
console.log(obj)
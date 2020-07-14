// let m = new WeakMap({ name: 'sanfeng' }, [1, 2, 3, 4])
// console.log(m)

let m = new WeakMap()
let obj = { name: 'sanfeng' }
let obj2 = { age: 18 }
m.set(obj, [1, 2, 3])
m.set(obj2, { sex: 'F', age: 99, like: 'hello' })
m.set(obj, "hello")
obj2 = null
console.log(m.get(obj))
console.log(m.get(obj2))
console.log(m)



const wm = new WeakMap()
let obj = { name: 'xxx' }
let obj2 = { age: 18 }
let obj3 = { likes: 'many' }
wm.set(obj, "hello")
wm.set(obj2, { name: 'sanfeng', age: 99 })
wm.set(obj3, ['pingpang', 'basket'])

// 获取
console.log(wm.get(obj))
console.log(wm.get(obj2))
console.log(wm.get(obj3))


// Map


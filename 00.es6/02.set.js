let set1 = new Set([1, 2, 3, 3, 2, 100])
console.log(set1)   // [1, 2,3]
console.log(typeof set1)    // object
// set1可迭代, 所以可以...set1
console.log([...set1])

set1.add(4)
set1.add(6)
console.log(set1)
set1.delete(6)
console.log(set1)

// set1.clear()
// console.log(set1)
// console.log(set1.keys())

let a1 = [1, 2, 3, 3, 2]
let a2 = [2, 4, 5, 6]

function union(a1, a2) {
  let s1 = new Set(a1)
  let s2 = new Set(a2)
  // Set对象可迭代
  return [...new Set([...s1, ...s2])]
}
console.log(union(a1, a2))

// 交集 遍历s1,看s2中的每一项是否有当前项
function intersaction(a1, a2) {
  return [...new Set(a1)].filter(item => new Set(a2).has(item))
  // 可能传入的数组
  // return [...new Set(s1)].filter(item => new Set(s2).has(item))
}
console.log(intersaction(a1, a2))


function chaji(a1, a2) {
  return [...new Set(a1)].filter(item => (!new Set(a2).has(item)))
}
console.log(chaji(a1, a2))
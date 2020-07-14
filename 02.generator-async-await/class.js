// class Test {
//   then() {
//     console.log('then...')
//   }
// }

// let a = new Test
// console.log(a instanceof Test)

// a.then()


// const obj = { '0': 'sanfeng', '1': 11, length: 2 }

// obj[Symbol.iterator] = function () {
//   let index = 0
//   return {
//     next: () => {
//       return {
//         value: this[index],
//         done: index++ === this.length
//       }
//     }
//   }
// }

// console.log([...obj])



// const p = new Promise((resolve, reject) => {
//   console.log(1)
//   resolve()
//   console.log(2)
// })

// p.then(() => {
//   console.log(3)
// })


// Promise.resolve(1).then(res => 2).catch(err => 3).then(res => console.log(res))

// console.log("======")
let p = Promise.resolve(1).then(x => x + 1).then(x => {
  // console.log('============', x)
  throw new Error('error')
}).catch(() => 1)
  .then(x => x + 1)
  .then(x => console.log(x))
  .catch(console.error)
// console.log(p)
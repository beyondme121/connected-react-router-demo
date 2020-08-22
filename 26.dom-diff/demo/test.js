// function regTrim(str) {
//   let leftArrow = []
//   let content = []
//   for (let i = 0; i < str.length; i++) {
//     let temp = str[i]
//     if (temp == '<') {
//       arrow.push(temp)
//       continue
//     } else if (temp == '>') {
//       leftArrow.pop()

//     } else {
//       content.push(str[i])
//     }
//   }
// }

// function getTrimStr(str) {
//   let strArr = str.split('')
//   let i = 0
//   let leftArrowIndex = 0
//   let lastLeftArrowIndex = 0
//   let final = ''
//   while ((i++ < str.length)) {
//     let current = str[i]
//     if (current == '>') {
//       lastLeftArrowIndex = str.substring(0,i).lastIndexOf('<')
//       final.concat(str.sub)
//     } else if (current == '<') {
//       leftArrowIndex
//     }
//   }
// }


function getTrimStr(str) {
  let strArr = str.split('')
  let lastLeft = 0
  for (let i = 0; i < strArr.length; i++) {
    if (strArr[i] == '>') {
      // 从后向前查找
      lastLeft = strArr.lastIndexOf('<', -(strArr.length - i))
      if (lastLeft != -1) {
        for (let j = lastLeft; j <= i; j++) {
          strArr[j] = null
        }
      }
    }
  }
  return strArr.filter(item => item != null).join('')
}

let str1 = '<123><456>4<5</456></123>' // 4<5
let str2 = 'ab<1b2>cd<a23>e></a23>';  // abcde>
// let str3 = 'ab<<<1b2>>>cd<a23>e></a23>';  // abcde>

let a = getTrimStr(str1)
let b = getTrimStr(str2)
// let c = getTrimStr(str3)
console.log(a)
console.log(b)
// console.log(c)
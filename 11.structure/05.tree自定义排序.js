// 存储的数据是可比较的, number或者对象中的属性可比较
// 希望存储的时候, 节点存left还是right由用户定义, 而不是使用类中默认的排序. 类似数组的sort方法


/* let arr = [2, 4, 6, 2, 1]
arr.sort((a, b) => { return b - a })
console.log(arr) */

// 思路: 初始化tree, 传入自定义函数, 如果没有传递, 使用类原型上的方法排序, 传入了, 使用自定义. 在比哪里
// 再添加add方法中调用这个比较函数

class Node {
  constructor(element, parent) {
    this.element = element
    this.parent = parent
    this.left = null
    this.right = null
  }
}

class BST {
  constructor(fn) {
    this.root = null
    this.size = 0
    this.compare = fn || this.compare
  }

  compare(x, y) {
    return x - y
  }

  add(element) {
    if (this.root == null) {
      this.root = new Node(element, null)
      this.size++
      return
    }
    let currentNode = this.root
    let parent, compare
    while (currentNode) {
      compare = this.compare(element, currentNode.element)
      parent = currentNode
      if (compare > 0) {
        currentNode = currentNode.right
      } else if (compare < 0) {
        currentNode = currentNode.left
      } else {
        currentNode.element = element
      }
    }
    let newNode = new Node(element, parent)
    if (compare > 0) {
      parent.right = newNode
    } else if (compare < 0) {
      parent.left = newNode
    } else {
      parent.element = element
    }
    this.size++
  }
}

// let bst = new BST((a, b) => {
//   return b - a
// });
// [2, 6, 4, 9, 10].forEach(item => bst.add(item))
// console.log(bst.root)

let arr = [
  { age: 39 },
  { age: 29 },
  { age: 49 },
  { age: 19 },
  { age: 9 },
]

let bst1 = new BST((a, b) => {
  return b.age - a.age
})

arr.forEach(item => bst1.add(item))
console.log(bst1.root, { depth: 100 })
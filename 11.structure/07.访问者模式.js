// 给一个函数A 传递一个对象或者函数B, A内部调用B函数, 把A所属的类内的数据传递给B
// 每次遍历都访问, 并可以操作数据

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
    let current = this.root
    let parent, compare
    while (current) {
      compare = this.compare(element, current.element)
      parent = current
      if (compare > 0) {
        current = current.right
      } else {
        current = current.left
      }
    }
    let newNode = new Node(element, parent)
    if (compare > 0) {
      parent.right = newNode
    } else {
      parent.left = newNode
    }
    this.size++
  }

  preOrder(visitor) {
    const travel = (node) => {
      if (node === null) return
      // console.log(node.element)
      visitor.visit(node.element)
      travel(node.left)
      travel(node.right)
    }
    travel(this.root)
  }
}

let bst = new BST((a, b) => {
  return a - b
});

// [8, 1, 3, 10, 2, 4, 5].forEach(item => bst.add(item))
[2, 6, 4, 9, 10].forEach(item => bst.add(item))
// console.log(bst.root)

bst.preOrder({
  visit(item) {
    console.log(item * 2)
  }
})
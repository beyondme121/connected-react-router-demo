// 二叉搜索树 没有索引, 有 root, 树中的节点个数

class Node {
  constructor(element, parent) {
    this.element = element
    this.parent = parent
  }
}

// 二叉搜索树
class BST {
  constructor() {
    this.root = null
    this.size = 0
    this.left = null
    this.right = null
  }

  // 增加节点,
  addError(ele) {
    // 树的初始化
    if (this.root == null) {
      this.root = new Node(ele, null)
      return this.size++
    }

    let root = this.root
    let compare = ele - root.element
    if (compare > 0) {
      this.right = new Node(ele, root)
    } else if (compare < 0) {
      this.left = new Node(ele, root)
    } else if (compare == 0) {
      root.element = ele
    }

    this.size++
    return this.root
  }

  // 先遍历, 不停的比较, 不停的变换初始比较节点
  add(element) {
    // 生成根节点
    if (this.root == null) {
      this.root = new Node(element, null)
      this.size++
      return;  // +
    }
    let currentNode = this.root
    // 存储比较的结果
    let compare
    let parent = currentNode
    while (currentNode) {
      compare = element - currentNode.element
      // 保留父节点
      parent = currentNode
      if (compare > 0) {
        currentNode = currentNode.right
      } else if (compare < 0) {
        currentNode = currentNode.left
      } else {
        currentNode.element = element
      }
    }
    // 当while结束, currentNode就是null, 因为不再进入while循环了,那么新增的节点, 需要插入到最后一个可以找到的叶子节点
    // 每次遍历都要记录一下 parent
    if (compare > 0) {
      parent.right = new Node(element, parent)
    } else if (compare < 0) {
      parent.left = new Node(element, parent)
    }
    // return this.root   // -
    this.size++           // +
  }
}

let bst = new BST();
[2, 6, 4, 9, 10].forEach(item => bst.add(item))
console.log(bst.root)

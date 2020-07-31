// 二叉搜索树
class Node {
  constructor(element, parent) {
    this.parent = parent; // 父节点
    this.element = element; // 当前存储内容
    this.left = null; // 左子树
    this.right = null; // 右子树
  }
}
class BST { // binary search tree
  constructor(compare) {
    this.root = null; // 树根
    this.size = 0; // 树中的节点个数
    this.compare = compare || this.compare;
  }
  compare(a, b) {
    return a - b;
  }
  add(element) { // ast 遍历方法， 访问到节点 ， 树的反转
    if (this.root == null) {
      this.root = new Node(element, null);
      this.size++;
      return;
    }
    // 获取根节点 用当前添加的进行判断 放左边还是右边
    let currentNode = this.root;
    let parent = null;
    let compare;
    while (currentNode) {
      compare = this.compare(element, currentNode.element);
      parent = currentNode; // 先将父亲保留起来
      if (compare > 0) {
        currentNode = currentNode.right;
      } else if (compare < 0) {
        currentNode = currentNode.left;
      } else {
        currentNode.element = element; // 相等时先覆盖后续处理
      }
      // currentNode 要不停的发生变化
    }
    let newNode = new Node(element, parent);
    if (compare > 0) {
      parent.right = newNode;
    } else if (compare < 0) {
      parent.left = newNode;
    }
    this.size++;
  }

  // 深度遍历 -> 前序遍历
  preOrderTraversal() {
    // 递归
    const traversal = (node) => {
      if (node == null) return
      console.log(node.element)
      traversal(node.left)
      traversal(node.right)
    }
    traversal(this.root)
  }
  inOrderTraversal() {
    const traversal = (node) => {
      if (node == null) return
      traversal(node.left)
      console.log(node.element)
      traversal(node.right)
    }
    traversal(this.root)
  }
  postOrderTraversal() {
    const traversal = (node) => {
      if (node === null) return
      traversal(node.left)
      traversal(node.right)
      console.log(node.element)
    }
    traversal(this.root)
  }
}
// 1.二叉搜索树存储的数据必须有可比较性  
// let bst = new BST((a, b) => { // 模拟sort 方法，如果需要按照自己的逻辑进行存储 需要提供一个方法
//   return b.age - a.age;
// });
// [{ age: 10 }, { age: 8 }, { age: 19 }, { age: 6 }, { age: 15 }, { age: 22 }, { age: 20 }].forEach(item => bst.add(item));
// console.log(bst.root)

// 数据存储到了二叉搜索树 得需要获取
// 遍历树的方式有


let bst1 = new BST((a, b) => { // 模拟sort 方法，如果需要按照自己的逻辑进行存储 需要提供一个方法
  return a.age - b.age;
});
[{ age: 10 }, { age: 8 }, { age: 19 }, { age: 6 }, { age: 15 }, { age: 22 }, { age: 20 }].forEach(item => bst1.add(item));
// console.log(bst1.root)
bst1.preOrderTraversal()
// bst1.inOrderTraversal()
bst1.postOrderTraversal()
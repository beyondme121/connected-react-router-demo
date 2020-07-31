// 链表的反转
// 链表由节点Node组成, 每个节点记录着数据还有下一个节点的引用
// linklist 还head, size 等重要属性

class Node {
  constructor(data, next) {
    this.data = data
    this.next = next
  }
}

// 链表的CRUD
class LinkedList {
  constructor() {
    this.head = null
    this.size = 0
  }
  // 添加元素
  // 1. 头部添加 2. 中间插入 3. 入参是一个, 方法的重载, LinkedList最后加入
  add(index, element) {
    // 先判断参数个数, 修改局部变量的值, 程序继续向下执行, index> 0就会遍历链表, 插入
    if (arguments.length == 1) {
      element = index
      index = this.size
    }

    if (index < 0 || index > this.size) throw new Error('越界')
    this.size++

    // 头部插入
    if (index == 0) {
      let head = this.head
      this.head = new Node(element, head)
    } else {
      // 中间插入 需要遍历 O(n), 从头部head开始遍历, 找到指定的位置的前一项
      let current = this.head
      for (let i = 0; i < index - 1; i++) {
        current = current.next
      }
      // new Node(element, current.next)  // 新节点的next指向原链表的前一个节点的next
      // 
      current.next = new Node(element, current.next)  //前一个节点的next指向新node
    }
  }

  // 根据索引找到前一项, 让前一项的next指向next.next
  remove(index) {
    if (index < 0 || index >= this.size) throw new Error('越界')
    this.size--
    // 如果是head,
    if (index == 0) {
      let head = this.head
      this.head = this.head.next
      head.next = null    // 只返回删除的节点
      return head
    } else {
      let current = this.head
      for (let i = 0; i < index - 1; i++) {
        current = current.next
      }
      let returnValue = current.next
      current.next = current.next.next
      console.log("returnValue:", returnValue)
      return returnValue
    }
  }

  get(index) {
    if (index < 0 || index >= this.size) throw new Error('...')
    let current = this.head
    for (let i = 0; i < index; i++) {
      current = current.next
    }
    return current
  }
  // 递归反转 -> 递归要满足一定的条件 ==> 1. 内部函数 2. 边界条件
  reverseCursor() {
    function reverse(node) {
      // node == null: 传入的就是一个空列表
      // node.next == null: 链表只有一个节点
      if (node == null || node.next == null) return node
      // 递归调用, 传入node的下一个节点, 调用多次, 找到的就是最后一个节点
      let newHead = reverse(node.next)
      // 下面是递归的逻辑, 递归完了做点什么
      // 边界条件返回的是node, 不是node.next, 拿两个节点思考, 1, 2: 1有next, 继续向后, 把node.next => 即2传入reverse()中, 发现2的next为null, 返回node, 此时的node是1
      // 即当前返回的node是链表的倒数第二个节点
      node.next.next = node
      node.next = null
      // 把反转后的, 原来链表最后一个节点串成的链表 作为头head进行返回
      return newHead
    }
    // 入参: 原链表的头, 返回值: 新链表
    this.head = reverse(this.head)
    return this.head
  }
  // 非递归反转: 设置一个新链表, 把原链表一个个拿出来,放到新链表中
  reverse() {
    // 新链表, 头为null
    let newHead = null
    // 拿出原链表一个节点
    let node = this.head
    newHead = node
    while (node) {

    }
  }
}


let ll = new LinkedList();

ll.add(1);
ll.add(2);
ll.add(3);
ll.add(4);
console.dir(ll, { depth: 1000 });

console.dir(ll.reverseCursor(), { depth: 1000 })
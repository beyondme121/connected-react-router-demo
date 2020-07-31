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
}


// 使用链表模拟队列
// 先进先出
class Queue {
  constructor() {
    this.q = new LinkedList()
  }
  // 添加总是从默认追加
  offer(element) {
    this.q.add(element)
  }

  // 查看队列的头节点
  peek() {
    return this.q.get(0)
  }

  // 队列的删除总是从队列的开头删除
  remove() {
    return this.q.remove(0)
  }

}
console.log("========= queue ==========")
let q = new Queue()
q.offer(1)
q.offer(2)
// q.offer(3)
// console.log(q)
// console.log('1. -->', q.peek())
console.log('2. -->', q.remove())   // 删除会返回
console.log(q.peek())
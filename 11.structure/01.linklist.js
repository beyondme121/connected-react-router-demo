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
      this.head = this.head.next
    } else {
      let current = this.head
      for (let i = 0; i < index - 1; i++) {
        current = current.next
      }
      current.next = current.next.next
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

let ll = new LinkedList
ll.add(0, 1)
ll.add(1, 2)
ll.add(2, 3)
ll.add(0, 100)
ll.add(1, 200)
ll.add(1000)
// ll.add(1000, 900)    // 越界
// [100,200,1,2,3]
ll.remove(0)
ll.remove(1)

// [200,2,3]
console.dir(ll, { depth: 100 })
let getNode = ll.get(2)
console.log('getNode:', getNode)
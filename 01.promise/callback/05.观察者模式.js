// 观察者模式: 被观察者(对象)的状态或叫数据发生了变更, 会通知观察者触发操作(update或者其他什么函数)
// 发布订阅: 订阅 和 发布没有必然的关系, 订阅了不一定发布, 你订阅你的, 我可以永远不发布, 比如对DOM元素绑定点击事件, 就是订阅; 但是我可以永远不点击,也就是不发布,不触发


// 被观察者 baby
class Subject {
  constructor(name) {
    this.name = name
    // 记录谁观察了我
    this.observer = []
    this.state = {}
  }

  // 保存观察者
  attach(observer) {
    this.observer.push(observer)
  }

  // 被观察者修改状态数据的方法, 实例方法
  setState(newState) {
    this.state = newState
    this.observer.forEach(ob => {     // 箭头函数
      ob.update(this)       // this就是被观察者的实例, Observer就可以通过this获取name属性
    })
  }
}

class Observer {
  constructor(name) {
    this.name = name
  }
  // 观察者做点什么, 对被观察者做点什么 --> 数据(state)的更新, 要更新DOM, 把被观察者更新到DOM上, 自动触发 就是 this.observer.forEach(...)
  update(subject) {
    console.log("观察者: ", this.name, ' 知道了 ', '被观察者: ', subject.name, ' 的状态是 ', subject.state)
  }
}

let baby = new Subject('小baby')
let father = new Observer('father')
let mother = new Observer('mother')

baby.attach(father)
baby.attach(mother)

baby.setState('happy')
baby.setState('sad')


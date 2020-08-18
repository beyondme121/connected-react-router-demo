import { arrayMethods } from "./array"
import { definePropertyWithoutEnumerable } from "../utils"
import Dep from "./dep"


class Observer {
  constructor(value) {
    definePropertyWithoutEnumerable(value, '__ob__', this)  // this: Observer实例
    // value.__ob__ = this

    // 如果是数组, 不观测每一项
    if (Array.isArray(value)) {
      // value如果是数组, 继承指向重新的数组方法，通过原型链继承
      value.__proto__ = arrayMethods
      this.observeArray(value)
    } else {
      this.walk(value)
    }
  }

  // 观测数组中的每一项, 如果是对象就进行观测
  observeArray(value) {
    value.forEach(item => {
      // 观测数组中的对象类型
      observe(item)
    })
  }

  walk(data) {
    let keys = Object.keys(data)
    keys.forEach(key => {
      defineReactive(data, key, data[key])
    })
  }
}

function defineReactive(data, key, value) {
  // 递归观察data嵌套的对象
  observe(value)
  // 每个属性一个dep
  let dep = new Dep()

  Object.defineProperty(data, key, {
    get() {
      if (Dep.target) {
        dep.depend()
      }
      return value
    },
    set(newValue) {
      if (newValue === value) return
      console.log('数据设置了')
      // 如果给data属性设置一个对象,设置的对象也需要进行观测
      observe(newValue)
      value = newValue

      // 数据变更, 通知dep中的所有watcher调用自己的更新
      dep.notify()
    }
  })
}

// 观测数据的变化, 更新视图
export function observe(data) {
  if (data.__ob__) {
    return data
  }
  // 只观测对象或数组
  if (typeof data !== 'object' || data == null) {
    return
  }
  // 使用类的方式: 1. 可以清楚的知道这个属性是哪个类的实例 2. 观测数据的功能是高内聚的
  return new Observer(data)
}
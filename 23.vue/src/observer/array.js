// 拿到Array的原型对象
let oldArrayProtoMethods = Array.prototype

// 根据Array的原型创建对象
export let arrayMethods = Object.create(oldArrayProtoMethods)

// 需要重写数组的方法(可以改变数组的方法)
let methods = [
  'push',
  'pop',
  'shift',
  'unshift',
  'reverse',
  'sort',
  'splice'
]

methods.forEach(method => {
  // 重新定义数组的方法, 重写上面的7个方法
  arrayMethods[method] = function (...args) {
    // 切面编程: 做点特殊的事情之后, 再调用原本执行的方法
    // console.log('数组方法重写了，更新视图')
    // 原本的方法执行
    const result = oldArrayProtoMethods[method].apply(this, arguments)
    let inserted;
    let ob = this.__ob__    // 通过属性的__ob__属性可以拿到Observer实例, 通过实例可以拿到实例方法
    // 监控新增对象
    switch (method) {
      case 'push':
      case 'unshift':   // 这两个方法都是追加 追加的内容可能是对象类型，应该被再次进行劫持
        inserted = args
        break;
      case 'splice':
        inserted = args.slice(2)  // arr.splice(0, 1, {a: 100}) // 数组下标0的位置 删除1个, 并用对象{a: 100}填补这个位置 => 新增
      default:
        break;
    }
    // 将观测对象的方法, 挂载到实例的属性__ob__上
    // if (inserted) ob.observeArray(inserted)
    if (inserted) {
      ob.observeArray(inserted)
    }
    return result
  }
})
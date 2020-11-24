import { updateQueue } from './Component'
// 作用于元素的属性
export function addEvent(dom, eventType, listener) {
  // debugger
  // 合成事件
  let store = dom.store || (dom.store = {}) // 给dom上挂一个store, 默认空对象
  store[eventType] = listener // 设置监听
  document.addEventListener(eventType.slice(2), dispatchEvent, false)
}
let syntheticEvent = {}
// 事件委托给此函数, 可以前后加逻辑 比如批量更新操作
/**
 *
 * @param {*} event  原生的事件对象
 * 主要目的:
 * 1. 执行监听函数: 通过event事件对象, 找到事件类型, 根据事件类型, 找到dom上的store对应的监听事件listener，执行这个监听
 * 2. 在监听函数前后执行批量操作处理
 *
 */
function dispatchEvent(event) {
  let { type, target } = event
  // 触发事件
  let eventType = `on${type}`
  updateQueue.isBatchingUpdate = true
  let syntheticEvent = createSyntheticEvent(event)
  // 事件冒泡
  while (target) {
    let { store } = target // target 就是dom, dom上有store属性, 在addEvent上添加的"钩子",在其他的地方进行使用
    let listener = store && store[eventType] // 获取监听
    listener && listener.call(target, syntheticEvent) // listener就是组件中用户定义的事件处理函数 比如 handleClick, 参数就是event
    // 向上查找
    target = target.parentNode
  }
  // 清空对象syntheticEvent全局的
  for (let key in syntheticEvent) {
    syntheticEvent[key] = null
  }
  // 批量执行所有的更新器
  updateQueue.batchUpdate()
}

// 创建一个单例的合成事件,将DOM原生的事件对象的属性赋值给该对象, 在dispatchEvent使用之后再销毁
function createSyntheticEvent(nativeEvent) {
  for (let key in nativeEvent) {
    syntheticEvent[key] = nativeEvent[key]
  }
  return syntheticEvent
}

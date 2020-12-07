import { createDOM, compareTwoVdom } from './react-dom'
import { isFunction } from './utils'
// 更新队列 是个整体, 每次的更新器
export let updateQueue = {
  updaters: new Set(),
  isBatchingUpdate: false, // 批量更新(异步)
  add(updater) {
    this.updaters.add(updater) // 相同的updater只会加入一次 使用了Set
  },
  // 批量更新(react可以控制的事件,生命周期)
  batchUpdate() {
    this.updaters.forEach((updater) => updater.updateComponent())
    this.isBatchingUpdate = false
    this.updaters.clear()
  },
}

// 更新器中才包含着要更新的状态
class Updater {
  constructor(classInstance) {
    this.classInstance = classInstance
    this.pendingState = []
  }
  addState(partialState) {
    this.pendingState.push(partialState)
    this.emitUpdate()
    // updateQueue.isBatchingUpdate
    //   ? updateQueue.add(this)
    //   : this.updateComponent()
  }
  emitUpdate() {
    updateQueue.isBatchingUpdate
      ? updateQueue.add(this)
      : this.updateComponent()
  }
  updateComponent() {
    let { classInstance, pendingState } = this
    if (pendingState.length > 0) {
      // 获取最新的状态, 替换老的状态
      // classInstance.state = this.getState()
      // classInstance.forceUpdate()
      this.shouldUpdate(classInstance, this.getState()) // 是否要更新(组件实例,合并后的状态 传递进来)
    }
  }

  shouldUpdate(classInstance, nextState) {
    classInstance.state = nextState
    // 明确指出是否不更新,
    if (
      classInstance.shouldComponentUpdate &&
      !classInstance.shouldComponentUpdate(classInstance.props, nextState) // 执行并返回false, 就不更新了 否则更新组件
    ) {
      classInstance.state = nextState
      return
    }
    // hook
    if (classInstance.componentWillUpdate) {
      classInstance.componentWillUpdate()
    }
    classInstance.forceUpdate()
  }

  getState() {
    let { classInstance, pendingState } = this
    let { state } = classInstance
    if (pendingState.length) {
      pendingState.forEach((nextState) => {
        if (isFunction(nextState)) {
          nextState = nextState.call(classInstance, state) // this.setState(state => ({xxx: state.xxx + 1}))
        }
        state = { ...state, ...nextState }
      })
      pendingState.length = 0
    }
    return state
  }
}

class Component {
  static isReactComponent = true
  constructor(props) {
    this.props = props
    this.state = {}
    this.updater = new Updater(this)
  }

  setState(partialState) {
    // debugger
    this.updater.addState(partialState)
  }

  forceUpdate() {
    if (this.componentWillUpdate) {
      this.componentWillUpdate()
    }
    let newVdom = this.render()
    // dom-diff: 是react-dom中处理的责任, 最终挂载
    let currentVdom = compareTwoVdom(
      this.oldVdom.dom.parentNode,
      this.oldVdom,
      newVdom
    )
    this.oldVdom = currentVdom
    if (this.componentDidUpdate) {
      this.componentDidUpdate(this.props, this.state)
    }

    // updateClassComponent(this, renderVdom)
  }
}

// function updateClassComponent(classInstance, newVdom) {
//   let oldDOM = classInstance.dom
//   let newDOM = createDOM(newVdom)
//   oldDOM.parentNode.replaceChild(newDOM, oldDOM)
//   if (classInstance.componentDidUpdate) {
//     classInstance.componentDidUpdate()
//   }
//   classInstance.dom = newDOM
// }

export default Component

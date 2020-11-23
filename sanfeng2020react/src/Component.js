import { createDOM } from './react-dom'
class Component {
  static isClassComponent = true
  constructor(props) {
    this.props = props
    this.state = {}
  }

  setState(partialState) {
    // 1. 合并最新的状态
    this.state = { ...this.state, ...partialState }
    // 2. 调用子类的render方法 返回新的VDOM
    let renderVdom = this.render()
    // 3. 根据虚拟DOM，更新类组件
    updateClassComponent(this, renderVdom)
  }
}

function updateClassComponent(instance, newVdom) {
  let oldDOM = instance.dom
  let newDOM = createDOM(newVdom)
  oldDOM.parentNode.replaceChild(newDOM, oldDOM)
  instance.dom = newDOM
}

export default Component

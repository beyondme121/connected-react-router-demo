import { addEvent } from './events'

function render(vdom, container) {
  let dom = createDOM(vdom)
  if (dom) container.appendChild(dom)
}

export function createDOM(vdom) {
  if (typeof vdom === 'string' || typeof vdom === 'number') {
    return document.createTextNode(vdom)
  }
  if (!vdom) {
    return ''
  }
  let { type, props, ref } = vdom
  let dom
  // 1. 判断虚拟DOM的类型, 原生DOM, 函数组件，类组件等
  if (typeof type === 'function') {
    return type.isClassComponent
      ? updateClassComponent(vdom)
      : updateFunctionComponent(vdom)
  } else {
    dom = document.createElement(type)
  }
  // 2. 创建完元素, 更新属性 更新新创建的DOM标签的属性
  updateProps(dom, {}, props)

  // 3. 处理子节点
  if (
    typeof props.children === 'string' ||
    typeof props.children === 'number'
  ) {
    dom.textContent = props.children
  } else if (typeof props.children === 'object' && props.children.type) {
    render(props.children, dom)
  } else if (Array.isArray(props.children)) {
    reconcileChildren(props.children, dom)
  } else {
    dom.textContent = props.children ? props.children.toString() : ''
  }
  if (ref) ref.current = dom
  vdom.dom = dom
  return dom
}

// 更新属性以及事件绑定
function updateProps(dom, oldProps, newProps) {
  for (let key in newProps) {
    if (key === 'children') continue
    if (key === 'style') {
      let style = newProps[key] // 样式的值 color: 'red', fontSize: '16px'
      for (let attr in style) {
        dom.style[attr] = style[attr]
      }
    } else if (key.startsWith('on')) {
      // dom[key.toLocaleLowerCase()] = props[key]   这种方式是将事件绑定给当前的DOM元素了
      addEvent(dom, key.toLowerCase(), newProps[key])
    } else {
      dom[key] = newProps[key]
    }
  }
}

function reconcileChildren(childrenVdom, parentDOM) {
  childrenVdom.forEach((childVdom) => render(childVdom, parentDOM))
}

function updateFunctionComponent(vdom) {
  let { type, props } = vdom
  let renderVdom = type(props)
  return createDOM(renderVdom)
}

// 类组件渲染
function updateClassComponent(vdom) {
  let { type, props } = vdom
  let classInstance = new type(props) // new Counter, 调用构造函数
  vdom.classInstance = classInstance //让虚拟DOM的classInstance=类组件实例 TODO
  // 1. willMount
  if (classInstance.componentWillMount) {
    classInstance.componentWillMount()
  }
  // 2. 生命周期的render执行 step2
  let renderVdom = classInstance.render()
  let dom = createDOM(renderVdom)
  // renderVdom.dom = dom
  vdom.dom = renderVdom.dom = dom
  classInstance.oldVdom = renderVdom
  classInstance.dom = dom
  // didMount
  if (classInstance.componentDidMount) {
    classInstance.componentDidMount()
  }
  return dom
}

export function compareTwoVdom(parentNode, oldVdom, newVdom) {}

let ReactDOM = {
  render,
}

export default ReactDOM

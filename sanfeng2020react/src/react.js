import Component from './Component'
/**
 *
 * @param {*} type 元素的类型 可能是一个字符串(原生组件),也可能是一个组件(函数)
 * @param {*} config 配置对象,一般来说就是属性对象
 * @param {*} children 第一个儿子
 */
function createElement(type, config, children) {
  let ref
  if (config) {
    delete config._owner
    delete config._store
    ref = config.ref
    delete config.ref
  }
  let props = { ...config }
  if (arguments.length > 3) {
    children = Array.prototype.slice.call(arguments, 2)
  }
  //children可能是数组(多于1个儿子),也可能是一个字符串或者数字,也可能是一个null,也可能是一个react元素
  props.children = children
  return {
    //React元素,也就是虚拟DOM type是元素类型 props元素的属性 vdom
    type,
    props,
    ref,
  }
}
function createRef() {
  return { current: null }
}

// 创建上下文
function createContext() {
  let context = { _currentValue: null }

  function Provider(props) {
    context._currentValue = props.value
    return props.children
  }
  function Consumer(props) {
    return props.children(context._currentValue)
  }
  context.Provider = Provider
  context.Consumer = Consumer
  return context
}

let React = {
  createElement,
  Component,
  createRef,
}
export default React

/**
let element = React.createElement("h1", {
  className: "title",
  style: {
    color: 'red'
  }
}, React.createElement("span", null, "hello"), "world");
{
  "type": "h1",
  "props": {
    "className": "title",
    "style": {
      "color": "red"
    },
    "children": [
      {
        "type": "span",
        "props": {
          "children": "hello"
        }
      },
      "world"
    ]
  }
}
 */

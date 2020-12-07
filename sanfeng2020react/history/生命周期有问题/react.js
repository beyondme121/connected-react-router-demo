import Component from './Component'

function createElement(type, config, children) {
  let ref
  if (config) {
    delete config.__source
    delete config._self
    ref = config.ref
  }
  let props = { ...config }
  if (arguments.length > 3) {
    children = Array.prototype.slice.call(arguments, 2)
  }
  props.children = children
  return {
    type,
    props,
    ref, // 同级别的属性, ref在VDOM上
  }
}

function createRef() {
  return { current: null }
}

let React = {
  createElement,
  Component,
  createRef,
}

export default React

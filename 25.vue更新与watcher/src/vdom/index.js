export function renderMixin(Vue) {
  // 生成虚拟DOM
  // _c(div, {id:"app",style:{"color":"red"}} ,_c(p, undefined ,_v("hello world zf"+_s(school.name))))
  Vue.prototype._c = function () {  // 创建虚拟dom元素
    return createElement(...arguments)
  }

  // 创建虚拟dom文本元素
  Vue.prototype._v = function (text) {
    return createTextVnode(text);
  }
  // stringify
  Vue.prototype._s = function (val) {
    // console.log('_s: val', val, typeof val)
    return val === null ? '' : typeof val === 'object' ? JSON.stringify(val) : val
  }
}

// 其实还是根据ast对象树 生成vdom
function createElement(tag, data = {}, ...children) {
  return vnode(tag, data, data.key, children)
}

function createTextVnode(text) {
  return vnode(undefined, undefined, undefined, undefined, text)
}

// 用来产生虚拟dom的
function vnode(tag, data, key, children, text) {
  return {
    tag, data, key, children, text
  }
}
import { isReservedTag } from "../utils";

export function renderMixin(Vue) {
  // 生成虚拟DOM
  // _c(div, {id:"app",style:{"color":"red"}} ,_c(p, undefined ,_v("hello world zf"+_s(school.name))))
  Vue.prototype._c = function () {  // 创建虚拟dom元素
    return createElement(this, ...arguments)
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
function createElement(vm, tag, data = {}, ...children) {

  if (isReservedTag(tag)) {
    return vnode(tag, data, data.key, children)
  } else {
    // 创建组件的虚拟节点
    // 1. 先拿到组件的构造函数
    let Ctor = vm.$options.components[tag]
    console.log("Ctor: ", Ctor)
    // 创建组件的虚拟节点
    return createComponent(vm, tag, data, data.key, children, Ctor)
  }

}


function createComponent(vm, tag, data, key, children, Ctor) {
  debugger
  const baseCtor = vm.$options._base;
  if (typeof Ctor == 'object') {
    Ctor = baseCtor.extend(Ctor)

  }
  // 给组件增加生命周期  组件初始化，更新
  data.hook = {
    init(vnode) {
      let child = vnode.componentInstance = new Ctor({})

      // child.$mount()// 挂载逻辑 组件的$mount方法中是不传递参数的 
      // vnode.componentInstance.$el 指代的是当前组件的真实dom
    }
  }
  // Ctor.cid是子类的 组件的children就是插槽slot, text为空, 给组件传入一个特殊的对象 { Ctor, children }
  return vnode(`vue-component-${Ctor.cid}-${tag}`, data, key, undefined, undefined, { Ctor, children })
}


function createTextVnode(text) {
  return vnode(undefined, undefined, undefined, undefined, text)
}

// 用来产生虚拟dom的
function vnode(tag, data, key, children, text, componentOptions) {
  return {
    tag, data, key, children, text, componentOptions // 组件的虚拟节点他多了一个componentOptions属性 用来保存当前组件的构造函数和他的插槽
  }
}
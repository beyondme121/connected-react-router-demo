// 返回值是真实DOM, 调用处lifecycle.js中 赋值给了vue实例的$el属性上，保存着DOM
export function patch(oldVNode, vnode) {
  // ------------------- 处理初渲染流程，直接用初始VDOM 替换掉 原始DOM节点(#app)
  // 默认初始化时，时直接用虚拟节点创建出真实的DOM节点，替换掉老的DOM节点
  if (oldVNode.nodeType === 1) { // html dom 固有的属性, =1 表示是元素
    // debugger
    let el = createElm(vnode)   // 产生真实的dom 
    let parentElement = oldVNode.parentNode;  // 获取老的app的父亲 =》 body
    parentElement.insertBefore(el, oldVNode.nextSibling) // 当前的真实元素插入到app的后面
    parentElement.removeChild(oldVNode) // 删除老的节点
    return el // 把创建的DOM返回
  } else {
    // ------------------- 处理更新流程, 两个虚拟DOM的比较 -------------------
    // 在更新时，拿老的虚拟节点 和 新的虚拟节点进行比较，将差异更新为真实的DOM

    // 1. 比较标签
    if (oldVNode.tag !== vnode.tag) {
      return oldVNode.el.parentNode.replaceChild(createElm(vnode), oldVNode.el)
    }

    // 2. 比较文本(因为文本的tag是undefined, 走到这里说明新老tag是一样相等的)
    // 标签一样，标签没有子元素，标签只有文本, 文本不同时的处理 <div>1</div>  <div>2</div>
    if (!oldVNode.tag) {
      // 如果文本不一致, 用vnode的text属性值更新 老的虚拟DOM上的el属性所代表的老的DOM节点的文本内容
      if (oldVNode.text !== vnode.text) {
        return oldVNode.el.textContent = vnode.text
      }
    }

    // 3. 对比属性: 标签相同, 复用老节点，然后 比较标签的属性
    // 3.1 复用老节点，给新的虚拟node添加el属性
    let el = vnode.el = oldVNode.el
    // 3.2 比较属性并更新. 使用新的vnode作为参数, 原因是要把其作为整体传递过去, 要使用到最新的DOM节点的标签元素 el
    updateProperties(vnode, oldVNode.data)

    // 4. 对比儿子
    let oldChildren = oldVNode.children || []   // 也是虚拟DOM
    let newChildren = vnode.children || []

    if (oldChildren.length > 0 && newChildren.length > 0) {
      // 更新儿子节点, 两个虚拟节点的儿子数组, dom元素
      updateChildren(oldChildren, newChildren, el)
    } else if (oldChildren.length > 0) { // 老的有儿子，新的没有儿子
      el.innerHTML = ''
    } else if (newChildren.length > 0) { // 新的有儿子，老的没有 => 创建并插入节点
      for (let i = 0; i < newChildren.length; i++) {
        // 浏览器有性能优化 不用自己在搞文档碎片了
        el.appendChild(createElm(newChildren[i]))
      }
    }


  }
}

// 比较两个vnode, 相同元素 + key
function isSameVNode(oldVnode, newVnode) {
  return (oldVnode.tag === newVnode.tag) && (oldVnode.key == newVnode.key)
}

// 
function updateChildren(oldChildren, newChildren, parent) {
  // 老的vnode
  let oldStartIndex = 0;
  let oldStartVnode = oldChildren[0]
  let oldEndIndex = oldChildren.length - 1
  let oldEndVnode = oldChildren[oldEndIndex]

  // 新的vnode
  let newStartIndex = 0;
  let newStartVnode = newChildren[0]
  let newEndIndex = newChildren.length - 1
  let newEndVnode = newChildren[newEndIndex]

  // 生成key-index的映射表
  function makeIndexByKey(children) {
    let map = {}
    children.forEach((child, index) => {
      if (child.key) {
        map[child.key] = index
      }
    })
    return map
  }
  let map = makeIndexByKey(oldChildren)


  // 遍历两个数组 包含着虚拟节点, 只要一个循环完, 就结束
  while (oldStartIndex <= oldEndIndex && newStartIndex <= newEndIndex) {
    // 如果老的数组中的元素是null
    if (oldStartVnode == null) {
      oldStartVnode = oldChildren[++oldStartIndex]
    }
    // 从头向尾 遍历比较
    if (isSameVNode(oldStartVnode, newStartVnode)) {
      // 如果tag相同, 更新属性, 指针向后移动一个
      patch(oldStartVnode, newStartVnode)
      oldStartVnode = oldChildren[++oldStartIndex]
      newStartVnode = newChildren[++newStartIndex]
    } else if (isSameVNode(oldEndVnode, newEndVnode)) {
      // 从头到尾对比失败, 就从后向前比较
      patch(oldEndVnode, newEndVnode)
      oldEndVnode = oldChildren[--oldEndIndex]
      newEndVnode = newChildren[--newEndIndex]
    } else if (isSameVNode(oldStartVnode, newEndVnode)) {
      // 3. 老的头元素 与 新的 尾部 比较
      patch(oldStartVnode, newEndVnode)
      parent.insertBefore(oldStartVnode.el, oldEndVnode.el.nextSibling)
      oldStartVnode = oldChildren[++oldStartIndex]
      newEndVnode = newChildren[--newEndIndex]
    } else if (isSameVNode(oldEndVnode, newStartVnode)) {
      // 4. 老的尾 和 新的头
      patch(oldEndVnode, newStartVnode)
      parent.insertBefore(oldEndVnode.el, oldStartVnode.el)
      oldEndVnode = oldChildren[--oldEndIndex]
      newStartVnode = newChildren[++newStartIndex]
    } else {
      // 儿子之间没有关系, 用新的数组去查找映射关系
      // 1. 从新的数组中一个个查找, 找到新数组中的元素在老的数组中的索引位置
      let findIndex = map[newStartVnode.key]
      // 2. 如果没有找到, 就是新增的, 插入到老的开始节点的前面
      if (findIndex == undefined) {
        parent.insertBefore(createElm(newStartVnode), oldStartVnode.el)
      } else {
        let findVNode = oldChildren[findIndex]    // 通过mapping的索引，找到老的虚拟节点的元素
        patch(findVNode, newStartVnode) // 比较老的和新的VDOM的属性和儿子   递归
        parent.insertBefore(findVNode.el, oldStartVnode.el) // 将查找并更新后的节点 findVNode DOM节点el 插入到老数组的开始指针索引的前面
        oldChildren[findIndex] = null   // 设置根据索引查找的移动的节点 为null, 避免数组塌陷
      }
      newStartVnode = newChildren[++newStartIndex]    // 新数组指针向后移动,并更新数组的开始节点 newStartVnode
    }
  }

  // 处理比较完成后有多余的

  // 如果新的多于老的, 并且在最后多的
  if (newStartIndex <= newEndIndex) {
    for (let i = newStartIndex; i <= newEndIndex; i++) {
      parent.appendChild(createElm(newChildren[newStartIndex]))
    }
  }

  // 如果老的数组还没有遍历完成, 老节点是不需要的节点,
  if (oldStartIndex <= oldEndIndex) {
    for (let i = oldStartIndex; i <= oldEndIndex; i++) {
      let child = oldChildren[i]
      if (child != null) {
        parent.removeChild(child.el)
      }
    }
  }

}


export function createElm(vnode) {
  let { tag, children, key, data, text } = vnode;
  if (typeof tag == 'string') { // 创建元素 放到vnode.el上
    // 创建DOM
    vnode.el = document.createElement(tag);
    // 更新属性
    updateProperties(vnode)

    children.forEach(child => { // 遍历儿子 将儿子渲染后的结果扔到父亲中
      vnode.el.appendChild(createElm(child));
    })
  } else { // 创建文件 放到vnode.el上
    vnode.el = document.createTextNode(text);
  }
  return vnode.el;
}

// 根据虚拟节点的data属性, 更新DOM的attrs
function updateProperties(vnode, oldProps = {}) {
  let el = vnode.el
  let newProps = vnode.data || {}
  // 老的有，新的没有 -> 删除
  for (let key in oldProps) {  // oldProps: {id: 'a', name: 'input'}
    if (!newProps[key]) {     // newProps: {xx: 'yy'}
      el.removeAttribute(key)  // 当前的el就是复用后的el
    }
  }

  // 剩下的就是属性在 老的和新的都有, 或者新的有
  // 因为样式的写法是对象方式,单独处理
  let newStyle = newProps.style || {}
  let oldStyle = oldProps.style || {}
  for (let key in oldStyle) {
    if (!newStyle[key]) {
      el.style[key] = ''
    }
  }

  // 1. 新的有，老的有；替换
  // 2. 新的有，老的没有；新增设置
  for (let key in newProps) {
    if (key === 'style') {
      // style属性是个对象
      for (let styleName in newProps.style) {
        el.style[styleName] = newProps.style[styleName]
      }
    } else if (key === 'class') {
      el.className = newProps.class
    } else {
      // 新的有，老的没有，直接增加
      el.setAttribute(key, newProps[key])
    }
  }
}



// 初渲染属性(创建)
/* function updateProperties(vnode) {
  let el = vnode.el
  let newProps = vnode.data || {}
  for (let key in newProps) {
    if (key === 'style') {
      // style属性是个对象
      for (let styleName in newProps.style) {
        el.style[styleName] = newProps.style[styleName]
      }
    } else if (key === 'class') {
      el.className = el.class
    } else {
      el.setAttribute(key, newProps[key])
    }
  }
} */
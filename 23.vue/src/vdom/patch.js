export function patch(oldDOMNode, vnode) {
  // 将虚拟节点转化成真实节点
  let el = createElm(vnode); // 产生真实的dom 
  let parentElm = oldDOMNode.parentNode; // 获取老的app的父亲 =》 body
  parentElm.insertBefore(el, oldDOMNode.nextSibling); // 当前的真实元素插入到app的后面
  // parentElm.insertBefore(el, oldDOMNode)
  parentElm.removeChild(oldDOMNode); // 删除老的节点
  // 把创建的DOM返回
  return el
}

function createElm(vnode) {
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
function updateProperties(vnode) {
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
}
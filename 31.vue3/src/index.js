export function render(vnode, container) {
  // 将虚拟节点转换为真实DOM, 1. 初次 2. 更新
  patch(null, vnode, container)
}

// 将虚拟节点转换为真实DOM的总入口, vnode => DOM
// n1: 老的vnode n2: 新的vnode
function patch(n1, n2, container) {
  if (typeof n2.tag === 'string') {  // 认为是元素, 操作DOM, 单独封装成一个模块,用于操作DOM

  }
} 
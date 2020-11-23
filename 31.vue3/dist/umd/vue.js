(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.Vue = {}));
}(this, (function (exports) { 'use strict';

  function render(vnode, container) {
    // 将虚拟节点转换为真实DOM, 1. 初次 2. 更新
    patch(null, vnode);
  } // 将虚拟节点转换为真实DOM的总入口, vnode => DOM
  // n1: 老的vnode n2: 新的vnode

  function patch(n1, n2, container) {
    if (typeof n2.tag === 'string') ;
  }

  exports.render = render;

  Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=vue.js.map

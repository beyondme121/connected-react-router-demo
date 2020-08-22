import { initMixin } from "./init"
import { lifecycleMixin } from "./lifecycle"
import { renderMixin } from "./vdom/index"
import { initGlobalApi } from "./global-api/index"
import { stateMixin } from "./state"


function Vue(options) {
  this._init(options)
}

// 扩展原型
// 初始化方法
initMixin(Vue)
lifecycleMixin(Vue)
renderMixin(Vue)
stateMixin(Vue)
// 扩展Vue静态方法
initGlobalApi(Vue)

export default Vue

// import { compileToFunctions } from "./compiler/index"
// import { compileToFunctions } from "./compiler/bk-jf/index"
// import { createElm, patch } from './vdom/patch'

// let vm1 = new Vue({ data: { name: 'liuzc' } })
// let render1 = compileToFunctions(`
// <ul>
//     <li style="background:red" key="A">A</li>
//     <li style="background:yellow" key="B">B</li>
//     <li style="background:pink" key="C">C</li>
//     <li style="background:green" key="D">D</li>
//     <li style="background:green" key="F">F</li>
// </ul>`)

// let oldVnode = render1.call(vm1)  // 返回虚拟DOM
// document.body.appendChild(createElm(oldVnode))


// let vm2 = new Vue({ data: { name: 'sanfeng' } })
// let render2 = compileToFunctions(`
// <ul>
//   <li style="background:green" key="F">F</li>
//   <li style="background:red" key="A">A</li>
//   <li style="background:red" key="M">M</li>
//   <li style="background:yellow" key="B">B</li>

// </ul>`)

// let newVnode = render2.call(vm2)


// setTimeout(() => {
//   patch(oldVnode, newVnode) // 更新时，把新老vdom传入patch方法
// }, 3000)




// --------------------------- 2 ---------------------------

// let vm1 = new Vue({ data: { name: 'liuzc' } })
// let render1 = compileToFunctions(`
//   <div id="a"></div>
// `)
// let oldVnode = render1.call(vm1)  // 返回虚拟DOM
// console.log("odlVnode:", oldVnode)
// // 
// let vm2 = new Vue({ data: { name: 'sanfeng' } })
// let render2 = compileToFunctions('<div id="b"></div>')
// let newVnode = render2.call(vm2)

// let el = createElm(oldVnode)
// document.body.appendChild(el)

// setTimeout(() => {
//   patch(oldVnode, newVnode) // 更新时，把新老vdom传入patch方法
// }, 1500)



// --------------------------- 1 ---------------------------

// let vm1 = new Vue({ data: { name: 'liuzc' } })
// let render1 = compileToFunctions('<div id="a" style="color: red">{{name}}</div>')
// let oldVnode = render1.call(vm1)  // 返回虚拟DOM

// // 
// let vm2 = new Vue({ data: { name: 'sanfeng' } })
// let render2 = compileToFunctions('<div id="b"></div>')
// let newVnode = render2.call(vm2)

// let el = createElm(oldVnode)
// document.body.appendChild(el)

// setTimeout(() => {
//   patch(oldVnode, newVnode) // 更新时，把新老vdom传入patch方法
// }, 1500)





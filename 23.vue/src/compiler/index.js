import { parseHTML } from "./parse";
import { generate } from "./generate";

export function compileToFunctions(template) {
  // 将模板字符串解析成AST语法树
  let ast = parseHTML(template)
  // 静态代码优化
  // 代码生成: 根据ast树生成render方法
  let code = generate(ast)
  let render = new Function(`with(this) { return ${code}}`)
  // 将字符串变成函数 限制取值范围 通过with来进行取值 稍后调用render函数就可以通过改变this 让这个函数内部取到结果了
  // let render = new Function(`with(this) { return ${code} }`)
  return render
}
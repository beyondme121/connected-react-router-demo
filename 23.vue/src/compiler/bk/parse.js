const ncname = `[a-zA-Z_][\\-\\.0-9_a-zA-Z]*`; // 标签名 ?:匹配不捕获
const qnameCapture = `((?:${ncname}\\:)?${ncname})`; // </my:xx>
const startTagOpen = new RegExp(`^<${qnameCapture}`); // 标签开头的正则 捕获的内容是标签名
const endTag = new RegExp(`^<\\/${qnameCapture}[^>]*>`); // 匹配标签结尾的 </div>
const attribute = /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/; // 匹配属性的    aaa="aaa"  a='aaa'   a=aaa
const startTagClose = /^\s*(\/?)>/; // 匹配标签结束的 >    >   <div></div>  <br/>
const defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g;

export function parseHTML(html) {
  // 解析开始标签 <div id="app" name="xxx">
  function parseStartTag() {
    const start = html.match(startTagOpen)
    // start[0] => "<div"
    if (start) {
      // 保存标签和属性
      const match = {
        tagName: start[1],      // start[1] ==> div
        attrs: []
      }
      // 匹配完了就要删除
      advance(start[0].length)   // 删除html开始标签 start[0] ==> <div

      let end, attr
      // 处理开始标签的属性 如果没有遇到结束标签的标识符">", 并且匹配到了属性, 就将匹配到的attr保存到match对象上, 最终return
      while (!(end = html.match(startTagClose)) && (attr = html.match(attribute))) {
        match.attrs.push({
          name: attr[1],      // id
          value: attr[3] || attr[4] || attr[5]    // app
        })
        // 匹配完继续删除
        advance(attr[0].length)
      }
      // 最终就剩下 ">"
      if (end) {
        advance(end[0].length)
        return match
      }
    }
  }

  function advance(n) {
    html = html.substring(n)
  }

  let root;
  let currentParent;    // 父节点
  let stack = []        // 用于校验html标签书写是否规范, 标签是否配对, 开始标签存入栈中, 遇到结束标签 pop, 

  // 处理开始
  function start(tagName, attrs) {
    // console.log(tagName, attrs)
    let element = createASTElement(tagName, attrs)
    // 因为创建的是树tree,只能由一个根root
    if (!root) {
      root = element
    }
    currentParent = element   // 解析的当前节点作为 下一次解析文本的父级元素 例如 <div id="app">hello</div>, <div id="app">生成的 AST对象就是hello的父级currentParent
    stack.push(element)
    // console.log("stack: ", stack)
  }

  // 处理文本
  function chars(text) {
    // console.log(text)
    // 文本可能是空文本
    // text = text.replace(/\s/g, '')
    text = text.trim()
    if (text) {
      currentParent.children.push({
        type: 3,
        text
      })
    }
  }

  // 结束标签处理 </div>
  // 1. 记录结束标签的父亲
  // 2. 当前标签父亲的儿子是谁
  // 3. 结束标签建立父子关系 
  function end(tagName) {
    // console.log("end....", tagName)
    let ele = stack.pop()   // 取出栈中的最后一个
    // console.log("ele,", ele)
    // if (tagName === ele.tag) {
    //   console.log('tagName,  ele.tagName', tagName, ele.tag)
    // } else {
    //   console.log('------> tagName,  ele.tagName', tagName, ele.tag)
    // }
    currentParent = stack[stack.length - 1]
    if (currentParent) {
      ele.parent = currentParent
      currentParent.children.push(ele)
    }
  }

  // 生成AST
  function createASTElement(tagName, attrs) {
    return {
      tag: tagName, // 标签名
      type: 1, // 元素类型
      children: [], // 孩子列表
      attrs, // 属性集合
      parent: null // 父元素
    }
  }


  while (html) {
    // debugger
    // 查找到 "<"
    let textEnd = html.indexOf('<')
    if (textEnd == 0) {   // 肯定是标签, 要么是<div> 开始标签, 要么是结束标签</div>
      // 解析匹配开始标签
      const startTagMatch = parseStartTag()
      if (startTagMatch) {
        start(startTagMatch.tagName, startTagMatch.attrs)   // start函数内调用创建ast树的方法
        // 继续处理(处理文本或者结束标签)
        continue
      }
      // 匹配上 < 也可能是结束标签, 此处用html.match, 因为html已经在上面的parseStartTag中,如果匹配了就已经截取删除了
      // 如果是结束标签, 
      const endTagMatch = html.match(endTag)
      if (endTagMatch) {
        advance(endTagMatch[0].length)      // <div>
        end(endTagMatch[1])    // 将结束标签传入 
        continue
      }
    }
    // 如果是文本保存并
    let text
    if (textEnd > 0) {
      text = html.substring(0, textEnd)
    }
    // 截取删除
    if (text) {
      advance(text.length)
      chars(text)     // 处理文本 hello {{name}}
    }
    // break;
  }

  return root;
}
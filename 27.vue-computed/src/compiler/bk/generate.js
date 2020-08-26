
const defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g;

function genProps(attrs) {
  let str = ''
  for (let i = 0; i < attrs.length; i++) {
    const attr = attrs[i];
    if (attr.name === 'style') {
      let obj = {}
      attr.value.split(';').forEach(_item => {
        let [key, value] = _item.split(':')
        obj[key] = value
      })
      attr.value = obj
    }
    str += `${attr.name}:${JSON.stringify(attr.value)},`
  }
  return `{${str.slice(0, -1)}}`
  // _c(div, {id:"app",style:{"color":"red"," fontSize":" 16px"}})
}


function gen(node) {
  if (node.type === 1) {
    return generate(node)   // 生产元素节点的字符串
  } else {
    let text = node.text
    if (!defaultTagRE.test(text)) {
      return `_v(${JSON.stringify(text)})`
    }
    let tokens = []
    let lastIndex = defaultTagRE.lastIndex = 0
    let match, index

    while (match = defaultTagRE.exec(text)) {
      index = match.index
      if (index > lastIndex) {
        tokens.push(JSON.stringify(text.slice(lastIndex, index)))   // 匹配开始的下表 截取匹配字符串的长度
      }
      // 匹配变量
      tokens.push(`_s(${match[1].trim()})`)
      lastIndex = index + match[0].length
    }
    // 如果是这种情况 hello {{name}} world {{age}} xxx, 需要把xxx加入到token中, 作为_v
    if (lastIndex < text.length) {
      tokens.push(JSON.stringify(text.slice(lastIndex)))
    }
    return `_v(${tokens.join('+')})`;
  }
}

function genChildren(ast) {
  const children = ast.children
  if (children) {
    return children.map(child => gen(child)).join(',')
  }
}

export function generate(ast) {
  let children = genChildren(ast)  // 生成儿子
  // `,${children}` 前面的, 要注意细节
  let code = `_c('${ast.tag}', ${ast.attrs.length > 0 ? `${genProps(ast.attrs)}` : 'undefined'} ${children ? `,${children}` : ''})`
  // console.log("code: ", code)
  return code
}
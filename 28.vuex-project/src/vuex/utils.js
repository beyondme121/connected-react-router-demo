// 传入一个对象, 遍历所有属性, 把属性的key和value传递给外层的回调进行二次处理
export function forEachValue(obj, callback) {
  Object.keys(obj).forEach(key => callback(obj[key], key))
}
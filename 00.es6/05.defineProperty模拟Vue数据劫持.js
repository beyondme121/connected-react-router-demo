let data = {
  name: 'hello',
  age: 18,
  address: {
    location: 'beijing'
  }
}

function updateView() {
  console.log('update view')
}

// 检测对象的所有属性,进行数据劫持, 深层次的属性get set
function observer(obj) {
  for (let key in data) {
    defineReactive(obj, key, obj[key])
  }
}

function defineReactive(obj, key, value) {
  // 如果不是对象, 直接返回基本类型的值
  if (typeof value !== 'object') return value
  // 如果是对象, 再次劫持传进来的对象 value
  // observer(value)   // 递归
  Object.defineProperty(obj, key, {
    get() {
      return value
    },
    set(val) {
      // if (val !== value) {

      // }
      observer(val)
      updateView()
      value = val
    }
  })
}

observer(data)
console.log(data.name)
data.name = 'world'
data.address.location = "xxx"
console.log(data.name)
data.address.location = '上海'

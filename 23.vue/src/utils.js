export function proxy(vm, data, key) {
  Object.defineProperty(vm, key, {
    get() {
      return vm[data][key]
    },
    set(newValue) {
      vm[data][key] = newValue
    }
  })
}

// 对目标对象定义属性, 属性是不可枚举的
export function definePropertyWithoutEnumerable(target, key, value) {
  Object.defineProperty(target, key, {
    enumerable: false,
    configurable: false,
    value
  })
}


export const LIFECYCLE_HOOKS = [
  'beforeCreate',
  'created',
  'beforeMount',
  'mounted',
  'beforeUpdate',
  'updated',
  'beforeDestroy',
  'destroyed'
]
const strategy = {}

// 状态state合并 TODO
// 合并data, 不能这样简单的取儿子的属性值
// strategy.data = function (parentVal, childValue) {
//   return childValue
// }
// strategy.computed = function () {

// }
// strategy.watch = function () {

// }

strategy.components = function (parentVal, childVal) {
  // res可以通过__proto__ 查找到父亲的值, 父组件的选项
  const res = Object.create(parentVal)
  // 如果有子组件, 就把子组件的所有属性都定义在res上,儿子上没有属性，就通过__proto__向上查找,相当于继承了
  if (childVal) {
    for (let key in childVal) {
      res[key] = childVal[key]
    }
  }
  return res
}



function mergeHook(parentVal, childVal) {
  if (childVal) {
    if (parentVal) {
      return parentVal.concat(childVal)   // 父子拼接, 多个mixin配置中, 多次出现created, 那么把多个方法放进去
    } else {
      return [childVal]
    }
  } else {
    return parentVal
  }
}
LIFECYCLE_HOOKS.forEach(hook => strategy[hook] = mergeHook)

// 合并选项 parent: Vue.options={}, child: mixin = { created: fn }
export function mergeOptions(parent, child) {
  const options = {}
  for (let key in parent) {
    mergeField(key)
  }

  // 儿子有,父亲没有, 把儿子多的属性合并到父亲上
  for (let key in child) {
    if (!parent.hasOwnProperty(key)) {
      mergeField(key)
    }
  }

  // 合并生命周期的钩子hook, 如created
  // function mergeField(key) {
  //   if (strategy[key]) {
  //     options[key] = strategy[key](parent[key], child[key])
  //   } else {
  //     options[key] = child[key]
  //   }
  // }

  function mergeField(key) { // 合并字段
    // 根据key 不同的策略来进行合并 
    if (strategy[key]) {
      options[key] = strategy[key](parent[key], child[key]);
    } else {
      // todo默认合并
      if (child[key]) {
        options[key] = child[key]
      } else {
        options[key] = parent[key];
      }
    }
  }

  return options
}


let callbacks = []
let pending = false
let timerFunc;


function flushCallbacks() {
  while (callbacks.length) {
    let cb = callbacks.shift()
    cb()
  }
  pending = false
}

if (Promise) {
  timerFunc = () => {
    Promise.resolve().then(flushCallbacks)
  }
} else if (MutationObserver) {
  let observe = new MutationObserver(flushCallbacks)
  let textNode = document.createTextNode(1)
  observe.observe(textNode, { characterData: true })
  timerFunc = () => {
    textNode.textContent = 2;
  }
} else if (setImmediate) {
  timerFunc = () => {
    setImmediate(flushCallbacks)
  }
} else {
  timerFunc = () => {
    setTimeout(flushCallbacks)
  }
}



// watcher.js: queueWatcher中调用
// 参数cb: 传入一个刷新watcher队列的函数
export function nextTick(cb) {
  callbacks.push(cb)
  if (!pending) {
    timerFunc()
    pending = true
  }
}


function makeMap(str) {
  const mapping = {}
  const list = str.split(',')
  for (let i = 0; i < list.length; i++) {
    mapping[list[i]] = true
  }
  return key => {
    return mapping[key]
  }
}

// 判断标签名是否为原生标签
export const isReservedTag = makeMap('a,div,img,image,text,span,p,button,input,textarea,ul,li')
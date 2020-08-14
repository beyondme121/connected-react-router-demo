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
  function mergeField(key) {
    if (strategy[key]) {
      options[key] = strategy[key](parent[key], child[key])
    } else {
      options[key] = child[key]
    }
  }

  return options
}
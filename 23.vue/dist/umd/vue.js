(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.Vue = factory());
}(this, (function () { 'use strict';

  function _typeof(obj) {
    "@babel/helpers - typeof";

    if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
      _typeof = function (obj) {
        return typeof obj;
      };
    } else {
      _typeof = function (obj) {
        return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
      };
    }

    return _typeof(obj);
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
  }

  function _defineProperty(obj, key, value) {
    if (key in obj) {
      Object.defineProperty(obj, key, {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true
      });
    } else {
      obj[key] = value;
    }

    return obj;
  }

  function ownKeys(object, enumerableOnly) {
    var keys = Object.keys(object);

    if (Object.getOwnPropertySymbols) {
      var symbols = Object.getOwnPropertySymbols(object);
      if (enumerableOnly) symbols = symbols.filter(function (sym) {
        return Object.getOwnPropertyDescriptor(object, sym).enumerable;
      });
      keys.push.apply(keys, symbols);
    }

    return keys;
  }

  function _objectSpread2(target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i] != null ? arguments[i] : {};

      if (i % 2) {
        ownKeys(Object(source), true).forEach(function (key) {
          _defineProperty(target, key, source[key]);
        });
      } else if (Object.getOwnPropertyDescriptors) {
        Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
      } else {
        ownKeys(Object(source)).forEach(function (key) {
          Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
        });
      }
    }

    return target;
  }

  function _slicedToArray(arr, i) {
    return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest();
  }

  function _arrayWithHoles(arr) {
    if (Array.isArray(arr)) return arr;
  }

  function _iterableToArrayLimit(arr, i) {
    if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return;
    var _arr = [];
    var _n = true;
    var _d = false;
    var _e = undefined;

    try {
      for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
        _arr.push(_s.value);

        if (i && _arr.length === i) break;
      }
    } catch (err) {
      _d = true;
      _e = err;
    } finally {
      try {
        if (!_n && _i["return"] != null) _i["return"]();
      } finally {
        if (_d) throw _e;
      }
    }

    return _arr;
  }

  function _unsupportedIterableToArray(o, minLen) {
    if (!o) return;
    if (typeof o === "string") return _arrayLikeToArray(o, minLen);
    var n = Object.prototype.toString.call(o).slice(8, -1);
    if (n === "Object" && o.constructor) n = o.constructor.name;
    if (n === "Map" || n === "Set") return Array.from(o);
    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
  }

  function _arrayLikeToArray(arr, len) {
    if (len == null || len > arr.length) len = arr.length;

    for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];

    return arr2;
  }

  function _nonIterableRest() {
    throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }

  // 拿到Array的原型对象
  var oldArrayProtoMethods = Array.prototype; // 根据Array的原型创建对象

  var arrayMethods = Object.create(oldArrayProtoMethods); // 需要重写数组的方法(可以改变数组的方法)

  var methods = ['push', 'pop', 'shift', 'unshift', 'reverse', 'sort', 'splice'];
  methods.forEach(function (method) {
    // 重新定义数组的方法, 重写上面的7个方法
    arrayMethods[method] = function () {
      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      // console.log(args)
      // 切面编程: 做点特殊的事情之后, 再调用原本执行的方法
      // console.log('数组方法重写了，更新视图')
      // 原本的方法执行
      var result = oldArrayProtoMethods[method].apply(this, arguments);
      var inserted;
      var ob = this.__ob__; // 通过属性的__ob__属性可以拿到Observer实例, 通过实例可以拿到实例方法
      // 监控新增对象

      switch (method) {
        case 'push':
        case 'unshift':
          // 这两个方法都是追加 追加的内容可能是对象类型，应该被再次进行劫持
          inserted = args;
          break;

        case 'splice':
          inserted = args.slice(2);
      } // 将观测对象的方法, 挂载到实例的属性__ob__上
      // if (inserted) ob.observeArray(inserted)


      if (inserted) {
        ob.observeArray(inserted);
      } // 通过observer实例获取dep


      ob.dep.notify(); // 通知数组更新

      return result;
    };
  });

  function proxy(vm, data, key) {
    Object.defineProperty(vm, key, {
      get: function get() {
        return vm[data][key];
      },
      set: function set(newValue) {
        vm[data][key] = newValue;
      }
    });
  } // 对目标对象定义属性, 属性是不可枚举的

  function definePropertyWithoutEnumerable(target, key, value) {
    Object.defineProperty(target, key, {
      enumerable: false,
      configurable: false,
      value: value
    });
  }
  var LIFECYCLE_HOOKS = ['beforeCreate', 'created', 'beforeMount', 'mounted', 'beforeUpdate', 'updated', 'beforeDestroy', 'destroyed'];
  var strategy = {}; // 状态state合并 TODO
  // 合并data, 不能这样简单的取儿子的属性值
  // strategy.data = function (parentVal, childValue) {
  //   return childValue
  // }
  // strategy.computed = function () {
  // }
  // strategy.watch = function () {
  // }

  function mergeHook(parentVal, childVal) {
    if (childVal) {
      if (parentVal) {
        return parentVal.concat(childVal); // 父子拼接, 多个mixin配置中, 多次出现created, 那么把多个方法放进去
      } else {
        return [childVal];
      }
    } else {
      return parentVal;
    }
  }

  LIFECYCLE_HOOKS.forEach(function (hook) {
    return strategy[hook] = mergeHook;
  }); // 合并选项 parent: Vue.options={}, child: mixin = { created: fn }

  function mergeOptions(parent, child) {
    var options = {};

    for (var key in parent) {
      mergeField(key);
    } // 儿子有,父亲没有, 把儿子多的属性合并到父亲上


    for (var _key in child) {
      if (!parent.hasOwnProperty(_key)) {
        mergeField(_key);
      }
    } // 合并生命周期的钩子hook, 如created


    function mergeField(key) {
      if (strategy[key]) {
        options[key] = strategy[key](parent[key], child[key]);
      } else {
        options[key] = child[key];
      }
    }

    return options;
  }
  var callbacks = [];
  var pending = false;
  var timerFunc;

  function flushCallbacks() {
    while (callbacks.length) {
      var cb = callbacks.shift();
      cb();
    }

    pending = false;
  }

  if (Promise) {
    timerFunc = function timerFunc() {
      Promise.resolve().then(flushCallbacks);
    };
  } else if (MutationObserver) {
    var observe = new MutationObserver(flushCallbacks);
    var textNode = document.createTextNode(1);
    observe.observe(textNode, {
      characterData: true
    });

    timerFunc = function timerFunc() {
      textNode.textContent = 2;
    };
  } else if (setImmediate) {
    timerFunc = function timerFunc() {
      setImmediate(flushCallbacks);
    };
  } else {
    timerFunc = function timerFunc() {
      setTimeout(flushCallbacks);
    };
  } // watcher.js: queueWatcher中调用
  // 参数cb: 传入一个刷新watcher队列的函数


  function nextTick(cb) {
    callbacks.push(cb);

    if (!pending) {
      timerFunc();
      pending = true;
    }
  }

  var id = 0;

  var Dep = /*#__PURE__*/function () {
    function Dep() {
      _classCallCheck(this, Dep);

      this.subs = [];
      this.id = id++;
    }

    _createClass(Dep, [{
      key: "depend",
      value: function depend() {
        // this.subs.push(Dep.target)
        Dep.target.addDep(this);
      } // 给dep上添加watcher

    }, {
      key: "addSub",
      value: function addSub(watcher) {
        this.subs.push(watcher);
      } // 数据变更, 让所有的watcher调用自己的update方法, watcher敞开方法供dep调用

    }, {
      key: "notify",
      value: function notify() {
        this.subs.forEach(function (watcher) {
          return watcher.update();
        });
      }
    }]);

    return Dep;
  }();

  var stack = []; // 属性依赖dep 要记住 在哪个watcher中使用了，也就是属性在哪个组件中

  function pushTarget(watcher) {
    Dep.target = watcher;
    stack.push(watcher);
  }
  function popTarget() {
    // Dep.target = null
    stack.pop(); // 如果栈中有多个watcher 出栈后Dep.target  要指向数组中的最后一个watcher, 

    Dep.target = stack[stack.length - 1];
    console.log("stack: ", stack);
  }

  var Observer = /*#__PURE__*/function () {
    function Observer(value) {
      _classCallCheck(this, Observer);

      // 记住最外层的对象
      this.dep = new Dep(); // value ={}  value = [], 从data(){ return { obj, arr }} return返回的对象进行监控 其中可能是对象,也可能是数组

      definePropertyWithoutEnumerable(value, '__ob__', this); // this: Observer实例
      // value.__ob__ = this
      // 如果是数组, 不观测每一项

      if (Array.isArray(value)) {
        // value如果是数组, 继承指向重新的数组方法，通过原型链继承
        value.__proto__ = arrayMethods;
        this.observeArray(value);
      } else {
        this.walk(value);
      }
    } // 观测数组中的每一项, 如果是对象就进行观测


    _createClass(Observer, [{
      key: "observeArray",
      value: function observeArray(value) {
        value.forEach(function (item) {
          // 观测数组中的对象类型
          observe$1(item);
        });
      }
    }, {
      key: "walk",
      value: function walk(data) {
        var keys = Object.keys(data);
        keys.forEach(function (key) {
          defineReactive(data, key, data[key]);
        });
      }
    }]);

    return Observer;
  }(); // 给每个属性添加响应式 增加dep以及watcher的处理


  function defineReactive(data, key, value) {
    // 递归观察data嵌套的对象
    var childDep = observe$1(value); // 获取到数组对应的dep
    // observe(value)
    // 每个属性一个dep

    var dep = new Dep();
    Object.defineProperty(data, key, {
      get: function get() {
        if (Dep.target) {
          dep.depend();

          if (childDep) {
            childDep.dep.depend();
          }
        }

        return value;
      },
      set: function set(newValue) {
        if (newValue === value) return;
        console.log('数据设置了'); // 如果给data属性设置一个对象,设置的对象也需要进行观测

        observe$1(newValue);
        value = newValue; // 数据变更, 通知dep中的所有watcher调用自己的更新

        dep.notify();
      }
    });
  } // 观测数据的变化, 更新视图


  function observe$1(data) {
    if (data.__ob__) {
      return data;
    } // 只观测对象或数组


    if (_typeof(data) !== 'object' || data == null) {
      return;
    } // 使用类的方式: 1. 可以清楚的知道这个属性是哪个类的实例 2. 观测数据的功能是高内聚的


    return new Observer(data);
  }

  var id$1 = 0;

  var Watcher = /*#__PURE__*/function () {
    /**
     * @param {*} vm 
     * @param {*} exprOrFn: 可能是表达式 Vue.$set这种更新数据; 也可能是函数, 直接调用update(render)
     * @param {*} updateCallback: 更新后的callback
     * @param {*} options: 包含了是否为渲染watcher
     */
    function Watcher(vm, exprOrFn, updateCallback, options) {
      _classCallCheck(this, Watcher);

      this.vm = vm;
      this.exprOrFn = exprOrFn;
      this.updateCallback = updateCallback;
      this.options = options; // 如果用户定义的watch属性或者直接调用vm.$watch(expr, cb)

      this.user = options.user; // computed属性

      this.lazy = options.lazy; // 如果watcher上有lazy属性 说明是一个就算属性

      this.dirty = this.lazy; // dirty代表取值时是否执行用户提供的方法

      this.deps = [];
      this.depsId = new Set();
      this.id = id$1++; // watcher内部组件渲染或者更新都是render函数

      if (typeof exprOrFn === 'function') {
        this.getter = exprOrFn;
      } else {
        // 用户自定义的watcher, 如watch: {a: fn}, vm.$watch(exprOrFn,handler,options) 中,exprOrFn通常是字符串(属性key值)
        this.getter = function () {
          var obj = vm;
          var path = exprOrFn.split('.');

          for (var i = 0; i < path.length; i++) {
            obj = obj[path[i]];
          }

          return obj;
        };
      } // 渲染watcher和watch中的watch默认都是会执行一次的, 当时computed的watcher是默认不执行的


      this.value = this.lazy ? void 0 : this.get(); // this.value = this.get()
    } // watcher记录dep，去重


    _createClass(Watcher, [{
      key: "addDep",
      value: function addDep(dep) {
        // this.deps.push(dep)
        var id = dep.id;

        if (!this.depsId.has(id)) {
          this.deps.push(dep);
          this.depsId.add(id);
          dep.addSub(this);
        }
      }
    }, {
      key: "get",
      value: function get() {
        pushTarget(this); // 把watcher实例给到Dep类去折腾. 在Dep.target = this
        // 渲染页面(1. 代码生成render 2. 生成DOM,挂载页面)

        var result = this.getter.call(this.vm);
        popTarget();
        return result;
      }
    }, {
      key: "update",
      value: function update() {
        if (this.lazy) {
          this.dirty = true; // 设置为true表示需要更新
        } else {
          // this.get()
          queueWatcher(this);
        }
      } // 执行每个watcher

    }, {
      key: "run",
      value: function run() {
        var oldValue = this.value;
        var newValue = this.get();
        this.value = newValue;

        if (this.user) {
          this.updateCallback.call(this.vm, newValue, oldValue);
        }
      } // 计算属性取值

    }, {
      key: "evaluate",
      value: function evaluate() {
        // 调用get, get方法有返回值result,取值当然有返回值
        this.value = this.get();
        this.dirty = false; // 取了一次值, 就不是dirty的了
      }
    }, {
      key: "depend",
      value: function depend() {
        // 拿出当前watcher的所有依赖项
        var i = this.deps.length;

        while (i--) {
          // 让每一个dep记录当前的渲染watcher
          this.deps[i].depend();
        }
      }
    }]);

    return Watcher;
  }(); // 将需要批量更新的watcher存到一个队列中，稍后让watcher执行，存储watcher队列如果是同一个就不再存储了


  var queue = [];
  var has = {};
  var pending$1 = false; // 刷新当前调度的队列，提出一层，然后queueWatcher中就不要写定时器了

  function flushSchedulerQueue() {
    // 执行watcher队列 去重后的watcher队列
    queue.forEach(function (watcher) {
      watcher.run(); // 如果不是用户watcher, 即如果是渲染watcher, 就执行cb

      if (!watcher.user) {
        console.log("render watcher cb:", watcher.cb);
        watcher.updateCallback();
      } else {
        console.log("user watcher.cb:", watcher.cb);
      }
    }); // 执行完之后清空队列 准备下一次watcher队列的更新

    queue = [];
    has = {};
    pending$1 = false;
  } // 更新队列


  function queueWatcher(watcher) {
    var id = watcher.id;

    if (!has[id]) {
      queue.push(watcher);
      has[id] = true;

      if (!pending$1) {
        // setTimeout(() => {
        //   queue.forEach(watcher => watcher.run())  // 清空队列
        //   queue = []
        //   has = {}
        //   pending = false
        // }, 0);
        nextTick(flushSchedulerQueue);
        pending$1 = true;
      }
    }
  }

  function initState(vm) {
    var opts = vm.$options; // 根据不同的选项, 做不同的拆分处理, data如何处理, props如何处理等

    if (opts.props) ;

    if (opts.data) {
      initData(vm);
    }

    if (opts.watch) {
      initWatch(vm);
    }

    if (opts.computed) {
      initComputed(vm);
    }
  } // data数据的初始化操作, 数据劫持

  function initData(vm) {
    var data = vm.$options.data; // data可能是函数, 也可能是对象, 函数就直接执行,结果返回对象,赋值给vm也是为了可以通过vue实例获取到数据劫持后的数据(引用)

    vm._data = data = typeof data === 'function' ? data.call(vm) : data; // 当我去vm上取属性时 ，帮我将属性的取值代理到vm._data上

    for (var key in data) {
      proxy(vm, '_data', key);
    }

    observe$1(data);
  }


  function initWatch(vm) {
    var watches = vm.$options.watch;

    var _loop = function _loop(key) {
      var handler = watches[key];

      if (Array.isArray(handler)) {
        handler.forEach(function (handle) {
          return createWatcher(vm, key, handle);
        });
      } else {
        createWatcher(vm, key, handler);
      }
    };

    for (var key in watches) {
      _loop(key);
    }
  } // 大部分情况下exprOrFn是watch中监控的属性名, 字符串, cb可能是函数，对象，字符串


  function createWatcher(vm, exprOrFn, handler, options) {
    // console.log(exprOrFn, cb, options)
    if (_typeof(handler) === 'object') {
      // a: { handler () {...,deep, immediate: true, ...}}
      options = handler; // 把整个对象的配置都给options

      handler = handler.handler; // 把执行的函数拿出来
    }

    if (typeof handler === 'string') {
      handler = vm[handler]; // method中的方法
    } // 其他都是key:fn
    // return new Watcher(vm, exprOrFn, handler, options)


    return vm.$watch(exprOrFn, handler, options);
  }

  function initComputed(vm) {
    var computed = vm.$options.computed;
    var watchers = vm._computedWatchers = {}; // debugger
    // 因为依赖的属性变更，计算属性要重新执行, 有依赖收集的功能, 内部实现了watcher，所以要重写computed的每一个属性,
    // 并且将属性改在到vm实例上，可以让组件通过this.计算属性获的形式 获取到这个值

    for (var key in computed) {
      var userDef = computed[key]; // 两种计算属性的写法 1. 函数 2. 对象
      // 获取get方法, 用于传递给watcher的 get属性, 即属性发生变更执行的函数

      var getter = typeof userDef == 'function' ? userDef : userDef.get; // 给每个计算属性增加一个watcher,保存的vm实例变量_computedWatchers上, watcers['fullName'] = watcher
      // 并且标识一下当前的watcher的类型是计算属性，是lazy的

      watchers[key] = new Watcher(vm, getter, function () {}, {
        lazy: true
      });
      defineComputed(vm, key, userDef);
    }
  } // 这里没有写vm而是target表示的是: 可能是给Vue的实例挂属性, 也可能给组件实例挂属性
  // 入参:userDef 可能是函数 或者是对象;如果是函数,处理成对象的形式. 定义sharedComputedProperty为对象,给对象增加get,set属性


  function defineComputed(target, key, userDef) {
    var sharedComputedProperty = {};

    if (typeof userDef == 'function') {
      sharedComputedProperty.get = createComputedGetter(key); // 调用get,就是执行usefDef函数
    } else {
      sharedComputedProperty.get = createComputedGetter(key);
      sharedComputedProperty.set = userDef.set;
    }

    Object.defineProperty(target, key, sharedComputedProperty);
  } // 此方法是我们包装的方法，每次取值会调用此方法


  function createComputedGetter(key) {
    // 取值时才会调用
    return function () {
      var watcher = this._computedWatchers[key]; // 拿到这个属性对应的watcher

      if (watcher) {
        if (watcher.dirty) {
          // 默认肯定是脏的，Watcher类初始化为true.
          watcher.evaluate(); // 对当前watcher求值
          // return watcher.value
        } // 


        if (Dep.target) {
          // 说明还有渲染watcher，也应该一并的收集起来
          watcher.depend();
        } // 如果不是dirty的，说明是新的，赶紧的，直接返回


        return watcher.value;
      }
    };
  }

  function stateMixin(Vue) {
    // 用户自定义cb,默认调用util中的nextTick, 共用同调用同一个
    Vue.prototype.$nextTick = function (cb) {
      nextTick(cb);
    };

    Vue.prototype.$watch = function (exprOrFn, cb, options) {
      var watcher = new Watcher(this, exprOrFn, cb, _objectSpread2(_objectSpread2({}, options), {}, {
        user: true
      }));

      if (options.immediate) {
        cb();
      }
    };
  }

  var ncname = "[a-zA-Z_][\\-\\.0-9_a-zA-Z]*"; // 标签名 ?:匹配不捕获

  var qnameCapture = "((?:".concat(ncname, "\\:)?").concat(ncname, ")"); // </my:xx>

  var startTagOpen = new RegExp("^<".concat(qnameCapture)); // 标签开头的正则 捕获的内容是标签名

  var endTag = new RegExp("^<\\/".concat(qnameCapture, "[^>]*>")); // 匹配标签结尾的 </div>

  var attribute = /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/; // 匹配属性的    aaa="aaa"  a='aaa'   a=aaa

  var startTagClose = /^\s*(\/?)>/; // 匹配标签结束的 >    >   <div></div>  <br/>
  function parseHTML(html) {
    // 解析开始标签 <div id="app" name="xxx">
    function parseStartTag() {
      var start = html.match(startTagOpen); // start[0] => "<div"

      if (start) {
        // 保存标签和属性
        var match = {
          tagName: start[1],
          // start[1] ==> div
          attrs: []
        }; // 匹配完了就要删除

        advance(start[0].length); // 删除html开始标签 start[0] ==> <div

        var _end, attr; // 处理开始标签的属性 如果没有遇到结束标签的标识符">", 并且匹配到了属性, 就将匹配到的attr保存到match对象上, 最终return


        while (!(_end = html.match(startTagClose)) && (attr = html.match(attribute))) {
          match.attrs.push({
            name: attr[1],
            // id
            value: attr[3] || attr[4] || attr[5] // app

          }); // 匹配完继续删除

          advance(attr[0].length);
        } // 最终就剩下 ">"


        if (_end) {
          advance(_end[0].length);
          return match;
        }
      }
    }

    function advance(n) {
      html = html.substring(n);
    }

    var root;
    var currentParent; // 父节点

    var stack = []; // 用于校验html标签书写是否规范, 标签是否配对, 开始标签存入栈中, 遇到结束标签 pop, 
    // 处理开始

    function start(tagName, attrs) {
      // console.log(tagName, attrs)
      var element = createASTElement(tagName, attrs); // 因为创建的是树tree,只能由一个根root

      if (!root) {
        root = element;
      }

      currentParent = element; // 解析的当前节点作为 下一次解析文本的父级元素 例如 <div id="app">hello</div>, <div id="app">生成的 AST对象就是hello的父级currentParent

      stack.push(element); // console.log("stack: ", stack)
    } // 处理文本


    function chars(text) {
      // console.log(text)
      // 文本可能是空文本
      // text = text.replace(/\s/g, '')
      text = text.trim();

      if (text) {
        currentParent.children.push({
          type: 3,
          text: text
        });
      }
    } // 结束标签处理 </div>
    // 1. 记录结束标签的父亲
    // 2. 当前标签父亲的儿子是谁
    // 3. 结束标签建立父子关系 


    function end(tagName) {
      // console.log("end....", tagName)
      var ele = stack.pop(); // 取出栈中的最后一个
      // console.log("ele,", ele)
      // if (tagName === ele.tag) {
      //   console.log('tagName,  ele.tagName', tagName, ele.tag)
      // } else {
      //   console.log('------> tagName,  ele.tagName', tagName, ele.tag)
      // }

      currentParent = stack[stack.length - 1];

      if (currentParent) {
        ele.parent = currentParent;
        currentParent.children.push(ele);
      }
    } // 生成AST


    function createASTElement(tagName, attrs) {
      return {
        tag: tagName,
        // 标签名
        type: 1,
        // 元素类型
        children: [],
        // 孩子列表
        attrs: attrs,
        // 属性集合
        parent: null // 父元素

      };
    }

    while (html) {
      // debugger
      // 查找到 "<"
      var textEnd = html.indexOf('<');

      if (textEnd == 0) {
        // 肯定是标签, 要么是<div> 开始标签, 要么是结束标签</div>
        // 解析匹配开始标签
        var startTagMatch = parseStartTag();

        if (startTagMatch) {
          start(startTagMatch.tagName, startTagMatch.attrs); // start函数内调用创建ast树的方法
          // 继续处理(处理文本或者结束标签)

          continue;
        } // 匹配上 < 也可能是结束标签, 此处用html.match, 因为html已经在上面的parseStartTag中,如果匹配了就已经截取删除了
        // 如果是结束标签, 


        var endTagMatch = html.match(endTag);

        if (endTagMatch) {
          advance(endTagMatch[0].length); // <div>

          end(endTagMatch[1]); // 将结束标签传入 

          continue;
        }
      } // 如果是文本保存并


      var text = void 0;

      if (textEnd > 0) {
        text = html.substring(0, textEnd);
      } // 截取删除


      if (text) {
        advance(text.length);
        chars(text); // 处理文本 hello {{name}}
      } // break;

    }

    return root;
  }

  var defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g;

  function genProps(attrs) {
    var str = '';

    for (var i = 0; i < attrs.length; i++) {
      var attr = attrs[i];

      if (attr.name === 'style') {
        (function () {
          var obj = {};
          attr.value.split(';').forEach(function (_item) {
            var _item$split = _item.split(':'),
                _item$split2 = _slicedToArray(_item$split, 2),
                key = _item$split2[0],
                value = _item$split2[1];

            obj[key] = value;
          });
          attr.value = obj;
        })();
      }

      str += "".concat(attr.name, ":").concat(JSON.stringify(attr.value), ",");
    }

    return "{".concat(str.slice(0, -1), "}"); // _c(div, {id:"app",style:{"color":"red"," fontSize":" 16px"}})
  }

  function gen(node) {
    if (node.type === 1) {
      return generate(node); // 生产元素节点的字符串
    } else {
      var text = node.text;

      if (!defaultTagRE.test(text)) {
        return "_v(".concat(JSON.stringify(text), ")");
      }

      var tokens = [];
      var lastIndex = defaultTagRE.lastIndex = 0;
      var match, index;

      while (match = defaultTagRE.exec(text)) {
        index = match.index;

        if (index > lastIndex) {
          tokens.push(JSON.stringify(text.slice(lastIndex, index))); // 匹配开始的下表 截取匹配字符串的长度
        } // 匹配变量


        tokens.push("_s(".concat(match[1].trim(), ")"));
        lastIndex = index + match[0].length;
      } // 如果是这种情况 hello {{name}} world {{age}} xxx, 需要把xxx加入到token中, 作为_v


      if (lastIndex < text.length) {
        tokens.push(JSON.stringify(text.slice(lastIndex)));
      }

      return "_v(".concat(tokens.join('+'), ")");
    }
  }

  function genChildren(ast) {
    var children = ast.children;

    if (children) {
      return children.map(function (child) {
        return gen(child);
      }).join(',');
    }
  }

  function generate(ast) {
    var children = genChildren(ast); // 生成儿子
    // `,${children}` 前面的, 要注意细节

    var code = "_c('".concat(ast.tag, "', ").concat(ast.attrs.length > 0 ? "".concat(genProps(ast.attrs)) : 'undefined', " ").concat(children ? ",".concat(children) : '', ")"); // console.log("code: ", code)

    return code;
  }

  function compileToFunctions(template) {
    // 将模板字符串解析成AST语法树
    var ast = parseHTML(template); // 静态代码优化
    // 代码生成: 根据ast树生成render方法

    var code = generate(ast);
    var render = new Function("with(this) { return ".concat(code, "}")); // 将字符串变成函数 限制取值范围 通过with来进行取值 稍后调用render函数就可以通过改变this 让这个函数内部取到结果了
    // let render = new Function(`with(this) { return ${code} }`)

    return render;
  }

  // 返回值是真实DOM, 调用处lifecycle.js中 赋值给了vue实例的$el属性上，保存着DOM
  function patch(oldVNode, vnode) {
    // ------------------- 处理初渲染流程，直接用初始VDOM 替换掉 原始DOM节点(#app)
    // 默认初始化时，时直接用虚拟节点创建出真实的DOM节点，替换掉老的DOM节点
    if (oldVNode.nodeType === 1) {
      // html dom 固有的属性, =1 表示是元素
      // debugger
      var el = createElm(vnode); // 产生真实的dom 

      var parentElement = oldVNode.parentNode; // 获取老的app的父亲 =》 body

      parentElement.insertBefore(el, oldVNode.nextSibling); // 当前的真实元素插入到app的后面

      parentElement.removeChild(oldVNode); // 删除老的节点

      return el; // 把创建的DOM返回
    } else {
      // ------------------- 处理更新流程, 两个虚拟DOM的比较 -------------------
      // 在更新时，拿老的虚拟节点 和 新的虚拟节点进行比较，将差异更新为真实的DOM
      // 1. 比较标签
      if (oldVNode.tag !== vnode.tag) {
        return oldVNode.el.parentNode.replaceChild(createElm(vnode), oldVNode.el);
      } // 2. 比较文本(因为文本的tag是undefined, 走到这里说明新老tag是一样相等的)
      // 标签一样，标签没有子元素，标签只有文本, 文本不同时的处理 <div>1</div>  <div>2</div>


      if (!oldVNode.tag) {
        // 如果文本不一致, 用vnode的text属性值更新 老的虚拟DOM上的el属性所代表的老的DOM节点的文本内容
        if (oldVNode.text !== vnode.text) {
          return oldVNode.el.textContent = vnode.text;
        }
      } // 3. 对比属性: 标签相同, 复用老节点，然后 比较标签的属性
      // 3.1 复用老节点，给新的虚拟node添加el属性


      var _el = vnode.el = oldVNode.el; // 3.2 比较属性并更新. 使用新的vnode作为参数, 原因是要把其作为整体传递过去, 要使用到最新的DOM节点的标签元素 el


      updateProperties(vnode, oldVNode.data); // 4. 对比儿子

      var oldChildren = oldVNode.children || []; // 也是虚拟DOM

      var newChildren = vnode.children || [];

      if (oldChildren.length > 0 && newChildren.length > 0) {
        // 更新儿子节点, 两个虚拟节点的儿子数组, dom元素
        updateChildren(oldChildren, newChildren, _el);
      } else if (oldChildren.length > 0) {
        // 老的有儿子，新的没有儿子
        _el.innerHTML = '';
      } else if (newChildren.length > 0) {
        // 新的有儿子，老的没有 => 创建并插入节点
        for (var i = 0; i < newChildren.length; i++) {
          // 浏览器有性能优化 不用自己在搞文档碎片了
          _el.appendChild(createElm(newChildren[i]));
        }
      }
    }
  } // 比较两个vnode, 相同元素 + key

  function isSameVNode(oldVnode, newVnode) {
    return oldVnode.tag === newVnode.tag && oldVnode.key == newVnode.key;
  } // 


  function updateChildren(oldChildren, newChildren, parent) {
    // 老的vnode
    var oldStartIndex = 0;
    var oldStartVnode = oldChildren[0];
    var oldEndIndex = oldChildren.length - 1;
    var oldEndVnode = oldChildren[oldEndIndex]; // 新的vnode

    var newStartIndex = 0;
    var newStartVnode = newChildren[0];
    var newEndIndex = newChildren.length - 1;
    var newEndVnode = newChildren[newEndIndex]; // 生成key-index的映射表

    function makeIndexByKey(children) {
      var map = {};
      children.forEach(function (child, index) {
        if (child.key) {
          map[child.key] = index;
        }
      });
      return map;
    }

    var map = makeIndexByKey(oldChildren); // 遍历两个数组 包含着虚拟节点, 只要一个循环完, 就结束

    while (oldStartIndex <= oldEndIndex && newStartIndex <= newEndIndex) {
      // 如果老的数组中的元素是null
      if (oldStartVnode == null) {
        oldStartVnode = oldChildren[++oldStartIndex];
      } // 从头向尾 遍历比较


      if (isSameVNode(oldStartVnode, newStartVnode)) {
        // 如果tag相同, 更新属性, 指针向后移动一个
        patch(oldStartVnode, newStartVnode);
        oldStartVnode = oldChildren[++oldStartIndex];
        newStartVnode = newChildren[++newStartIndex];
      } else if (isSameVNode(oldEndVnode, newEndVnode)) {
        // 从头到尾对比失败, 就从后向前比较
        patch(oldEndVnode, newEndVnode);
        oldEndVnode = oldChildren[--oldEndIndex];
        newEndVnode = newChildren[--newEndIndex];
      } else if (isSameVNode(oldStartVnode, newEndVnode)) {
        // 3. 老的头元素 与 新的 尾部 比较
        patch(oldStartVnode, newEndVnode);
        parent.insertBefore(oldStartVnode.el, oldEndVnode.el.nextSibling);
        oldStartVnode = oldChildren[++oldStartIndex];
        newEndVnode = newChildren[--newEndIndex];
      } else if (isSameVNode(oldEndVnode, newStartVnode)) {
        // 4. 老的尾 和 新的头
        patch(oldEndVnode, newStartVnode);
        parent.insertBefore(oldEndVnode.el, oldStartVnode.el);
        oldEndVnode = oldChildren[--oldEndIndex];
        newStartVnode = newChildren[++newStartIndex];
      } else {
        // 儿子之间没有关系, 用新的数组去查找映射关系
        // 1. 从新的数组中一个个查找, 找到新数组中的元素在老的数组中的索引位置
        var findIndex = map[newStartVnode.key]; // 2. 如果没有找到, 就是新增的, 插入到老的开始节点的前面

        if (findIndex == undefined) {
          parent.insertBefore(createElm(newStartVnode), oldStartVnode.el);
        } else {
          var findVNode = oldChildren[findIndex]; // 通过mapping的索引，找到老的虚拟节点的元素

          patch(findVNode, newStartVnode); // 比较老的和新的VDOM的属性和儿子   递归

          parent.insertBefore(findVNode.el, oldStartVnode.el); // 将查找并更新后的节点 findVNode DOM节点el 插入到老数组的开始指针索引的前面

          oldChildren[findIndex] = null; // 设置根据索引查找的移动的节点 为null, 避免数组塌陷
        }

        newStartVnode = newChildren[++newStartIndex]; // 新数组指针向后移动,并更新数组的开始节点 newStartVnode
      }
    } // 处理比较完成后有多余的
    // 如果新的多于老的, 并且在最后多的


    if (newStartIndex <= newEndIndex) {
      for (var i = newStartIndex; i <= newEndIndex; i++) {
        parent.appendChild(createElm(newChildren[newStartIndex]));
      }
    } // 如果老的数组还没有遍历完成, 老节点是不需要的节点,


    if (oldStartIndex <= oldEndIndex) {
      for (var _i = oldStartIndex; _i <= oldEndIndex; _i++) {
        var child = oldChildren[_i];

        if (child != null) {
          parent.removeChild(child.el);
        }
      }
    }
  }

  function createElm(vnode) {
    var tag = vnode.tag,
        children = vnode.children,
        key = vnode.key,
        data = vnode.data,
        text = vnode.text;

    if (typeof tag == 'string') {
      // 创建元素 放到vnode.el上
      // 创建DOM
      vnode.el = document.createElement(tag); // 更新属性

      updateProperties(vnode);
      children.forEach(function (child) {
        // 遍历儿子 将儿子渲染后的结果扔到父亲中
        vnode.el.appendChild(createElm(child));
      });
    } else {
      // 创建文件 放到vnode.el上
      vnode.el = document.createTextNode(text);
    }

    return vnode.el;
  } // 根据虚拟节点的data属性, 更新DOM的attrs

  function updateProperties(vnode) {
    var oldProps = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var el = vnode.el;
    var newProps = vnode.data || {}; // 老的有，新的没有 -> 删除

    for (var key in oldProps) {
      // oldProps: {id: 'a', name: 'input'}
      if (!newProps[key]) {
        // newProps: {xx: 'yy'}
        el.removeAttribute(key); // 当前的el就是复用后的el
      }
    } // 剩下的就是属性在 老的和新的都有, 或者新的有
    // 因为样式的写法是对象方式,单独处理


    var newStyle = newProps.style || {};
    var oldStyle = oldProps.style || {};

    for (var _key in oldStyle) {
      if (!newStyle[_key]) {
        el.style[_key] = '';
      }
    } // 1. 新的有，老的有；替换
    // 2. 新的有，老的没有；新增设置


    for (var _key2 in newProps) {
      if (_key2 === 'style') {
        // style属性是个对象
        for (var styleName in newProps.style) {
          el.style[styleName] = newProps.style[styleName];
        }
      } else if (_key2 === 'class') {
        el.className = newProps["class"];
      } else {
        // 新的有，老的没有，直接增加
        el.setAttribute(_key2, newProps[_key2]);
      }
    }
  } // 初渲染属性(创建)

  /* function updateProperties(vnode) {
    let el = vnode.el
    let newProps = vnode.data || {}
    for (let key in newProps) {
      if (key === 'style') {
        // style属性是个对象
        for (let styleName in newProps.style) {
          el.style[styleName] = newProps.style[styleName]
        }
      } else if (key === 'class') {
        el.className = el.class
      } else {
        el.setAttribute(key, newProps[key])
      }
    }
  } */

  // 生命周期也是一个插件, 需要在Vue实例的原型上挂载更新与render方法
  function mountComponent(vm, el) {
    callHook(vm, 'beforeMount'); // 1. 生成虚拟DOM => vm._render() 2. 渲染真实节点vm._update
    // 都是vm实例上的方法, render和update都是组件生命周期的一部分, 抽离成一个lifecycle文件转换处理生命周期, 理念上与初始化平级别 init - lifecycle
    // vm._update(vm._render())

    var updateComponent = function updateComponent() {
      vm._update(vm._render());
    };

    var updateCallback = function updateCallback() {};

    var isRenderWatcher = true;
    var watcher = new Watcher(vm, updateComponent, updateCallback, isRenderWatcher);
    callHook(vm, 'mounted');
  }
  function lifecycleMixin(Vue) {
    // 渲染页面
    Vue.prototype._update = function (vnode) {
      var vm = this;
      var preVnode = vm._vnode;

      if (!preVnode) {
        vm.$el = patch(vm.$el, vnode); // 新的vdom, 生成新的DOM, 替换掉老的DOM vm.$el, 然后返回这个新的DOM, 赋值给实例属性上 vm.$el
      } else {
        vm.$el = patch(preVnode, vnode);
      }

      vm._vnode = vnode;
    }; // 生成虚拟DOM


    Vue.prototype._render = function () {
      var vm = this;
      var render = vm.$options.render; // 调用vm.$options.render方法, new Function(`with(this) { return ${code}}`)
      // 因为render方法的字符串表示中有类似 _c, _v这种函数调用, 作用域(通过with)指向了this, call(vm), 那么this就是vm. 实例上的方法, 原型方法, 

      var vdom = render.call(vm); // console.log("vdom,", vdom)

      return vdom;
    };
  }
  function callHook(vm, hook) {
    var handlers = vm.$options[hook]; // vm.$options[hook] = vm.$options.created = [a,b,created,...]

    if (handlers) {
      for (var i = 0; i < handlers.length; i++) {
        handlers[i].call(vm);
      }
    }
  }

  function initMixin(Vue) {
    Vue.prototype._init = function (options) {
      // 选项挂载到vue实例上
      var vm = this;
      vm.$options = mergeOptions(vm.constructor.options, options); // console.log(vm.$options)

      callHook(vm, 'beforeCreate'); // 初始化中一个个不同的功能
      // 1. 数据的初始化: 初始化状态, 数据响应式, 数据变更, 视图更新, 数据劫持

      initState(vm);
      callHook(vm, 'created'); // 2. 初始化事件
      // 3. 数据渲染到页面
      // 如果有el属性, 说明需要渲染页面

      if (vm.$options.el) {
        vm.$mount(vm.$options.el);
      }
    };

    Vue.prototype.$mount = function (el) {
      var vm = this;
      el = document.querySelector(el);
      vm.$el = el;
      var options = vm.$options;

      if (!options.render) {
        var template = options.template;

        if (!template && el) {
          template = el.outerHTML;
        } // 将模板编译成render函数


        var render = compileToFunctions(template);
        options.render = render;
      } // 挂载组件 属于生命周期的一部分 (创建VDOM和渲染真实节点的开始 vm上有render, el是被替换的DOM节点)
      // debugger


      mountComponent(vm);
    };
  }

  function renderMixin(Vue) {
    // 生成虚拟DOM
    // _c(div, {id:"app",style:{"color":"red"}} ,_c(p, undefined ,_v("hello world zf"+_s(school.name))))
    Vue.prototype._c = function () {
      // 创建虚拟dom元素
      return createElement.apply(void 0, arguments);
    }; // 创建虚拟dom文本元素


    Vue.prototype._v = function (text) {
      return createTextVnode(text);
    }; // stringify


    Vue.prototype._s = function (val) {
      // console.log('_s: val', val, typeof val)
      return val === null ? '' : _typeof(val) === 'object' ? JSON.stringify(val) : val;
    };
  } // 其实还是根据ast对象树 生成vdom

  function createElement(tag) {
    var data = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    for (var _len = arguments.length, children = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
      children[_key - 2] = arguments[_key];
    }

    return vnode(tag, data, data.key, children);
  }

  function createTextVnode(text) {
    return vnode(undefined, undefined, undefined, undefined, text);
  } // 用来产生虚拟dom的


  function vnode(tag, data, key, children, text) {
    return {
      tag: tag,
      data: data,
      key: key,
      children: children,
      text: text
    };
  }

  function initGlobalApi(Vue) {
    Vue.options = {};

    Vue.mixin = function (mixin) {
      // debugger
      this.options = mergeOptions(this.options, mixin);
    };
  }

  function Vue(options) {
    this._init(options);
  } // 扩展原型
  // 初始化方法


  initMixin(Vue);
  lifecycleMixin(Vue);
  renderMixin(Vue);
  stateMixin(Vue); // 扩展Vue静态方法

  initGlobalApi(Vue);

  return Vue;

})));
//# sourceMappingURL=vue.js.map

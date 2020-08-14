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
      }

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
  var strategy = {};

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

  var Observer = /*#__PURE__*/function () {
    function Observer(value) {
      _classCallCheck(this, Observer);

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
          observe(item);
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
  }();

  function defineReactive(data, key, value) {
    // 递归观察data嵌套的对象
    observe(value);
    Object.defineProperty(data, key, {
      get: function get() {
        console.log('数据获取了');
        return value;
      },
      set: function set(newValue) {
        if (newValue === value) return;
        console.log('数据设置了'); // 给data属性设置一个对象,设置的对象也需要进行观测

        observe(newValue);
        value = newValue;
      }
    });
  } // 观测数据的变化, 更新视图


  function observe(data) {
    if (data.__ob__) {
      return data;
    } // 只观测对象或数组


    if (_typeof(data) !== 'object' || data == null) {
      return;
    } // 使用类的方式: 1. 可以清楚的知道这个属性是哪个类的实例 2. 观测数据的功能是高内聚的


    return new Observer(data);
  }

  function initState(vm) {
    var opts = vm.$options; // 根据不同的选项, 做不同的拆分处理, data如何处理, props如何处理等

    if (opts.props) ;

    if (opts.data) {
      initData(vm);
    }
  }


  function initData(vm) {
    var data = vm.$options.data; // data可能是函数, 也可能是对象, 函数就直接执行,结果返回对象,赋值给vm也是为了可以通过vue实例获取到数据劫持后的数据(引用)

    vm._data = data = typeof data === 'function' ? data.call(vm) : data; // 当我去vm上取属性时 ，帮我将属性的取值代理到vm._data上

    for (var key in data) {
      proxy(vm, '_data', key);
    }

    observe(data);
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

  function patch(oldDOMNode, vnode) {
    // 将虚拟节点转化成真实节点
    var el = createElm(vnode); // 产生真实的dom 

    var parentElm = oldDOMNode.parentNode; // 获取老的app的父亲 =》 body

    parentElm.insertBefore(el, oldDOMNode.nextSibling); // 当前的真实元素插入到app的后面
    // parentElm.insertBefore(el, oldDOMNode)

    parentElm.removeChild(oldDOMNode); // 删除老的节点
    // 把创建的DOM返回

    return el;
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
    var el = vnode.el;
    var newProps = vnode.data || {};

    for (var key in newProps) {
      if (key === 'style') {
        // style属性是个对象
        for (var styleName in newProps.style) {
          el.style[styleName] = newProps.style[styleName];
        }
      } else if (key === 'class') {
        el.className = el["class"];
      } else {
        el.setAttribute(key, newProps[key]);
      }
    }
  }

  // 生命周期也是一个插件, 需要在Vue实例的原型上挂载更新与render方法
  function mountComponent(vm, el) {
    callHook(vm, 'beforeMount'); // 1. 生成虚拟DOM => vm._render() 2. 渲染真实节点vm._update
    // 都是vm实例上的方法, render和update都是组件生命周期的一部分, 抽离成一个lifecycle文件转换处理生命周期, 理念上与初始化平级别 init - lifecycle

    vm._update(vm._render());

    callHook(vm, 'mounted');
  }
  function lifecycleMixin(Vue) {
    // 渲染页面
    Vue.prototype._update = function (vdom) {
      var vm = this;
      patch(vm.$el, vdom);
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
      // debugger
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
  renderMixin(Vue); // 扩展Vue静态方法

  initGlobalApi(Vue);

  return Vue;

})));
//# sourceMappingURL=vue.js.map

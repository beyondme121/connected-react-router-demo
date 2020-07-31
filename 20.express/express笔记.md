

[TOC]

## 模拟第一版本express

### 用例
```js
const express = require('./express')
const app = express()
app.get('/', function (req, res) {
  res.end('ok')
})
app.get('/home', function (req, res) {
  res.end('home')
})
app.get('/about', function (req, res) {
  res.end('about')
})
app.listen(3000, () => {
  console.log(`server start at 3000`)
})
```

### 返回对象, 对象挂方法
- 函数调用返回一个对象 app, 有get,和 listen方法, 可以实现如下基本功能
- 内部维护数组(栈), 监听端口, 判断注册的路由匹配,然后调用匹配的处理函数
- 源码文件目录构思: index.js, lib/express,(创建应用application)

```js

const http = require('http')
const url = require('url')
let routers = [
  {
    method: 'all',
    path: '*',
    handler(req, res) {
      res.end(`Cannot ${req.method} ${req.url}`)
    }
  }
]
function createApplication() {
  let obj = {
    get(path, handler) {
      routers.push({
        method: 'get',
        path,
        handler
      })
    },
    listen() {
      const server = http.createServer((req, res) => {
        const { pathname } = url.parse(req.url)
        let requestMethod = req.method.toLowerCase()
        for (let i = 1; i < routers.length; i++) {
          let { method, path, handler } = routers[i]
          if (requestMethod === method && pathname === path) {
            return handler(req, res)
          }
        }
        return routers[0].handler(req, res)
      })
      server.listen(...arguments)
    }
  }
  return obj
}
module.exports = createApplication;

```

## 第二版
- 改造
  - 1. 每次创建应用 application, 都要记住路由系统 全局的routers,启动多个应用, 会公用一个routers, 就乱套了
    ```js
    app.listen(3000);
    app.listen(4000);
    ```
  - 2. createApplication就是创建应用 app, app就是一个对象, 每次创建应用都要返回一个对象, 对象不好扩展!
    - > 只要逻辑比较多, 都要通过类来封装
    - 以前的写法, 对象上挂属性, 属性的类型是方法,但是很难维护,所以使用类的方式
    ```js
    let obj = {
      aaa () {},
      bbb () {},
    }
    ```
    - 把属性都作为这个构造函数(类)的原型上的属性,这样属性的方法很好扩展,实例化并复写方法即可
    ```js
    function XX() {}
    XX.prototype.say = function (param) {
      console.log('say: ', param)
    }
    XX.prototype.print = function (param) {
      console.log('print: ', param)
    }
    
    // 以前的写法,为了快速返回类的实例,使用闭包,自执行函数
    let xx = (function () {
    function XX() {

    }
    XX.prototype.say = function (param) {
      console.log('say: ', param)
    }
    XX.prototype.print = function (param) {
      console.log('print: ', param)
    }
    return new XX()
    })();

    xx.say('hello')
    ```

  - 3. 把路由单独拿出去, 每次创建应用app, 都要产生一个全新的router, 就要想到,createApplication函数中每次都new Router()
- action
  - 1. 创建应用app和创建出来的结果单独分离出来 -> 创建应用于应用的分离
  ```js
  const Application = require('./application')

  // 创建应用
  function createApplication () {
    return new Application()  // 产生应用
  }
  module.exports = createApplication
  ```

  - 2. application.js
  > 1. 使用类来扩展对象的方法,类的特性: 每次都是要给新的对象, 对象之间的方法方便扩展
  > 2. Application.prototype.get, Application.prototype.listen, Application.prototype.xxx
  > 3. <font color="red">路由如何处理, 现在还是共享routers,将路由挂载到类的实例上</font>
  ```js
  const http = require('http')
  const url = require('url')
  const routers = [
    {
      method: 'get',
      path: '*',
      handler(req, res) {
        console.log(`Cannot ${req.method} ${req.url}`)
      }
    }
  ]
  // 为了便于维护与扩展,使用类的方式, 外部通过new的方式创建实例
  function Application() { }

  Application.prototype.get = function (path, handler) {
    routers.push({
      method: 'get',
      path,
      handler
    })
  }

  Application.prototype.listen = function () {
    let server = http.createServer((req, res) => {
      let { pathname } = url.parse(req.url)
      let requestMethod = req.method.toLowerCase()
      for (let i = 1; i < routers.length; i++) {
        let { path, method, handler } = routers[i]
        if (pathname === path && requestMethod === method) {
          return handler(req, res)
        }
      }
      // 如果都没有匹配上,执行第一个router
      return routers[0].handler(req, res)
    })
    server.listen(...arguments)
  }

  module.exports = Application
  ```

### 如何实现每次创建应用,路由都是新的
  - 将路由的数组, 放到构造函数中, 这样就保证了每次都是新的
  ```js
  function Application() { 
    this.routers = [
      {
        method: 'get',
        path: '*',
        handler(req, res) {
          console.log(`Cannot ${req.method} ${req.url}`)
        }
      }
    ]
  }
  ```

### express为什么使用构造函数而不是类

  ```js
  function Application () {}
  ```
  - express那个年代还没有class
  - class类是不能执行的,如Application()这样是不行的, 但是构造函数即可以new，也可以直接执行Application()
  - express是基于回调函数的, 让类可以通过函数调用的方式来执行



### 应用和路由的解耦合
- **将应用和路由的逻辑进行拆分**
- 路由做的事情越多,应用做的也就越多, 能否将路由再次抽离一层
- Application只是让路由push,或者处理的工作

#### 路由的改造
- 抽离成构造函数或类,每次new Application时, 就new Router
- new Router不希望供应用外部被访问,希望是内部的私有变量
- 把路由再单除抽离成一个类class

```js
function Application() {
  this.routers = [
    {
      method: 'get',
      path: '*',
      handler(req, res) {
        console.log(`Cannot ${req.method} ${req.url}`)
      }
    }
  ]
}
```

**变更为**

- 创建router目录

```js
function Application() {
  this._router = new Router()
}
```

- express/lib/router/index.js

```js
function Router() {
  // 路由的实例属性
  this.stack = [
    {
      method: 'get',
      path: '*',
      handler(req, res) {
        console.log(`Cannot ${req.method} ${req.url}`)
      }
    }
  ]
}
module.exports = Router
```

- **当调用app.get时,我们不希望直接操作this._router.stack.push(...), 从设计角度来讲,父类不直接操作子类或者其他类中的数据, 而是由子类或者其他的类暴露接口(操作数据的方法)，让父类调用😘**

```js
// 错误写法
Application.prototype.get = function (path, handler) {
    this._router.stack.push({...})
}
```

- 类之间的这种模式,必须vue的插件

#### 路由类暴露方法供App调用

- 原始写法,不推荐的写法

```js
Application.prototype.get = function (path, handler) {
  this._router.stack.push({...})
}
```

那么如何让路由router处理和application一样的操作呢? 处理get,路径时path,hanlder等, 让router暴露方法,

**给Router类注册不同的方法**(推荐写法)

`this._router.get(path, handler)`

```js
Application.prototype.get = function (path, handler) {
  this._router.get(path, handler)
}
Application.prototype.post = function (path, handler) {
  this._router.post(path, handler)
}
```

路由的注册已经写完了, 当请求到来的时候, 依然是遍历Router类中的实例属性, 这又违背了父类直接访问子类属性的原则!

调用了Router类中的实例属性**this._router.stack**

```js
Application.prototype.listen = function () {
  let server = http.createServer((req, res) => {
    let { pathname } = url.parse(req.url)
    let requestMethod = req.method.toLowerCase()
    for (let i = 1; i < this._router.stack.length; i++) {
      let { path, method, handler } = this._router.stack[i]
      if (pathname === path && requestMethod === method) {
        return handler(req, res)
      }
    }
    // 如果都没有匹配上,执行第一个router
    return this._router.stack[0].handler(req, res)
  })
  server.listen(...arguments)
}
```

##### 路由设计上的改造

- 不能在listen中遍历路由, 将遍历的操作, 交给路由自己去处理，各司其职
- 如果路由匹配不上, 整个应用给出处理结果, 路由应该告诉应用app,我处理不了, 你(应用)来处理，告诉应用整个操作 使用回调

##### 路由流程描述

- 当请求来了, 交给路由处理<font color="red"> `this._router.handle(req, res, done)`</font>
- 路由处理不了, 就调用app中提供的done方法进行处理

```js
Application.prototype.listen = function () {
  let server = http.createServer((req, res) => {
    // 路由外部提供的方法,专门用于处理路由不匹配的情况
    function done() {
      console.log(`Cannot ${req.method} ${req.url}`)
    }
    this._router.handle(req, res, done)
    // let { pathname } = url.parse(req.url)
    // let requestMethod = req.method.toLowerCase()
    // for (let i = 1; i < this._router.stack.length; i++) {
    //   let { path, method, handler } = this._router.stack[i]
    //   if (pathname === path && requestMethod === method) {
    //     return handler(req, res)
    //   }
    // }
    // // 如果都没有匹配上,执行第一个router
    // return this._router.stack[0].handler(req, res)
  })
  server.listen(...arguments)
}
```

#### 给Router类添加handle方法

handle处理函数

```js
const url = require('url')
Router.prototype.handle = function (req, res, out) {
  const { pathname } = url.parse(req.url)
  const requestMethod = req.method.toLowerCase()
  // 这回i不能等于1, 因为处理不了的函数的职责交给了路由以外的app来处理
  for (let i = 0; i < this.stack.length; i++) {
    let { path, method, handler } = this.stack[i]
    if (pathname === path && requestMethod === method) {
      handler(req, res)
    }
  }
  // 如果都没有匹配上, 调用外部的传递进来的"处理不了"的函数
  out()
}
```

构造函数去掉实例属性中的默认处理方法

```js
function Router() {
  // 路由的实例属性
  this.stack = [
    // {
    //   method: 'get',
    //   path: '*',
    //   handler(req, res) {
    //     console.log(`Cannot ${req.method} ${req.url}`)
    //   }
    // }
  ]
}
```

application中的listen方法

```js
Application.prototype.listen = function () {
  let server = http.createServer((req, res) => {
    function done() {
      console.log(`Cannot ${req.method} ${req.url}`)
    }
    this._router.handle(req, res, done)
    // let { pathname } = url.parse(req.url)
    // let requestMethod = req.method.toLowerCase()
    // for (let i = 1; i < this._router.stack.length; i++) {
    //   let { path, method, handler } = this._router.stack[i]
    //   if (pathname === path && requestMethod === method) {
    //     return handler(req, res)
    //   }
    // }
    // // 如果都没有匹配上,执行第一个router
    // return this._router.stack[0].handler(req, res)
  })
  server.listen(...arguments)
}
```



## 第三版 增强功能

### 1. 回调函数的第三个参数, next函数

> - 有了next这种写法,还有异步的写法,肯定就不是for循环了, Router.prototype.handle中定义了所有路由的遍历使用了for循环
> - 因为for循环是一个个执行的, 而next是可以处理当异步的逻辑处理完成后, 可以手动的去调用next, 让路由handler继续往下走
> - 其他库有类似的处理方式: vue-router, 使用了next方法, 一个个调用异步方法

```js
const express = require('express')
const app = express()
app.get('/', function (req, res, next) {
  console.log(1)
  setTimeout(() => {
    next()    // 3s之后执行下一个路由的handler
  }, 3000)
})
app.get('/', function (req, res, next) {
  console.log(2)
  next()
})
app.get('/', function (req, res, next) {
  console.log(3)
  next()
  res.end('end')
})
app.listen(3000, () => {
  console.log(`server start at 3000`)
})
```

### 2. restful API风格的路由写法

- 同一个路径, 根据不同的方法,做不同的处理，目前用的比较少，因为所有的功能都写在一起

```js
app.route('/home')
  .get(function (req, res) {
    res.end('查询')
  })
  .post(function (req, res) {
    res.end('增加')
  })
```

### 3. 更复杂的处理函数写法

路径后可以写多个处理函数

```js
app.get('/', function (req, res, next) {
  console.log(1)
  setTimeout(() => {
    next() // 3s之后执行下一个路由的handler
  }, 3000)
}, function (req, res, next) {
  console.log('setTimeout')
  next()
})
```

简化写法

```js
app.get('/', fn1, fn2, fn3,...)
app.get('/', fn4)
app.get('/', fn5)
```



### 3. 总结增强的方面

#### 3.1 同一个路径可以有多个不同的处理函数

请求/路径, handler不同

```js
app.get('/', function (req, res, next) {
  console.log(1)
  setTimeout(() => {
    next()    // 3s之后执行下一个路由的handler
  }, 3000)
})
app.get('/', function (req, res, next) {
  console.log(2)
  next()
})

// 第二种写法,一个路径/home, 有不同的处理函数, get,post的函数
app.route('/home')
  .get(function (req, res) {
    res.end('查询')
  })
  .post(function (req, res) {
    res.end('增加')
  })
```

#### **3.2 路径和处理函数是一对多关系**

### 4. express框架的设计理念

- 将路由拆分成Layer和Route类，分别表示注册一次路由的"层", 和 每层对应的真实的实际的路由处理函数

```js
// layer.js
// Layer类只存放路径 和 handler, 表示 每完成一个app.method('/',...)就是一层, 可以有多个函数,
// 每个router种放的是一个Layer, 每个Layer中放的是1个route
function Layer(path, handler) {
  this.path = path
  this.handler = handler
}
module.exports = Layer
```

> route.js

```js
function Route() {
  this.stack = []
}
module.exports = Route
```

### 5. 改造

#### Router.prototype.get方法的修改

get方法中,就不是直接放一个对象了, 而是通过构造一个Layer实例,把Layer实例放到stack中

```js
// 不再是这样了
this.stack.push({
    path, method: 'get', handler
})
```



#### Router.prototype.handle

此时路由具有了链式调用的处理方式，即请求来的时候, 要走完第一然后再走第二个, 不能是同步的执行了, 即不能使用for循环了



#### 流程

```js
app.get('/',
  function (req, res, next) {
    console.log(1)
    setTimeout(() => {
      next() // 3s之后执行下一个路由的handler
    }, 3000)
  },
  function (req, res, next) {
    console.log('setTimeout')
    next()
  })

app.get('/', function (req, res, next) {
  console.log(2)
  next()
})
```

1. app原型方法get, 生成路由系统, 调用路由实例的get方法

```js
function Application() {
  this._router = new Router()
}
Application.prototype.get = function (path, handler) {
  this._router.get(path, handler)  // this._route是通过构造函数实例化出来的
}
```

2. 先创建route, 然后把route放在layer上
3. 外层的layer匹配到调用route.dispatch, 内层的layer放的是一个个函数

```js
// 这个route,就是layer对应的route
Router.prototype.get = function (path, handler) {
  // 创造一个route
  let route = this.route(path)
}
```

4. this.route说明Router类原型上的方法

```js
Router.prototype.route = function (path) {
    // 内部完成 创建route, layer, 建立layer和route的关系
    let route = new Route()
    // Layer中的参数就是路径和处理函数,此处的layer就是路径和route中dispatch方法,让route中所有的handler执行的方法
    let layer = new Layer(path, route.dispatch.bind(route))
    layer.route = route
    // 将layer加入到Router实例的stack
    this.stack.push(layer)
    return route
}
```

5. 看一下Route和Layer类的定义

> 1. 第一层的layer, path是用户定义的路径, handler是route中的一次调用真实路由处理函数的dispatch方法
> 2. 第二层layer的保存的是真实的处理函数, push到Route中的stack中

```js
// 一个类复用了两个地方, 第一个layer用于保存路径+route的dispatch方法,用于调用触发route中所有的处理函数handler
// 第二个layer是保存所有handlers, 只保存hanlders,不包含路径, 路径默认就是""
function Layer(path, handler) {
  this.path = path
  this.handler = handler
}
module.exports = Layer

function Route() {
  this.stack = []
}
module.exports = Route
```



```js
// path: 用户定义的路径
// handlers: 用户定义的真实的处理方法
Router.prototype.get = function (path, handlers) {
  // 创造一个route,以及第一层的layer, 建立layer于route的关系
  let route = this.route(path)
  // 将所有的handler保存到route中
  route.get(handlers)
}
```

- 根据route.get(handlers)可以得知, Route类中有原型方法, get, 将所有的handlers保存到类的实例stack中

```js
function Route () {
    this.stack = []
}
Route.prototype.get = function (handlers) {
    // route中保存的handler要记录两个内容, 请求方法和处理函数, 复用Layer, 生成layer的实例，然后保存到stack中
    // 遍历handlers
    for (let i = 0; i < handlers.length; i++) {
        let layer = new Layer('', handlers[i])
        layer.method = 'get'
        this.stack.push(layer)
    }
}
```

- 注意的一点, app.get('/xx', fn1, fn2..)中, 是在Applicaiton中的get方法中收集所有的handlers

```js
Application.prototype.get = function (path, ...handlers) {
    this._router.get(path, handlers)  // handlers作为数组传递给Router类中的get方法
}
```

### 6. 请求到来后,处理路由系统

#### 6.1 请求到来

> 调用路由Router实例的handle方法,让路由自己处理, this._router.handle(req, res, done)

```js
Application.prototype.listen = function () {
    let server = http.createServer((req, res) => {
        function done() {
          console.log(`Cannot ${req.method} ${req.url}`)
        }
        // 调用路由Router实例的handle方法,让路由自己处理
        this._router.handle(req, res, done)
    })
}
```

#### 6.2 Router.prototype.handle方法处理路由的入口

- 处理外层路由, 只匹配路径pathname和调用真实路由的dispatch方法, "一层"Layer
- 只匹配路径,不匹配方法, 方法的匹配
- 根据请求路径, 在最外层路由中一个个的筛查路径, 如果匹配上就执行
- 一个个的去执行,使用这种套路

```js
Router.prototype.handle = function (req, res, out) {
  const { pathname } = url.parse(req.url)
  // 从第一个layer中查找
  let idx = 0
  function next() {
    
  }
  next()
}
```

- 终止条件,以及执行的条件

> 1. if (idx >= this.stack.length) return out()
>
> 2. 取出外层_router的stack数组的每一项

```js
Router.prototype.handle = function (req, res, out) {
  const { pathname } = url.parse(req.url)
  // 根据请求路径, 在最外层路由中一个个的筛查路径, 如果匹配上就执行
  // 从第一个layer中查找
  let idx = 0
  function next() {
    if (idx >= this.stack.length) return out()
    let layer = this.stack[idx++]
    if (layer.path === pathname) {
      layer.handler(req, res, next)
    } else {
      next()
    }
  }
  next()
}
```

#### 6.3 处理内层真实路由handler

- 因为在注册路由时, 会调用app.get('/', (req, res, next) => {}), 就会触发 Router.prototype.get函数的执行
- 然后会调用this.route(path) 路由系统就会创建layer，以及路由表route, 把route挂载到layer的属性上
- Router.prototype.route中在新建第一层layer时, 会传入route.dispatch方法, 用于调用路由表中路由处理函数
- 实现dispatch方法, 一个个的拿出来, 一个个的执行, 判断方法是否一致, 一致就去执行

```js
Route.prototype.dispatch = function (req, res, out) {
    let requestMethod = req.method.toLowerCase()
    let idx = 0
    const next = () => {
        if (idx >= this.stack.length) return out()
        let layer = this.stack[idx++]
        if (layer.method === requestMethod) {
            layer.handler(req, res, next)
        } else {
            next()  // 方法匹配不上, 就执行下一个
        }
    }
    next()
}
```

### 7. 再次优化

我们发现在next函数中(无论是Router中的handle方法还是route中的dispatch方法), 调用了如下代码

```js
Router.prototype.handle = function (req, res, out) {
    // ...
    const next = () => {
        if (idx >= this.stack.length) return out()
        let layer = this.stack[idx++]
        // 此处需要优化的, Router的方法(handle),直接使用了layer实例的属性和方法
        if (layer.path === pathname) {
            layer.handler(req, res, next)
        } else {
            next()
        }
    }
    next()
}
```

> **Router的方法(handle),直接使用了layer实例的属性和方法**
>
> **layer.path**:Router类使用了Layer类实例的属性
>
> layer.handler(req, res, next)

#### 8. 将判断路径和方法的匹配交给Layer类自身去处理

暴露子类的方法, 而不是直接使用子类的属性, 方便扩展

```js
if (layer.path === pathname) {
    layer.handler(req, res, next)
} else {
    next()
}
```

改造为

```js
if (layer.match(pathname)) {
    // ...
}
```

所以,在Layer类中添加原型方法

```js
Layer.prototype.match = function (pathname) {
  return this.path === pathname
}
```

同理, 让layer.handler(req, res, next)更加有语义化,以及各司其职的考虑

```js
Layer.prototype.handle_request = function (req,res,next) {
    return this.handler(req,res,next);
}
```



- 最终改造的结果是

```js
function next() {
    if (idx >= that.stack.length) return out()
    let layer = that.stack[idx++]
    if (layer.match(pathname)) {
      layer.handle_request(req, res, next)
    } else {
      next()
    }
}
```

```js
Layer.prototype.match = function (pathname) {
  return this.path === pathname
}
Layer.prototype.handle_request = function (req, res, next) {
  return this.handler(req, res, next)
}
```

### 8. 处理不同的请求方法

- 第三方包, methods，这个包express是基于这个包的，不用单独安装了

#### 1. application.js中的请求方法

```js
Application.prototype.get = function (path, ...handlers) {
  this._router.get(path, handlers)
}
```

变更为

```js
const methods = require('methods')
methods.forEach(method => {
  Application.prototype[method] = function (path, ...handlers) {
    this._router[method](path, handlers)
  }
})
```

#### 2. router/index.js

```js
Router.prototype.get = function (path, handlers) {
    let route = this.route(path)
    route.get(handlers)
}
```

改造成

```js
methods.forEach(method => {
  Router.prototype[method] = function (path, handlers) {
    let route = this.route(path)
    route[method](handlers)
  }
})
```

#### 3.  Route的get方法

```js
Route.prototype.get = function (handlers) {
  for (let i = 0; i < handlers.length; i++) {
    let layer = new Layer('', handlers[i])
    layer.method = 'get'
    this.stack.push(layer)
  }
}
```

改造成

```js
methods.forEach(method => {
  Route.prototype[method] = function (handlers) {
    for (let i = 0; i < handlers.length; i++) {
      let layer = new Layer('', handlers[i])
      layer.method = method
      this.stack.push(layer)
    }
  }
})
```



## express和koa区别

在于路由函数中是否使用了promise， express的回调handler中没有使用promise，没有等待下一个函数执行的效果

- express是希望通过回调来处理
- koa使用promise来处理

express示例

- 同步执行同步的方法

```js
app.get('/', function (req, res, next) {
  console.log(1)
  next()
  console.log(2)
})
app.get('/', function (req, res, next) {
  console.log(3)
  next()
  console.log(4)
})

```

> 输出结果 1 3 4 2

- 验证没有等待效果 await, 按照koa的逻辑, 因该等待promise执行完成之后, 再输出2，但是express内部的handler不是promise

```js
app.get('/', async (req, res, next) => {
  console.log(1)
  await next()		// 不会等待下一个hanlder的等待, 下一个handler触发了,就继续向下执行,输出2
  console.log(2)
})
app.get('/', async (req, res, next) => {
  await new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve('ok')
    }, 1000);
  })
  console.log(3)
  next()
  console.log(4)
})
```

> 输出结果
>
> 1 2 等待1s后 输出 3 4



#### 1. express写法

next函数的调用就是一个普通函数的执行

```js
const next = () => {
    if (idx > this.stack.length) return out()
    let layer = this.stack[idx++]
    if (layer.match(pathname)) {
        layer.handle_request(req, res, next)
    } else {
        next()
    }
}
next()
```

#### 2. koa写法

- 模拟, 传递的参数ctx, dispatch等, 函数外层包裹了Promise.resolve()把函数promise化

```js
const next = () => {
    return Promise.resolve(layer.handle_request(req, res, next))  
}
return next()
```



## 优化点

### 1. 路由优化

#### 1. 背景

当一个layer中, 挂载的route中有很多个处理函数, 这些函数对象的请求方法只有get, 但是用户发起的api请求时, 发送了一个post请求,  此时, express依然会先匹配路径, 比如匹配/user路径, 然后到真实的路由回调函数中依次遍历查找, 是否有post请求, 这样操作其实是没有必要的，因为已经知道/user目录只有get请求，还要一次次的next方法去判断请求方法是否匹配，最后再out()就很消耗性能

#### 2. 解决方案

- 给内层route实例上添加methods方法, 标识是否有某个请求方法, 有就是true，标识这个路由表具有哪些方法
- 外层路由handle方法中判断,如果layer.route.methods[req.method.toLowerCase()]为true, 就执行dispatch, 继续查找二级路由表，否则跳过本层layer

```js
function Route() {
  this.stack = []
  this.methods = {}	// 路由表增加methods实例属性
}

methods.forEach(method => {
  Route.prototype[method] = function (handlers) {
    for (let i = 0; i < handlers.length; i++) {
      // ...
      // 记录当前路由表都有哪些方法
      this.methods[method] = true // {get: true}
	  // ...
    }
  }
})
```

- 路由表中记录了有哪些方法之后,在路由router判断是否执行dispatch的地方进行判断

> layer.route.methods[req.method.toLowerCase()] 如有路由表中有当前请求的方法, 才进去查找并执行

```js
Router.prototype.handle = function (req, res, out) {
  const next = () => {
    //...
    if (layer.match(pathname)) {
      if (layer.route.methods[req.method.toLowerCase()]) {
        layer.handle_request(req, res, next)
      } else {
        next()
      }
    } else {
      next()
    }
  }
  next()
}
```



### 2. 路由懒加载

如果程序没有listen,也没有app.get，那初始化application就创建路由系统,显然不太合理

我们希望,只有注册路由或者listen的时候才加载实例化路由

```js
function Application() {
  // this._router = new Router()
}
```

变更为

```js
Application.prototype.lazy_route = function () {
  if (!this._router) {
    this._router = new Router()
  }
}
```

- 注册路由的时候调用lazy_route

```js
methods.forEach(method => {
  Application.prototype[method] = function (path, ...handlers) {
    this.lazy_route()
    this._router[method](path, handlers)
  }
})
```

- listen中调用

```js
Application.prototype.listen = function () {
  let server = http.createServer((req, res) => {
    this.lazy_route()
    function done() {
      console.log(`Cannot ${req.method} ${req.url}`)
    }
    // 让路由系统自己处理路由
    this._router.handle(req, res, done)
  })
  server.listen(...arguments)
}
```



## 中间件

### 1. 用途

1. 扩展属性和方法
2. 可以决定是否向下执行
3. 控制权限，针对某个路由进行拦截 （一般放在要拦截的路由的前面）

### 2. 用例

```js
const express = require('./express');
const app = express();
// 在koa中路由(路径匹配到 方法一样才执行)和中间件(一定会执行)的差异 
// 在express里 （路由的特点是 路径方法一样就执行） 中间件 (路径满足就会执行 和cookie中的路径是一样  )

// 1.扩展属性和方法
// 2.可以决定是否向下执行
// 3.控制权限，针对某个路由进行拦截 （一般放在要拦截的路由的前面）
app.use('/',function (req,res,next) {
    console.log(1);
    next();
},function (req,res,next) {
    console.log(2);
    next();
},function (req,res,next) {
    console.log(3);
    next();
})
app.use(function(req,res,next){
    console.log(4);
    next();
})
app.use('/user',function(req,res,next){
    console.log('/user');
    next();
})
app.get('/user/add',function (req,res) {
    console.log('user add');
})
app.get('/useradd',function (req,res) {
    console.log('useradd');
})
app.listen(3000);
```



### 3. 中间件注册: app.use的实现

- application.prototype.use

```js
// app.use(...) 参数不确定, 可能是两个, 也可能是一个, 也可能是多个, 所以干脆, 使用arguments
Application.prototype.use = function () {
  // 中间件是挂载到路由上的,所以要初始化路由系统
  this.lazy_route()
  // 注册中间件的工作交给路由
  this._router.use(...arguments)
}
```

- 实现路由系统的use方法

```js
Router.prototype.use = function (path, handler) {
    // 参数处理,入参可能是1，2，或多个
    if (typeof handler !== 'function') { // 说明只传了1个, 没有路径的中间件, 匹配所有请求
        handler = path
        path = '/'
    }
    // 把所有的注册的请求函数, 都放在layer上, 就一层, 判断arguments中的每一项是否为函数,如果是就放入路由系统中的一个layer上
    Array.from(arguments).forEach(item => {
        if (typeof item === 'function') {
            let layer = new Layer(path, item)
            layer.route = undefined // 区别于路由, 强调一下就是没有路由表
            this.stack.push(layer)
        }
    })
}
```



### 4. 用户请求来了,进行匹配中间件,改造Router.prototype.handle

判断是路由的layer中是否有route, 如果有说明是路由，没有就是中间件，不用判断请求方法

原始写法

```js
const next = () => {
    // console.log("hello")
    if (idx >= this.stack.length) return out()
    let layer = this.stack[idx++]
    if (layer.match(pathname)) {
       if (layer.route.methods[req.method.toLowerCase()]) {
           layer.handle_request(req, res, next)
       } else {
           next()
       }
    } else {
      next()
    }
 }
```

变更后写法

```js
const next = () => {
    // console.log("hello")
    if (idx >= this.stack.length) return out()
    let layer = this.stack[idx++]
    if (layer.match(pathname)) {
      if (!layer.route) {			// 使用layer上的route属性判断是否是中间件
        layer.handle_request(req, res, next)
      } else {
        if (layer.route.methods[req.method.toLowerCase()]) {
          layer.handle_request(req, res, next)
        } else {
          next()
        }
      }
    } else {
      next()
    }
 }
```

### 5. 更新路由系统路径匹配规则

由于中间件的路径匹配规则是: 只要是/,或者/xxx开头的都可以命中路径

而路由是严格匹配，恒等规则

#### 5.1 Layer.match方法增加处理中间件的逻辑

只是路由的处理

```js
Layer.prototype.match = function (pathname) {
  return this.path === pathname
}
```

增加中间件, 请求路径是否以注册的路径开发

```js
Layer.prototype.match = function (pathname) {
  if (this.path === pathname) {
    return true
  }
  if (!this.route) {
    if (this.path === '/') {
      return true
    }
    return pathname.startsWith(this.path + '/')
  }
  return;
}
```



### 6. 解决bug



```js
Router.prototype.use = function (path, handler) {
    // 参数处理,入参可能是1，2，或多个
    if (typeof handler !== 'function') { // 说明只传了1个, 没有路径的中间件, 匹配所有请求
        handler = path
        path = '/'
    }
    // 把所有的注册的请求函数, 都放在layer上, 就一层, 判断arguments中的每一项是否为函数,如果是就放入路由系统中的一个layer上
    Array.from(arguments).forEach(item => {
        if (typeof item === 'function') {
            let layer = new Layer(path, item)
            layer.route = undefined // 区别于路由, 强调一下就是没有路由表
            this.stack.push(layer)
        }
    })
}
```

以上参数判断存在bug

```js
if (typeof handler !== 'function') { // 说明只传了1个, 没有路径的中间件, 匹配所有请求
    handler = path
    path = '/'
}
```

- 举个例子

> 函数内对入参数进行了重新赋值, 会直接更新arguments的值, 引用关系

```js
function test(a, b) {
  b = a
  a = '/'
  console.log(Array.from(arguments))
  console.log("a, b:", a, b)
}
test(11, 22) 
// 输出结果
[ '/', 11 ]
a, b: / 11
```

- 路由中arguments就会被篡改 **{'0': '/'}**, 处理函数就会被抹掉了

```js
if (typeof handler !== 'function') { // 说明只传了1个, 没有路径的中间件, 匹配所有请求
    handler = path
    path = '/'
}

app.use(function (req, res, next) {...}, ...)
```

- 解决

1. 构建临时变量

```js
Router.prototype.use = function (path, handler) {
  // 
  let newPath = path
  if (typeof handler !== 'function') {
    newPath = '/'
  }
  console.log(arguments)
  Array.from(arguments).forEach(item => {
    if (typeof item === 'function') {
      let layer = new Layer(newPath, item)
      layer.route = undefined // 区别于路由
      this.stack.push(layer)
    }
  })
}
```

2. 结果

```bash
[Arguments] {
  '0': '/',
  '1': [Function],
  '2': [Function],
  '3': [Function]
}
[Arguments] { '0': [Function] }						# 此处的就不是 {'0', '/' }函数就没有被覆盖
[Arguments] { '0': '/user', '1': [Function] }
```




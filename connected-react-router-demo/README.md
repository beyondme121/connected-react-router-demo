## connected-react-router 分析
- 从这个库中可以结构出如下内容
- connectRouter 是个函数 接收history
```js
// reducers/index.js
import { combineReducers } from 'redux'
import { connectRouter } from 'connected-react-router'
import counterReducer from './counter'

const createRootReducer = (history) =>
  combineReducers({
    router: connectRouter(history),
    counter: counterReducer,
  })
export default createRootReducer
```

- ConnectedRouter组件
```js
 <ConnectedRouter history={history}>
    <Link to="/">HOME</Link>
    <Link to="/counter">counter</Link>
    <Route path="/" component={Home} exact />
    <Route path="/counter" component={Counter} />
  </ConnectedRouter>
```

- routerMiddleware 中间件函数
```js
import { createBrowserHistory } from 'history'
import { applyMiddleware, compose, createStore } from 'redux'
import { routerMiddleware } from 'connected-react-router'
import createRootReducer from './store/reducers'

export const history = createBrowserHistory()

export default function configureStore(preloadedState) {
  const store = createStore(
    createRootReducer(history), // root reducer with router state
    preloadedState,
    compose(applyMiddleware(routerMiddleware(history)))
  )
  return store
}
```

## 先实现push方法
- 就是一个actionCreator, 返回一个action对象
```js
import { CALL_HISTORY_METHOD } from  './actions'
function push (path) {
  return {
    type: CALL_HISTORY_METHOD,
    payload: path
  }
}
```

## connected-react-redux
必须提供一个中间件函数
```js
// 调用 routerMiddleware(history) 传递给applyMiddleware
// 作用是: 如果action的类型是history相关的方法, 就调用history的路由跳转, 此处还不涉及到将路径存储到store中
import { CALL_HISTORY_METHOD } from './actions'
// 外面包一层, 用于传递history
function routerMiddleware (history) {
  return ({ getState, dispatch }) => {
    return next => {
      return action => {
        if (action.type === CALL_HISTORY_METHOD) {
          history.push(action.payload)
        }
        next(action)
      }
    }
  }
}
```

## 组件 - 在react中使用
```js
// react组件
/**
 * 功能: 当路由的路径发生变化后, 将路径pathname保存到store中, 也就是需要如下两个内容
 * 1. 路由信息, react-router中的Router组件, 外部传递一个带有路由相关信息的对象{ history, location, match }
 * 2. 获取store的上下文对象ReactReduxContext, 从react-redux中获取
 */
import React from "react";
import { Router } from "react-router"; // 通用的router信息, 上层才封装了BrowserRouter还是HashRouter
import { ReactReduxContext } from "react-redux";

/**
 * 根据用法: src/index.js
 * <Provider store={store}>
 *  <ConnectedRouter history={history}>
 *   ...
 *  </ConnectedRouter>
 * <Provider/
 */

class ConnectedRouter extends React.Component {
  static contextType = ReactReduxContext;
  constructor(props) {
    super(props);
    // 实现Router中的功能 监听路由变化
    let { history } = props;
    this.unlisten = history.listen(({ action, location }) => {
      // 当路径发生变化后, 会触发这个回调函数, 把action[POP,PUSH, REPLACE]和地址信息保存到store中
      // store从react-redux上下文中获取
      this.context.store.dispatch({
        type: "LOCATION/CHANGE",
        payload: { action, location },
      });
    });
  }

  componentWillUnmount() {
    this.unlisten();
  }

  render() {
    let { history, children } = this.props;
    return <Router history={history}>{children}</Router>;
  }
}

export default ConnectedRouter;

```



## connectRouter方法
- 把router作为store中的reducer使用
```js
import { combineReducers } from 'redux'
import { connectRouter } from 'connected-react-router'
import counterReducer from './counter'

const createRootReducer = (history) =>
  combineReducers({
    router: connectRouter(history),
    counter: counterReducer,
  })
export default createRootReducer

```
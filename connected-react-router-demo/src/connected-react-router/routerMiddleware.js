// 调用 routerMiddleware(history) 传递给applyMiddleware
// 作用是: 如果action的类型是history相关的方法, 就调用history的路由跳转, 此处还不涉及到将路径存储到store中

import { CALL_HISTORY_METHOD } from './constants'

// 外面包一层, 用于传递history
function routerMiddleware(history) {
  return ({ getState, dispatch }) => {
    return (next) => {
      return (action) => {
        if (action.type === CALL_HISTORY_METHOD) {
          history.push(action.payload);
        }
        next(action);
      };
    };
  };
}

export default routerMiddleware;

// import { CALL_HISTORY_METHOD } from './actions'
// function routerMiddleware (history) {
//   return ({ getState, dispatch }) => {
//     return next => {
//       return action => {
//         // 中间件的讨论: 我能处理的就在此处处理, 不能出来的让下一个中间件处理 next
//         if (action.type === CALL_HISTORY_METHOD) {
//           history.push(action.payload)
//         }
//         next(action)
//       }
//     }
//   }
// }
// export default routerMiddleware;

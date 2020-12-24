/**
 * 用法:  
 * combineReducers({
    router: connectRouter(history),
    counter: counterReducer,
  })
 */

import { LOCATION_CHANGE } from './constants'
/**
 * 传入history 返回reducer, 因为被combineReducers的入参
 */

function connectRouter (history) {
  let initialRouteState = {
    action: history.action,     // POP, PUSH, REPLACE
    location: history.location  // {pathname}
  }
  // ConnectRouter组件的构造函数派发action, 就会走到reducer中, combineReducer中使用了connectRouter(history),
  return function reducer (state = initialRouteState, action) {
    // 如果action是个location change的action, 就修改state全局状态
    if (action.type === LOCATION_CHANGE) {
      console.log("action: ", action)
      return {
        ...state,
        ...action.payload
      }
    } else {
      return state
    }
  }
}

export default connectRouter
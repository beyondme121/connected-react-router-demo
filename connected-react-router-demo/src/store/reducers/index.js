import { combineReducers } from 'redux'
import { connectRouter } from '../../connected-react-router'
import counterReducer from './counter'

const createRootReducer = (history) =>
  combineReducers({
    router: connectRouter(history),
    counter: counterReducer,
  })
export default createRootReducer

import { combineReducers } from 'redux'
import counterReducer from './counter'

let reducers = combineReducers({
  counter: counterReducer,
})

export default reducers

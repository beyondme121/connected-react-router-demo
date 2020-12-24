import * as types from '../action-types'
import { push } from '../../connected-react-router'
let actions = {
  add() {
    return { type: types.ADD }
  },
  minus() {
    return { type: types.MINUS }
  },
  go(path) {
    return push(path)
  },
}

export default actions

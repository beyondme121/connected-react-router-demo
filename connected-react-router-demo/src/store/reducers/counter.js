import * as types from '../action-types'

export default function counter(state = { number: 100 }, action) {
  switch (action.type) {
    case types.ADD:
      return {
        number: state.number + 1,
      }
    case types.MINUS:
      return {
        number: state.number - 1,
      }
    default:
      return state
  }
}

import * as types from './action-types'
let initState = { number: 100 }
function reducers (state = initState, action) {
  switch(action.type) {
    case types.ADD:
      return {
        number: state.number + 11
      }
    default:
      return state
  }
}
export default reducers
import { CALL_HISTORY_METHOD, LOCATION_CHANGE } from './constants'

// actionCreator
export function push (path) {
  return {
    type: CALL_HISTORY_METHOD,
    payload: path
  }
}

export function updateLocation (payload) {
  return {
    type: LOCATION_CHANGE,
    payload
  }
}
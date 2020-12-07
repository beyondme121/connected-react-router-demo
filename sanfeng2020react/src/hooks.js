export function useState(initState) {
  let lastState = lastState || initState
  function setState(newState) {
    lastState = newState
  }
  return [newState, setState]
}

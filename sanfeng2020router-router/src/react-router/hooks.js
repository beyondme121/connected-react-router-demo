import React from 'react'
import RouterContext from './RouterContext'
import matchPath from './matchPath'

export function useParams() {
  let match = React.useContext(RouterContext).match
  return match ? match.params : {}
}

export function useHistory() {
  return React.useContext(RouterContext).history
}

export function useLocation() {
  return React.useContext(RouterContext).location
}

export function useRouteMatch(path) {
  let location = useLocation()
  let match = React.useContext(RouterContext).match
  return path ? matchPath(location.pathname, path) : match
}

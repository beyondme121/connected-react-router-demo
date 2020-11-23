
// 匹配路由, 从routes中筛选searchRoutes中存在的
export const filterRouter = (routes, searchRoutes) => {
  let auths = searchRoutes.map(item => item.auth)
  // 递归查找
  function filter(routes) {
    return routes.filter(route => {
      if (auths.includes(route.meta.auth)) {
        // 匹配上了权限后, 看当前匹配上的路由有没有children
        if (route.children) {
          route.children = filter(route.children)
        }
        return route
      }
    })
  }
  return filter(routes)
}
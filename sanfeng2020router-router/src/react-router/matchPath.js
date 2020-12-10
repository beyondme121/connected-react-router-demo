import pathToRegexp from 'path-to-regexp'
//源里会有一个缓存，如果一个路径编译过了，则再次匹配的时候就不再编译了
function compilePath(path, options) {
  const keys = []
  const regexp = pathToRegexp(path, keys, options)
  return { keys, regexp }
}
/**
 * /post/:id
 * @param {*} pathname 浏览器栏中的真实路径
 * @param {*} options 匹配的参数 path exact strict sensitive
 */
function matchPath(pathname, options = {}) {
  let { path = '/', exact = false, strict = false, sensitive = false } = options
  let { keys, regexp } = compilePath(path, {
    end: exact,
    strict,
    sensitive,
  }) // /post/:id  keys=["id"] regexp= /\/post\/([^\/]+?)/
  const match = regexp.exec(pathname)
  if (!match) return null
  const [url, ...values] = match //['/post/1','1'] url=/post/1 values=['1']
  // pathname /post/1/name !== /post/1
  const isExact = pathname === url
  //需要精确匹配，但是匹配的不精确，没有完全相等，也相当于没匹配上
  if (exact && !isExact) return null
  return {
    //路由组件中props.match
    path, //Route原始path
    url, //正则匹配到的浏览器的pathname的部分
    isExact,
    params: keys.reduce((memo, key, index) => {
      memo[key.name] = values[index]
      return memo
    }, {}),
  }
}

export default matchPath

let pathToRegexp = require('path-to-regexp')
let keys = []
//sensitive When true the regexp will be case sensitive. (default: false)
//strict When true the regexp won't allow an optional trailing delimiter to match. (default: false)
let regexp = pathToRegexp('/post', keys, { strict: true })
// strict=true ^\/post$
// strict=false  ^\/post\/?$
console.log(regexp)
console.log(regexp.test('/POST'))
console.log(regexp.test('/POST/'))

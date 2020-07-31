// const http = require('http')
// const url = require('url');
// // const myURL =
// //   url.parse('https://user:pass@sub.host.com:8080/p/a/t/h?query=string#hash');

// // console.log(myURL)
// const stack = [
//   {
//     path: 'all',
//     method: '*',
//     handler: function (req, res) {
//       res.end(`Cannot ${req.method} ${req.url}`)
//     }
//   }
// ]

// function createApplication() {
//   let obj = {
//     get(path, handler) {
//       stack.push({
//         path,
//         method: 'get',
//         handler
//       })
//     },
//     listen() {
//       let server = http.createServer((req, res) => {
//         let { pathname } = url.parse(req.url)
//         let requestMethod = req.method.toLowerCase()

//         for (let i = 1; i < stack.length; i++) {
//           let { path, method, handler } = stack[i]
//           if (requestMethod === method && pathname === path) {
//             return handler(req, res)
//           }
//         }
//         stack[0].handler(req, res)
//       })
//       server.listen(...arguments)
//     }
//   }
//   return obj
// }

// module.exports = createApplication


// const http = require('http')
// const url = require('url')
// let routers = [
//   {
//     method: 'all',
//     path: '*',
//     handler(req, res) {
//       res.end(`Cannot ${req.method} ${req.url}`)
//     }
//   }
// ]
// function createApplication() {
//   let obj = {
//     get(path, handler) {
//       routers.push({
//         method: 'get',
//         path,
//         handler
//       })
//     },
//     listen() {
//       const server = http.createServer((req, res) => {
//         const { pathname } = url.parse(req.url)
//         let requestMethod = req.method.toLowerCase()
//         for (let i = 1; i < routers.length; i++) {
//           let { method, path, handler } = routers[i]
//           if (requestMethod === method && pathname === path) {
//             return handler(req, res)
//           }
//         }
//         return routers[0].handler(req, res)
//       })
//       server.listen(...arguments)
//     }
//   }
//   return obj
// }
// module.exports = createApplication;

const Application = require('./application')

function createApplication() {
  return new Application()
}

module.exports = createApplication

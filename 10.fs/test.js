const fs = require('fs')
let path = require('path')

// function copy(source, target, callback) {
//   fs.readFile(source, (err, data) => {
//     if (err) return callback(err)
//     fs.writeFile(target, data, callback)
//   })
// }


// copy(path.join(__dirname, './02.events.js'), 'test.js', (text) => {
//   console.log('OK')
// })


// 读一点写一点 
// function copy(source, target, cb) {
//   const buffer = Buffer.alloc(3)
//   let offsetRead = 0    // 源文件读取的指针
//   let offsetWrite = 0
//   fs.open(source, 'r', (err, rfd) => {
//     fs.open(target, 'w', (err, wfd) => {
//       function next() {
//         fs.read(rfd, buffer, 0, 3, offsetRead, function (err, bytesRead) {
//           offsetRead += bytesRead
//           fs.write(wfd, buffer, 0, bytesRead, offsetWrite, (err, written) => {
//             offsetWrite += written
//             if (bytesRead == 3) {
//               next()    // 继续递归的条件,只要读取的字节数==3,说明还没有读完
//             } else {
//               fs.close(rfd, () => { })
//               fs.close(wfd, () => { })
//               cb()
//             }
//           })
//         })
//       }
//       next()
//     })
//   })
// }


function copy(source, target, cb) {
  const buffer = Buffer.alloc(3)
  let offsetRead = 0
  let offsetWrite = 0
  fs.open(source, 'r', (err, rfd) => {
    fs.open(target, 'w', (err, wfd) => {
      function next() {
        fs.read(rfd, buffer, 0, 3, offsetRead, (err, bytesRead) => {
          offsetRead += bytesRead
          fs.write(wfd, buffer, 0, bytesRead, offsetWrite, (err, bytesWrite) => {
            offsetWrite += bytesWrite
            if (bytesRead === 3) {
              next()
            } else {
              fs.close(rfd, () => { })
              fs.close(wfd, () => { })
              cb()
            }
          })
        })
      }
      next()
    })
  })
}

copy('./01.read.js', 'test.js', err => {
  if (err) console.log(err)
  console.log('copy ok')
})

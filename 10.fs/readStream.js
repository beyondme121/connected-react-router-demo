const EventEmitter = require('events')
const fs = require('fs')

class ReadStream extends EventEmitter {
  constructor(path, options = {}) {
    super()
    this.path = path
    this.flags = options.flags || 'r'
    this.mode = options.mode || 0o666
    this.encoding = options.encoding || null
    this.start = options.start || 0
    this.end = options.end || null
    this.highWaterMark = options.highWaterMark || 64 * 1024
    this.autoClose = true
    this.pos = this.start
    // 实例化ReadStream会默认open文件, so在构造函数中调用open打开文件的方法
    this.open()
    // 实例化时,监听是否有绑定监听的操作

    // 当绑定事件的时候, 就会把类型传递给这个监听函数中, 比如监听.on('data'),error,open,...
    // 执行时机优先于on绑定事件
    /* this.on('newListener', type => {
      if (type === 'data') {
        this.read()
      }
    }) */

    // 构造函数中执行
    this.on('newListener', type => {
      if (type === 'data') {
        // 读取文件
        this.read()
      }
    })

  }

  /* open() {
    fs.open(this.path, this.flags, this.mode, (err, fd) => {
      console.log('open callback')
      if (err) {
        // 函数内部发布事件, 使用函数库的时候定义库内部的eventName
        return this.emit('error', err)   // emit的第二个参数传递给订阅函数on的回调函数中
      }
      this.fd = fd
      this.emit('open', fd)
    })
  } */

  // 文件打开是异步
  open() {
    fs.open(this.path, this.flags, this.mode, (err, fd) => {
      if (err) {
        return this.emit('error', err)
      }
      // 把内容存起来
      this.fd = fd
      // 发布事件, 我开发文件结束啦
      this.emit('open', fd)
    })
  }

  // 可读流监听data事件,读文件,然后把文件的data读出来,然后传递给回调函数中
  read() {
    // 还没有获取到文件描述符
    if (typeof this.fd !== 'number') {
      // 订阅open事件, 当触发了open事件之后, 我再read, 再调用自己
      // return this.on('open', this.read)
      return this.once('open', this.read)
    }
    // 从文件中读取数据到buffer中, 先开辟buffer
    let buffer = Buffer.alloc(this.highWaterMark)
    fs.read(this.fd, buffer, 0, this.highWaterMark, this.pos, (err, bytesRead) => {
      if (bytesRead) {
        this.pos += bytesRead
        // 把读取的数据抛出去
        this.emit('data', buffer.slice(0, bytesRead))
        this.read()
      } else {
        this.emit('end')
        if (this.autoClose) {
          fs.close(this.fd, () => {
            this.emit('close')
          })
        }
      }
    })

  }
}

module.exports = ReadStream
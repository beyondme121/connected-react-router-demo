const EventEmitter = require('./events')
const util = require('util')

// const event = new EventEmitter()

function Girl() { }
util.inherits(Girl, EventEmitter)
let test1 = (x, y) => console.log('test1', x, y)
let test2 = () => console.log('test2')

let girl = new Girl()
girl.on('hello', test1)
girl.on('hello', test2)


girl.emit('hello')

// girl.once('world', test1)
// girl.off('world')
// girl.emit('world')
// girl.emit('world')
// girl.emit('world')



// event.on('hello', test1)
// event.on('hello', test2)

// event.once('world', test2)


// event.emit('hello', 1, 2)
// event.emit('world', 1, 2)
// event.emit('world', 1, 2)

girl.once('xxx', test1)
girl.off('xxx', test1)
console.log('-------------')
girl.emit('xxx', 100, 200)

// 实现promise then的链式调用,
// promise实例的状态一旦发生改变就不会再改变

const STATUS = {
  PENDING: 'PENDING',
  FULFILLED: 'FULFILLED',
  REJECTED: 'REJECTED',
}

class Promise {
  constructor(executor) {
    this.status = STATUS.PENDING
    this.value = undefined
    this.reason = undefined
    this.resolveCallbacks = []
    this.rejectCallbacks = []

    const resolve = val => {
      if (this.status === STATUS.PENDING) {
        this.status = STATUS.FULFILLED
        this.value = val
        // 执行成功的回调函数数组
        this.resolveCallbacks.forEach(fn => fn())
      }
    }

    const reject = reason => {
      if (this.status === STATUS.PENDING) {
        this.status = STATUS.REJECTED
        this.reason = reason
        this.rejectCallbacks.forEach(fn => fn())
      }
    }
    try {
      executor(resolve, reject)
    } catch (e) {
      reject(e)
    }
  }

  then(onResolve, onReject) {
    // 创建一个新的实例, 判断时普通值还是异常值, 判断 执行成功或者失败的返回值, onResolve(this.value) => x
    let promise = new Promise((resolve, reject) => {

    })

    // 调用then方法, 接受2个函数参数, 成功调用1, 失败2. 并且返回一个新的promise对象
    if (this.status === STATUS.FULFILLED) {
      let x = onResolve(this.value)
    }
    if (this.status === STATUS.REJECTED) {
      onReject(this.reason)
    }
    // promise对象多次调用then方法，但是promise status还处于pending时, 收集callbacks
    if (this.status === STATUS.PENDING) {
      // 收集回调, 要包装一层, 可以传递参数, 否则无法传递 executor执行的返回结果 this.value
      this.resolveCallbacks.push(() => {
        onResolve(this.value)
      })
      this.rejectCallbacks.push(() => {
        onReject(this.reason)
      })
    }

    return promise
  }

}

module.exports = Promise
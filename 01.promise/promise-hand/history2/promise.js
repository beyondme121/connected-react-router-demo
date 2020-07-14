// 实现promise 多次then的调用, 多次调用, 多次收集then的成功和失败的回调函数, 当状态发生变化的时候, 执行队列中的所有回调函数

const STATUS = {
  PENDING: 'PENDING',
  FULFILLED: 'FULFILLED',
  REJECTED: 'REJECTED'
}

class Promise {

  constructor(executor) {
    this.status = STATUS.PENDING
    this.value = undefined
    this.reason = undefined

    // 需要创建成功的队列 失败的队列，分别存放
    this.onResolveCallback = []
    this.onRejectedCallback = []

    const resolve = value => {
      if (this.status === STATUS.PENDING) {
        this.status = STATUS.FULFILLED
        this.value = value
        this.onResolveCallback.forEach(fn => fn())
      }
    }

    const reject = reason => {
      if (this.status === STATUS.PENDING) {
        this.status = STATUS.REJECTED
        this.reason = reason
        this.onRejectedCallback.forEach(fn => fn())
      }
    }

    try {
      executor(resolve, reject)
    } catch (e) {
      reject(e)
    }

  }


  // 实例化之后调用then会立即执行then方法, 但是只有当状态发生变更才执行then的两个参数回调函数
  then(onResolve, onReject) {
    if (this.status === STATUS.FULFILLED) {
      onResolve(this.value)
    }
    if (this.status === STATUS.REJECTED) {
      onReject(this.reason)
    }
    // 如果是pending, 说明是异步执行的任务, 在promise还没有形成最终状态前, 订阅所有的函数(成功和失败的)
    if (this.status === STATUS.PENDING) {
      this.onResolveCallback.push(() => {
        onResolve(this.value)
      })
      this.onRejectedCallback.push(() => {
        onReject(this.reason)
      })
    }
  }
}

module.exports = Promise
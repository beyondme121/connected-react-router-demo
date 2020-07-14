const STATUS = {
  PENDING: 'PENDING',
  FULFILL: 'FULFILL',
  REJECTED: 'REJECTED'
}
class Promise {
  constructor(executor) {
    this.value = undefined
    this.reason = undefined
    this.status = STATUS.PENDING

    // 在执行器中 resolve, reject 某个时间点 "伺机" 调用
    const resolve = val => {
      if (this.status === STATUS.PENDING) {
        this.value = val
        this.status = STATUS.FULFILL
      }
    }

    const reject = reason => {
      if (this.status === STATUS.PENDING) {
        this.reason = reason
        this.status = STATUS.REJECTED
      }
    }

    // 执行器函数内部执行可能会出现错误
    try {
      executor(resolve, reject)
    } catch (e) {
      reject(e)
    }
  }

  // promise实例都有then方法, 成功执行什么,失败执行什么
  then(onFulfilled, onRejected) {
    console.log(this.status)
    if (this.status === STATUS.FULFILL) {
      onFulfilled(this.value)
    }
    if (this.status === STATUS.REJECTED) {
      onRejected(this.reason)
    }
  }

}

module.exports = Promise
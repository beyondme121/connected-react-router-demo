import axios from 'axios'
import config from '../config/env.config'
import { Loading } from 'element-ui'
import { getLocal } from './local'
import store from '@/store'
import * as types from '@/store/action-types'
/**
 * 1. 拦截器
 * 2. 合并请求参数 mergeOptions
 * 3. request, get, post 重新封装
 * 4. 
 */

let loadingInstance;

class Http {
  constructor() {
    this.timeout = 3000
    this.baseURL = process.env.NODE_ENV === 'development' ? config.dev : config.prod
    this.queue = {}
  }

  mergeOptions(options) {
    return {
      timeout: this.timeout,
      baseURL: this.baseURL,
      ...options
    }
  }

  setInterceptor(instance, url) {
    // 请求拦截器
    instance.interceptors.request.use(config => {
      // if (Object.keys(this.queue).length == 0) {
      //   loadingInstance = Loading.service({ fullscreen: true })
      // }
      // this.queue[url] = true
      // 记录取消token
      let Cancel = axios.CancelToken
      // 把实例化后的token保存到全局 store中
      config.cancelToken = new Cancel(function (c) {
        store.commit(types.SET_REQUEST_TOKEN, c)
      })

      // 请求携带token, 没有就没有,就是空
      config.headers.authorization = 'Bearer ' + getLocal('token')
      return config
    })

    instance.interceptors.response.use(res => {
      // 全局loading
      // delete this.queue[url]
      // if (Object.keys(this.queue).length == 0) {
      //   loadingInstance.close()
      // }
      if (res.status === 200) {
        if (res.data.err == 1) {
          return Promise.reject(res.data)
        }
        return Promise.resolve(res.data.data)
      } else {
        return Promise.reject(res)
      }
    }, err => {
      console.log("err:", err)
      // 全局loading
      // delete this.queue[url]
      // if (Object.keys(this.queue).length == 0) {
      //   loadingInstance.close()
      // }
      // return Promise.reject(err)
      return Promise.resolve(() => { })
    })
  }

  request(options) {
    // 1. 合并 用户的参数 + 默认参数 = 总共的参数
    const opts = this.mergeOptions(options)  // options: 用户options
    // 2. 创建实例
    const axiosInstance = axios.create()
    // 3. 设置拦截器, 传入url为了 loading以及取消请求, 识别具体是哪个url请求
    this.setInterceptor(axiosInstance, opts.url)
    // 4. 返回请求结果,把合并后的opts传入
    return axiosInstance(opts)
  }

  get(url, config = {}) {
    return this.request({
      url,
      method: 'get',
      ...config
    })
  }

  post(url, data) {
    return this.request({
      url,
      method: 'post',
      data
    })
  }
}

export default new Http
import * as config from './config'
import axios from '@/utils/axios'

export const login = (options) => {
  let { username, password, code, uid } = options
  if (username && password && code && uid) {
    return axios.post(config.login, options)
  }
}

// 
export const validate = () => axios.get(config.validate)
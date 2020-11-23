import axios from '@/utils/axios'
import * as config from './config'


export const getBannerList = () => axios.get(config.getBannerList)

export const getCaptcha = uid => {
  if (uid) {
    return axios.get(config.getCaptcha, {
      params: { uid }
    })
  }
  return Promise.reject('uid 不存在')
}
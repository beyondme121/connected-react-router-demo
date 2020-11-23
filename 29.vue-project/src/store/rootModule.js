import * as types from './action-types'
import { getBannerList } from '@/api/public'
export default {
  state: {
    bannerList: [],
    ajaxTokens: []
  },
  mutations: {
    [types.SET_BANNER_LIST](state, payload) {
      state.bannerList = payload
    },
    [types.SET_REQUEST_TOKEN](state, payload) {
      state.ajaxTokens = [...state.ajaxTokens, payload]
    },
    [types.SET_CLEAR_REQUEST_TOKEN](state, payload) {
      state.ajaxTokens = []
    }
  },
  actions: {
    async [types.SET_BANNER_LIST]({ commit }, payload) {
      let res = await getBannerList()
      commit(types.SET_BANNER_LIST, res)
    }
  }
}
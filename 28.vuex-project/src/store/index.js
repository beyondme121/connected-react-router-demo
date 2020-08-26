import Vue from 'vue'
import Vuex from '@/vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    age: 10
  },
  getters: {
    myAge(state) {
      console.log("11111")
      return state.age
    }
  },
  mutations: {    // 更改状态, 参数肯定就是状态了
    changeAge(state, payload) {
      state.age += payload
    }
  },
  actions: {
    changeAge(store, payload) {
      setTimeout(() => {
        store.commit('changeAge', payload)
      }, 1000);
    }
  },

})

export default store;
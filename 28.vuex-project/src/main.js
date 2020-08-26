import Vue from 'vue'
import App from './App.vue'
import store from './store'

Vue.config.productionTip = false
let myRootVueInstance = 'myRootVueInstance'
const vm = new Vue({
  store,
  myRootVueInstance,
  render: h => h(App),
}).$mount('#app')

console.log(vm.$store)

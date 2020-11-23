import Vue from 'vue'
import ElementUI from 'element-ui';
// import { Button, Radio, Input, InputNumber, } from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import router from './router'
import store from './store'
import App from './App.vue'


Vue.use(ElementUI);
// Vue.use(Button)
// Vue.use(Radio)
// Vue.use(Input)
// Vue.use(InputNumber)


// 
Vue.directive('has', {
  inserted(el, binding, vnode) {
    let vm_comp = vnode.context
    let exists = vm_comp.$store.state.user.btnPermission[binding.value]
    if (!exists) {
      el.parentNode.removeChild(el)
    }
  }
})


Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')

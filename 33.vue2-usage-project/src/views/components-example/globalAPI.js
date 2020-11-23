import Vue from 'vue'

Vue.component('button-container', {
  data() {
    return {
      count: 0,
    }
  },
  template: '<button @click="count++">点我啊{{count}}</button>',
})

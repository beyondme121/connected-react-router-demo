<template>
  <div id="app">
    <!-- <directive></directive> -->
    <!-- <Condition></Condition> -->
    <!-- <my-list></my-list> -->
    <!-- <my-event></my-event> -->
    <Comp></Comp>
  </div>
</template>
<script>
import Directive from './views/directive/directive'
import Condition from './views/directive/conditionRender'
import MyList from './views/list/my-list'
import MyEvent from './views/events/events'
import Comp from './views/components-example/vue.component'
export default {
  components: {
    Directive,
    Condition,
    MyList,
    MyEvent,
    Comp,
  },
}
</script>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>

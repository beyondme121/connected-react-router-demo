<template>
  <div id="app">
    <div>state中获取: {{this.$store.state.age}}</div>
    <div>getters中获取: {{this.$store.getters.myAge}}</div>
    <button @click="$store.commit('changeAge', 100)">mutation同步修改数据</button>
    <button @click="$store.dispatch('changeAge', 200)">action异步修改数据</button>
  </div>
</template>

<script>
export default {
  name: "App",
  components: {},
};
</script>

<style>
</style>

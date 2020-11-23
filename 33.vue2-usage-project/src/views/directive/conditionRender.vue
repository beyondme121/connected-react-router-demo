<template>
  <div>
    <template v-if="loginType==='username'">
      <label>username</label>
      <input type="text" placeholder="username" key="username" />
    </template>
    <template v-else>
      <label aria-placeholder="email">email</label>
      <input type="text" placeholder="email" key="email" />
    </template>
    <button @click="toggle">toggle</button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      loginType: "username",
      count: 0,
    };
  },
  methods: {
    toggle() {
      this.count++;
      this.loginType = this.count % 2 === 0 ? "username" : "email";
    },
  },
};
</script>

<style>
</style>
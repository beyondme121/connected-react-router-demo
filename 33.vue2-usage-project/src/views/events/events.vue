<template>
  <div>
    <button @click="handleClickCall('hello', $event)">点我啊</button>
    <button @click="handleClick">继续点我啊</button>
    <input type="text" @keyup.enter="handleSubmit" />
    <input type="text" @keyup.page-down="handlePageDown" />
  </div>
</template>

<script>
export default {
  methods: {
    handleClickCall(message, e) {
      console.log(message)
      console.log(e.target.tagName)
    },
    handleClick(e) {
      console.log(e)
    },
    handleSubmit(e) {
      console.log(e.target.value)
    },
    handlePageDown() {
      console.log('---------')
    },
  },
}
</script>

<style></style>

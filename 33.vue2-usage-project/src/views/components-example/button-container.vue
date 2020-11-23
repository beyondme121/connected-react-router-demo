<template>
  <div>
    <button @click="count++">click me, {{ count }}</button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      count: 0,
    }
  },
}
</script>

<style></style>

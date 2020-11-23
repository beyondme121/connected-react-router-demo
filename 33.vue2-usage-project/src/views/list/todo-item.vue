<template>
  <li>{{ title }} <button @click="$emit('remove', title)">删除</button></li>
</template>

<script>
export default {
  props: ['title'],
}
</script>

<style></style>

<template>
  <div>
    管理页面
    <ManagerMenu></ManagerMenu>hello world
    <router-view></router-view>
  </div>
</template>
<script>
import ManagerMenu from "@/components/ManagerMenu.jsx";
export default {
  components: {
    ManagerMenu,
  },
};
</script>
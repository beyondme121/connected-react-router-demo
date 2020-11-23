<template>
  <div id="app">
    <el-container>
      <el-header>
        <PageHeader></PageHeader>
      </el-header>
      <el-main>
        <router-view></router-view>
      </el-main>
      <el-footer>
        <Footer></Footer>
      </el-footer>
    </el-container>
  </div>
</template>
<script>
import PageHeader from '@/components/Header.vue'
import Footer from '@/components/Footer'

export default {
  components: {
    PageHeader,
    Footer,
  },
}
</script>
<style lang="scss">
* {
  margin: 0;
  padding: 0;
}
.el-header,
.el-footer {
  background: #2a2a2a;
}
.el-main {
  min-height: calc(100vh - 120px);
}
</style>

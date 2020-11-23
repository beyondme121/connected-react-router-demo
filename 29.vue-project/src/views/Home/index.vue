<template>
  <div>
    <el-carousel :interval="4000" type="card" height="300px">
      <el-carousel-item v-for="item in bannerList" :key="item._id">
        <img :src="item.url" style="max-width:100%" />
      </el-carousel-item>
    </el-carousel>
  </div>
</template>
<script>
import * as types from "@/store/action-types";
import { mapState, mapActions } from "vuex";
export default {
  computed: {
    ...mapState(["bannerList"]),
  },
  methods: {
    ...mapActions([types.SET_BANNER_LIST]),
  },
  mounted() {
    if (!this.bannerList.length) {
      this[types.SET_BANNER_LIST]();
    }
  },
};
</script>

<style></style>

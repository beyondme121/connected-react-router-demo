<template>
  <div id="directive">
    <div @click="click1">
      <div @click.stop="click2">click me</div>
    </div>
    <form @submit.prevent="onSubmit" action="/hello">
      <input type="text" v-model="name" />
      <button type="submit">提交</button>
    </form>
    <a :href="url">百度</a>
    <br />
    <a :href="urlInner">内部连接地址</a>
    <br />
    <span v-if="vIf">是否卸载DOM v-if</span>
    <span v-show="vShow">是否显示v-show: display: none;</span>
    <p>动态绑定参数</p>
    <div v-on:[eventName]="dynamicEvent">动态参数绑定事件</div>
    <div @[eventName]="dynamicEvent">动态参数绑定事件</div>
    <span :class="{active: isActive}">动态绑定class:对象模式</span>
    <span :class="[]">动态绑定class</span>
  </div>
</template>

<script>
// .prevent: 阻止表单的默认提交, 表单元素使用v-model指令进行数据的双向绑定
// .stop: 事件冒泡, click2执行完成后不再冒泡, stopPropagation
export default {
  data() {
    return {
      name: "",
      url: "http://www.baidu.com",
      urlInner: "world",
      vIf: true,
      vShow: true,
      eventName: "click",
      isActive: true,
    };
  },
  methods: {
    click1() {
      console.log("click1");
    },
    click2() {
      console.log("click2");
    },
    onSubmit() {
      console.log(this.name);
    },
    dynamicEvent() {
      console.log(this.eventName);
    },
  },
  created() {
    setTimeout(() => {
      this.vIf = false;
      this.vShow = false;
      this.eventName = "mouseover"; // 动态绑定div的事件, 由click -> mouseover
      this.isActive = false;
    }, 2000);
  },
};
</script>

<style lang="scss">
.active {
  background-color: #f00;
}
</style>
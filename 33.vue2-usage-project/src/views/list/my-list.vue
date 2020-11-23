<template>
  <div>
    <div>
      <ul id="list1">
        <li v-for="(item, index) in goods" :key="index">
          {{ parent }} -- {{ index }} -- {{ item.message }}
        </li>
      </ul>
      <ul>
        <li v-for="(value, key, index) in obj" :key="value">
          {{ value }},{{ key }}, {{ index }}
        </li>
      </ul>
      <br />
      <ul>
        <li v-for="(item, index) of arr" :key="index">
          {{ item }}
        </li>
      </ul>
      <button @click="changeArr">changeArr</button>
      <div>
        <ul>
          <li v-for="item in even" :key="item">{{ item }}</li>
        </ul>
      </div>
      <br />
      <!-- <ul v-for="(set, index) in sets" :key="index">
        <li v-for="n in evenFn(set)" :key="n">
          {{ n }}
        </li>
      </ul> -->
      <span>嵌套的v-for, 使用method处理嵌套的数据</span>
      <ul v-for="(set, index) of sets" :key="index">
        <li v-for="(item, index) in odd(set)" :key="index">
          {{ item }}
        </li>
      </ul>

      <p>在template上使用v-for</p>
      <ul>
        <template v-for="item in goods">
          <li :key="item.message">{{ item.message }}</li>
        </template>
      </ul>
      <p>模拟登录后显示信息</p>
      <button @click="changeLoginStatus">changeLoginStatus</button>
      <ul v-if="isLogin">
        <li v-for="user in activeUser" :key="user.name">
          {{ user.name }}
        </li>
      </ul>
      <div>todo组件 v-for</div>
      <Todo></Todo>
    </div>
  </div>
</template>

<script>
import Todo from './todo'
export default {
  components: {
    Todo,
  },
  data() {
    return {
      parent: 'parent',
      goods: [{ message: 'Foo' }, { message: 'Bar' }],
      obj: {
        name: 'hello',
        age: 19,
      },
      arr: [1, 2, 3, 4, 5],
      sets: [
        [1, 2, 3, 4, 5],
        [6, 7, 8, 9, 10],
      ],
      user: [
        { name: 'sanfeng', isActive: true },
        { name: 'zhangsan', isActive: false },
        { name: 'lisi', isActive: true },
      ],
      isLogin: false,
    }
  },
  methods: {
    changeArr() {
      // this.arr.push(6)
      // this.arr = this.arr.slice(1)
      // 直接修改数组的索引或者length不是响应式的
      // this.arr[5] = 100
      // this.arr.length = 0
    },
    evenFn: function(set) {
      return set.filter((item) => item % 2 === 0)
    },
    odd(data) {
      return data.filter((item) => item % 2 === 1)
    },
    changeLoginStatus() {
      console.log('-------', this.isLogin)
      this.isLogin = true
    },
  },
  computed: {
    even: function() {
      return this.arr.filter((item) => {
        return item % 2 == 0
      })
    },
    activeUser() {
      return this.user.filter((item) => item.isActive === true)
    },
  },
}
</script>

<style>
ul,
li {
  list-style: none;
  display: flex;
}
</style>

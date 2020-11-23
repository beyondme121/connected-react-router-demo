<template>
  <div>
    <form @submit.prevent="addNewTodo">
      <label for="new-todo">add a todo</label>
      <input
        type="text"
        v-model="newTodoText"
        placeholder="E.g. Feed the cat"
      />
    </form>
    <div>todo 列表</div>
    <ul>
      <li
        is="TodoItem"
        v-for="item in todos"
        :key="item.todo"
        :title="item.todo"
        @remove="removeHandler"
      ></li>
    </ul>
  </div>
</template>

<script>
import TodoItem from './todo-item'
export default {
  components: {
    TodoItem,
  },
  data() {
    return {
      newTodoText: '',
      todos: [],
    }
  },
  methods: {
    addNewTodo(newTodo) {
      this.todos.push({ todo: this.newTodoText })
      this.newTodoText = ''
    },
    removeHandler(todo) {
      console.log('todo:', todo)
      this.todos = this.todos.filter((item) => item.todo !== todo)
    },
  },
}
</script>

<style></style>

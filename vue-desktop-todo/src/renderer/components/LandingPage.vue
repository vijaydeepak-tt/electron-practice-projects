<template>
    <div class="container">
      <div>
        <input class="todo-input" type="text" placeholder="What are you doing Today?" v-model="todo" @keyup.enter.prevent="addTodo">
      </div>
      <div class="todos">
        <ul>
          <li class="todo-item" v-for="todo in todos" @click="completeTodo(todo.id)" :key="todo.id">{{todo.name}}</li>
        </ul>
      </div>
    </div>
</template>

<script>
  import { mapState } from "vuex";
  export default {
    data() {
      return {
        todo: ""
      }
    },
    computed: {
      ...mapState({
        todos: state => state.Todo.todos
      })
    },
    methods: {
      addTodo() {
        this.$store.dispatch("ADD_TODO", this.todo);
        this.todo = "";
      },
      completeTodo(id) {
        this.$store.dispatch("COMPLETE_TODO", id);
      }
    }
  }
</script>

<style>
  .container {
    height: 100vh;
    text-align: center;
    background-color: #30336b;
  }

  .todo-input {
    font-size: 36px;
    width: 90vw;
    border: 0px;
    outline: none;
    margin-top: 20px;
    padding: 10px;
    text-align: center;
    background-color: transparent;
    color: white;
  }

  ::placeholder {
    color: rgba(255, 255, 255, 0.7);
  }

  .todos {
    overflow: auto;
    height: 70vh;
    margin-top: 20px;
  }

  .todo-item {
    color: white;
    padding: 10px 0;
    font-size: 24px;
  }
</style>

// src/features/todo/todoSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  todos: [],
  todoToUpdate: null,
  status: "idle",
  error: null,
};

export const fetchTodos = createAsyncThunk("todos/fetchTodos", async () => {
  const response = await axios.get("http://localhost:3000/todos");
  return response.data;
});

export const addOrUpdateTodo = createAsyncThunk(
  "todos/addOrUpdateTodo",
  async (payload) => {
    if (payload.id) {
      // Fetch existing todo to get creationDate and completionStatus
      const existingTodo = await axios.get(`http://localhost:3000/todos/${payload.id}`);
      const updatedTodo = {
        ...existingTodo.data,
        text: payload.text, // Update the text property
      };

      // Update the todo on the server
      const response = await axios.put(`http://localhost:3000/todos/${payload.id}`, updatedTodo);
      return response.data;
    } else {
      // Add new todo
      const newTodo = {
        ...payload,
        creationDate: new Date().toISOString(),
        completionStatus: false, // Initial completion status
      };
      const response = await axios.post("http://localhost:3000/todos", newTodo);
      return response.data;
    }
  }
);

export const removeTodo = createAsyncThunk("todos/removeTodo", async (id) => {
  await axios.delete(`http://localhost:3000/todos/${id}`);
  return id;
});

export const toggleTodo = createAsyncThunk("todos/toggleTodo", async (id) => {
  const response = await axios.get(`http://localhost:3000/todos/${id}`);
  const updatedTodo = { ...response.data, completionStatus: !response.data.completionStatus };
  await axios.put(`http://localhost:3000/todos/${id}`, updatedTodo);
  return updatedTodo;
});

const todoSlice = createSlice({
  name: "todo",
  initialState,
  reducers: {
    setTodoToUpdate: (state, action) => {
      state.todoToUpdate = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTodos.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchTodos.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.todos = action.payload;
      })
      .addCase(fetchTodos.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(addOrUpdateTodo.fulfilled, (state, action) => {
        state.status = "succeeded";
        const updatedIndex = state.todos.findIndex((todo) => todo.id === action.payload.id);
        if (updatedIndex !== -1) {
          state.todos[updatedIndex] = action.payload;
        } else {
          state.todos.push(action.payload);
        }
      })
      .addCase(removeTodo.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.todos = state.todos.filter((todo) => todo.id !== action.payload);
      })
      .addCase(toggleTodo.fulfilled, (state, action) => {
        state.status = "succeeded";
        const updatedIndex = state.todos.findIndex((todo) => todo.id === action.payload.id);
        if (updatedIndex !== -1) {
          state.todos[updatedIndex] = action.payload;
        }
      });
  },
});

export const { setTodoToUpdate } = todoSlice.actions;

export default todoSlice.reducer;

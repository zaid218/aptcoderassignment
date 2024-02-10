// src/app/store.js
import { configureStore } from "@reduxjs/toolkit";
import todoReducer from "../features/todo/todoSlice";

const loadState = () => {
  try {
    const serializedState = localStorage.getItem("todosState");
    if (serializedState === null) {
      return undefined;
    }
    return JSON.parse(serializedState);
  } catch (error) {
    return undefined;
  }
};

const saveState = (state) => {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem("todosState", serializedState);
  } catch (error) {
    // Handle errors here
  }
};

const preloadedState = loadState();

export const store = configureStore({
  reducer: { todo: todoReducer },
  preloadedState,
});

store.subscribe(() => {
  saveState(store.getState());
});

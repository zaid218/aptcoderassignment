// src/components/AddTodo.jsx
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addOrUpdateTodo, setTodoToUpdate } from "../features/todo/todoSlice";
import { format } from "date-fns";

const AddTodo = () => {
  const [input, setInput] = useState("");
  const dispatch = useDispatch();
  const todos = useSelector((s) => s.todo.todos);
  const todoToUpdate = useSelector((state) => state.todo.todoToUpdate);

  useEffect(() => {
    // Check if there's a todo to update
    if (todoToUpdate) {
      setInput(todoToUpdate.text);
    } else {
      setInput(""); // Clear input for new todos
    }
  }, [todoToUpdate]);

  const addOrUpdateTodoHandler = (e) => {
    e.preventDefault();

    if (todoToUpdate) {
      // Update existing todo
      dispatch(addOrUpdateTodo({ id: todoToUpdate.id, text: input }));
      dispatch(setTodoToUpdate(null)); // Clear the todo to update
    } else {
      // Add new todo
      dispatch(addOrUpdateTodo({ text: input }));
    }

    setInput(""); // Clear input
  };

  return (
    <form
      action=""
      onSubmit={addOrUpdateTodoHandler}
      className="space-x-3 mt-12"
    >
      <input
        type="text"
        name=""
        id=""
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Enter a Todo..."
        className="bg-gray-800 rounded border-gray-700 border-indigo-500 ring-2 focus:ring-indigo-900 text-base outline-none text-gray-100 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out focus:bg-gray-700"
      />
      <button
        type="submit"
        className="text-white bg-indigo-500 border-0 py-2 px-6 focus:outline-none hover:bg-indigo-600 rounded text-lg"
      >
        {todoToUpdate ? "Update Todo" : "Add Todo"}
      </button>
    </form>
  );
};

export default AddTodo;

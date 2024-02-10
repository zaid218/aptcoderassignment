// src/components/Todos.jsx
import React, { useEffect } from "react";
import { format, isValid, parseISO } from "date-fns";
import { useSelector, useDispatch } from "react-redux";
import { fetchTodos, removeTodo, toggleTodo, setTodoToUpdate } from "../features/todo/todoSlice";
import axios from "axios";

function Todos() {
  const todos = useSelector((state) => state.todo.todos);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchTodos());
  }, [dispatch]);

  const updateTodoHandler = (todo) => {
    // Check if the todo is not completed before allowing editing
    if (!todo.completionStatus) {
      dispatch(setTodoToUpdate(todo));
    }
  };

  const toggleTodoHandler = async (todo) => {
    dispatch(toggleTodo(todo.id));
  };

  const removeTodoHandler = async (todo) => {
    dispatch(removeTodo(todo.id));
    // Remove todo from the server as well
    await axios.delete(`http://localhost:3000/todos/${todo.id}`);
  };

  return (
    <div className="mb-10">
      <div className="text-2xl font-bold mt-10 mb-8">
        {todos.length > 0 ? "Todos" : "Enter Todos"}
      </div>
      <ul className="list-none">
        {todos.map((todo) => (
          <li
            key={todo.id}
            className={`mt-4 flex justify-between items-center bg-zinc-700 px-4 py-2 rounded ${todo.completionStatus ? "line-through" : ""}`}
          >
            <div className="flex items-center">
              <input
                type="checkbox"
                checked={todo.completionStatus}
                onChange={() => toggleTodoHandler(todo)}
                className="mr-2"
              />
              <div className="text-white">
                {todo.text}
                <br />
                <small className="text-gray-500">
                  Created on: {todo.creationDate ? (isValid(parseISO(todo.creationDate)) ? format(parseISO(todo.creationDate), "MMMM d, yyyy h:mm a") : "Invalid Date") : "Date not available"}
                </small>
              </div>
            </div>
            <div className="flex justify-end">
              <button
                className={`text-white bg-red-500 border-0 py-1 px-4 focus:outline-none hover:bg-red-600 rounded text-md mx-3 ${todo.completionStatus ? "cursor-not-allowed" : ""}`}
                onClick={() => updateTodoHandler(todo)}
              >
                Edit
              </button>
              <button
                onClick={() => removeTodoHandler(todo)}
                className="text-white bg-red-500 border-0 py-1 px-4 focus:outline-none hover:bg-red-600 rounded text-md"
              >
                X
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Todos;
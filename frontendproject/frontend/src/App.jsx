import React from "react";
import "./App.css";
import AddTodo from "./components/AddTodo";
import Todos from "./components/Todos";

function App() {
  return (
    <div className="container mx-auto  my-0 p-4 bg-gray-800 text-white">
      <h1 className="text-3xl font-bold mb-1 mt-10">
        Welcome To Todos Storage
      </h1>
      <AddTodo />
      <Todos />
    </div>
  );
}

export default App;

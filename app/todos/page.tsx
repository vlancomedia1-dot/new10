"use client"

import { useState, useEffect } from "react";
import { Plus, Trash2, Edit2, Check, X, CheckCircle2, Circle } from "lucide-react";

export default function TodoApp() {
  const [todos, setTodos] = useState([]);
  const [input, setInput] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editingText, setEditingText] = useState("");
  const [filter, setFilter] = useState("all");

  // Load todos from localStorage on mount
  useEffect(() => {
    const savedTodos = localStorage.getItem("todos");
    if (savedTodos) {
      try {
        setTodos(JSON.parse(savedTodos));
      } catch (error) {
        console.error("Error loading todos:", error);
      }
    }
  }, []);

  // Save todos to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos));
  }, [todos]);

  const addTodo = () => {
    if (input.trim() === "") return;

    const newTodo = {
      id: Date.now(),
      text: input.trim(),
      completed: false,
      createdAt: new Date().toISOString(),
    };

    setTodos([newTodo, ...todos]);
    setInput("");
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      addTodo();
    }
  };

  const deleteTodo = (id) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  const toggleComplete = (id) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const startEdit = (todo) => {
    setEditingId(todo.id);
    setEditingText(todo.text);
  };

  const saveEdit = () => {
    if (editingText.trim() === "") {
      cancelEdit();
      return;
    }

    setTodos(
      todos.map((todo) =>
        todo.id === editingId ? { ...todo, text: editingText.trim() } : todo
      )
    );
    cancelEdit();
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditingText("");
  };

  const clearCompleted = () => {
    setTodos(todos.filter((todo) => !todo.completed));
  };

  const filteredTodos = todos.filter((todo) => {
    if (filter === "active") return !todo.completed;
    if (filter === "completed") return todo.completed;
    return true;
  });

  const activeCount = todos.filter((todo) => !todo.completed).length;
  const completedCount = todos.filter((todo) => todo.completed).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4 md:p-8">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
            Todo List
          </h1>
          <p className="text-gray-600">Stay organized and productive</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <p className="text-2xl font-bold text-blue-600">{todos.length}</p>
            <p className="text-xs text-gray-600">Total</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <p className="text-2xl font-bold text-orange-600">{activeCount}</p>
            <p className="text-xs text-gray-600">Active</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <p className="text-2xl font-bold text-green-600">{completedCount}</p>
            <p className="text-xs text-gray-600">Done</p>
          </div>
        </div>

        {/* Add Todo Input */}
        <div className="mb-6">
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="What needs to be done?"
              className="flex-1 px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
            />
            <button
              onClick={addTodo}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all shadow-md hover:shadow-lg flex items-center gap-2 font-medium"
            >
              <Plus className="w-5 h-5" />
              <span className="hidden sm:inline">Add</span>
            </button>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-4 bg-white rounded-xl p-1 shadow-sm border border-gray-100">
          {["all", "active", "completed"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`flex-1 px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                filter === f
                  ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              }`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>

        {/* Todo List */}
        <div className="space-y-2 mb-6">
          {filteredTodos.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-gray-100">
              <div className="text-6xl mb-4">📝</div>
              <p className="text-gray-500">
                {filter === "all" 
                  ? "No todos yet. Add one to get started!" 
                  : filter === "active"
                  ? "No active todos!"
                  : "No completed todos!"}
              </p>
            </div>
          ) : (
            filteredTodos.map((todo) => (
              <div
                key={todo.id}
                className={`bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-all ${
                  todo.completed ? "opacity-75" : ""
                }`}
              >
                {editingId === todo.id ? (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={editingText}
                      onChange={(e) => setEditingText(e.target.value)}
                      className="flex-1 px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      autoFocus
                      onKeyDown={(e) => {
                        if (e.key === "Enter") saveEdit();
                        if (e.key === "Escape") cancelEdit();
                      }}
                    />
                    <button
                      onClick={saveEdit}
                      className="p-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                    >
                      <Check className="w-5 h-5" />
                    </button>
                    <button
                      onClick={cancelEdit}
                      className="p-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => toggleComplete(todo.id)}
                      className="flex-shrink-0 transition-colors"
                    >
                      {todo.completed ? (
                        <CheckCircle2 className="w-6 h-6 text-green-500" />
                      ) : (
                        <Circle className="w-6 h-6 text-gray-300 hover:text-blue-500" />
                      )}
                    </button>
                    <span
                      className={`flex-1 ${
                        todo.completed
                          ? "line-through text-gray-400"
                          : "text-gray-800"
                      }`}
                    >
                      {todo.text}
                    </span>
                    <div className="flex gap-1">
                      <button
                        onClick={() => startEdit(todo)}
                        className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => deleteTodo(todo.id)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* Clear Completed Button */}
        {completedCount > 0 && (
          <button
            onClick={clearCompleted}
            className="w-full px-4 py-3 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-colors font-medium border border-red-200"
          >
            Clear {completedCount} Completed {completedCount === 1 ? "Task" : "Tasks"}
          </button>
        )}

        {/* Footer Info */}
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>💾 All todos are saved automatically to your browser</p>
        </div>
      </div>
    </div>
  );
}
import React, { useState, useEffect } from "react";
import api from "./api";

const App = () => {
  const [transactions, setTransactions] = useState([]);
  const [formData, setFormData] = useState({
    amount: "",
    category: "",
    description: "",
    is_income: false,
    date: "",
  });

  const fetchTransactions = async () => {
    try {
      const response = await api.get("/transactions/");
      setTransactions(response.data);
    } catch (error) {
      console.error("Failed to fetch transactions:", error);
    }
  };

  const handleInputChange = (event) => {
    const { name, type, value, checked } = event.target;
    const newValue = type === "checkbox" ? checked : value;

    setFormData((prevData) => ({
      ...prevData,
      [name]: newValue,
    }));
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    try {
      await api.post("/transactions/", formData);
      fetchTransactions();
      resetForm();
    } catch (error) {
      console.error("Failed to submit transaction:", error);
    }
  };

  const resetForm = () => {
    setFormData({
      amount: "",
      category: "",
      description: "",
      is_income: false,
      date: "",
    });
  };

  const [todoFormData, setTodoFormData] = useState({
    date: "",
    done: false,
    content: "",
  });

  const [todos, setTodos] = useState([]);

  const fetchTodos = async () => {
    try {
      const response = await api.get("/todo");
      setTodos(response.data);
    } catch (error) {
      console.error("Failed to fetch todos:", error);
    }
  };

  useEffect(() => {
    fetchTransactions();
    fetchTodos();
  }, []);

  const handleTodoInputChange = (event) => {
    const { name, type, value, checked } = event.target;
    const newValue = type === "checkbox" ? checked : value;

    setTodoFormData((prevData) => ({
      ...prevData,
      [name]: newValue,
    }));
  };

  const handleTodoFormSubmit = async (event) => {
    event.preventDefault();
    try {
      await api.post("/todo", todoFormData);
      fetchTodos();
      resetTodoForm();
    } catch (error) {
      console.error("Failed to submit todo:", error);
    }
  };

  const resetTodoForm = () => {
    setTodoFormData({
      date: "",
      done: false,
      content: "",
    });
  };

  return (
    <div>
      <nav className="navbar navbar-dark bg-primary">
        <div className="container-fluid">
          <a href="#" className="navbar-brand">
            Finance App
          </a>
        </div>
      </nav>

      <div className="container">
        <form onSubmit={handleFormSubmit}>
          <div className="mb-3 mt-3">
            <label htmlFor="amount" className="form-label">
              Amount
            </label>
            <input
              type="text"
              className="form-control"
              id="amount"
              name="amount"
              onChange={handleInputChange}
              value={formData.amount}
            />
          </div>

          <div className="mb-3">
            <label htmlFor="category" className="form-label">
              Category
            </label>
            <input
              type="text"
              className="form-control"
              id="category"
              name="category"
              onChange={handleInputChange}
              value={formData.category}
            />
          </div>

          <div className="mb-3">
            <label htmlFor="description" className="form-label">
              Description
            </label>
            <input
              type="text"
              className="form-control"
              id="description"
              name="description"
              onChange={handleInputChange}
              value={formData.description}
            />
          </div>

          <div className="mb-3">
            <label htmlFor="is_income" className="form-label">
              Income
            </label>
            <input
              type="checkbox"
              className="form-check-input"
              id="is_income"
              name="is_income"
              onChange={handleInputChange}
              checked={formData.is_income}
            />
          </div>

          <div className="mb-3">
            <label htmlFor="date" className="form-label">
              Date
            </label>
            <input
              type="date"
              className="form-control"
              id="date"
              name="date"
              onChange={handleInputChange}
              value={formData.date}
            />
          </div>

          <button type="submit" className="btn btn-primary">
            Submit
          </button>
        </form>

        <table className="table table-striped table-bordered table-hover mt-4">
          <thead>
            <tr>
              <th>Amount</th>
              <th>Category</th>
              <th>Description</th>
              <th>Income?</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((transaction) => (
              <tr key={transaction.id}>
                <td>{transaction.amount}</td>
                <td>{transaction.category}</td>
                <td>{transaction.description}</td>
                <td>{transaction.is_income ? "Yes" : "No"}</td>
                <td>{transaction.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="container mt-5">
        <h2>Todo List</h2>
        <form onSubmit={handleTodoFormSubmit}>
          <div className="mb-3">
            <label htmlFor="todo-date" className="form-label">
              Date
            </label>
            <input
              type="date"
              className="form-control"
              id="todo-date"
              name="date"
              onChange={handleTodoInputChange}
              value={todoFormData.date}
            />
          </div>

          <div className="mb-3">
            <label htmlFor="todo-content" className="form-label">
              Content
            </label>
            <input
              type="text"
              className="form-control"
              id="todo-content"
              name="content"
              onChange={handleTodoInputChange}
              value={todoFormData.content}
            />
          </div>

          <div className="mb-3">
            <label htmlFor="todo-done" className="form-label">
              Done
            </label>
            <input
              type="checkbox"
              className="form-check-input"
              id="todo-done"
              name="done"
              onChange={handleTodoInputChange}
              checked={todoFormData.done}
            />
          </div>

          <button type="submit" className="btn btn-primary">
            Add Todo
          </button>
        </form>

        <table className="table table-striped table-bordered table-hover mt-4">
          <thead>
            <tr>
              <th>Date</th>
              <th>Content</th>
              <th>Done</th>
            </tr>
          </thead>
          <tbody>
            {todos.map((todo) => (
              <tr key={todo.id}>
                <td>{todo.date}</td>
                <td>{todo.content}</td>
                <td>{todo.done ? "Yes" : "No"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default App;

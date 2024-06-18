const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const port = 5000;

app.use(bodyParser.json());

let todos = [];

function checkTodoExists(req, res, next) {
  const todoId = parseInt(req.params.id);
  const todo = todos.find((todo) => todo.id === todoId);
  if (!todo) {
    return res.status(404).json({ error: "To-do not found" });
  }
  req.todo = todo;
  next();
}

app.get("/todos", (req, res) => {
  res.json(todos);
});

app.get("/todos/:id", checkTodoExists, (req, res) => {
  res.json(req.todo);
});

app.post("/todos", (req, res) => {
  const { title, description } = req.body;
  const newTodo = {
    id: todos.length + 1,
    title,
    description,
    completed: false,
  };
  todos.push(newTodo);
  res.status(201).json(newTodo);
});

app.put("/todos/:id", checkTodoExists, (req, res) => {
  const { title, description, completed } = req.body;
  req.todo.title = title;
  req.todo.description = description;
  req.todo.completed = completed;
  res.json(req.todo);
});

app.delete("/todos/:id", checkTodoExists, (req, res) => {
  todos = todos.filter((todo) => todo.id !== req.todo.id);
  res.json({ message: "To-do deleted" });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

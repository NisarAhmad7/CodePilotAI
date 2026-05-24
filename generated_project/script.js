// script.js - Todo application logic
// Declare DOM element references
const todoForm = document.getElementById('todo-form');
const todoInput = document.getElementById('todo-input');
const todoList = document.getElementById('todo-list');
const filterButtons = document.querySelectorAll('.filter-btn');

// In‑memory todo list
let todos = [];
let currentFilter = 'all'; // tracks the active filter

/**
 * Load todos from localStorage and render them.
 */
function loadTodos() {
  const stored = localStorage.getItem('todos');
  try {
    todos = stored ? JSON.parse(stored) : [];
  } catch (e) {
    console.error('Failed to parse stored todos:', e);
    todos = [];
  }
  renderTodos(currentFilter);
}

/**
 * Persist the current todos array to localStorage.
 */
function saveTodos() {
  localStorage.setItem('todos', JSON.stringify(todos));
}

/**
 * Render the todo list based on the supplied filter.
 * @param {string} [filter='all'] - "all", "active" or "completed"
 */
function renderTodos(filter = 'all') {
  // Clear existing items
  todoList.innerHTML = '';

  // Determine which todos to display
  const filtered = todos.filter(todo => {
    if (filter === 'active') return !todo.completed;
    if (filter === 'completed') return todo.completed;
    return true; // 'all'
  });

  // Build DOM nodes for each todo
  filtered.forEach(todo => {
    const li = document.createElement('li');
    li.className = 'todo-item';
    li.dataset.id = todo.id;
    li.innerHTML = `
      <input type="checkbox" class="toggle-checkbox" ${todo.completed ? 'checked' : ''} />
      <span class="${todo.completed ? 'completed' : ''}">${todo.text}</span>
      <button class="delete-btn">Delete</button>
    `;

    // Event: toggle completion
    const checkbox = li.querySelector('.toggle-checkbox');
    checkbox.addEventListener('change', () => toggleComplete(todo.id));

    // Event: delete todo
    const delBtn = li.querySelector('.delete-btn');
    delBtn.addEventListener('click', () => deleteTodo(todo.id));

    todoList.appendChild(li);
  });
}

/**
 * Handle the form submission to add a new todo.
 * @param {Event} event
 */
function addTodo(event) {
  event.preventDefault();
  const text = todoInput.value.trim();
  if (!text) return;

  const newTodo = {
    id: Date.now(),
    text,
    completed: false,
  };
  todos.push(newTodo);
  saveTodos();
  renderTodos(currentFilter);
  todoInput.value = '';
}

/**
 * Toggle the completed state of a todo by its id.
 * @param {number} id
 */
function toggleComplete(id) {
  const todo = todos.find(t => t.id === id);
  if (!todo) return;
  todo.completed = !todo.completed;
  saveTodos();
  renderTodos(currentFilter);
}

/**
 * Delete a todo from the list.
 * @param {number} id
 */
function deleteTodo(id) {
  todos = todos.filter(t => t.id !== id);
  saveTodos();
  renderTodos(currentFilter);
}

/**
 * Change the active filter based on button click.
 * @param {Event} event
 */
function setFilter(event) {
  const filter = event.target.dataset.filter;
  if (!filter) return;
  currentFilter = filter;

  // Update button UI
  filterButtons.forEach(btn => {
    btn.classList.toggle('active-filter', btn.dataset.filter === filter);
  });

  renderTodos(filter);
}

// Attach event listeners
if (todoForm) todoForm.addEventListener('submit', addTodo);
filterButtons.forEach(btn => btn.addEventListener('click', setFilter));

// Load persisted todos when the DOM is ready
window.addEventListener('DOMContentLoaded', loadTodos);

// Expose for debugging / external use
window.todoApp = {
  loadTodos,
  addTodo,
  toggleComplete,
  deleteTodo,
  setFilter,
  renderTodos,
};

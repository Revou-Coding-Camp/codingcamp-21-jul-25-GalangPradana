const form = document.getElementById('form-todo');
const todoInput = document.getElementById('todo-input');
const todoDate = document.getElementById('todo-date');
const todoList = document.getElementById('todo-list');
const filterInput = document.getElementById('filter-input');
const deleteAllBtn = document.getElementById('delete-all');
const errorMessage = document.getElementById('error-message');

let todos = [];
let editIndex = null;

function renderTodos(filter = "") {
  todoList.innerHTML = "";

  const filtered = todos.filter(todo =>
    todo.task.toLowerCase().includes(filter.toLowerCase())
  );

  if (filtered.length === 0) {
    todoList.innerHTML = `<p class="no-task">No tasks available</p>`;
    return;
  }

  filtered.forEach((todo, index) => {
    const taskEl = document.createElement('div');
    taskEl.className = 'todo-item';
    taskEl.innerHTML = `
      <div class="task-info">
        <strong>${todo.task}</strong>
        <span class="date">📅 ${formatDate(todo.date)}</span>
      </div>
      <div class="actions">
        <button class="edit-btn" data-index="${index}">✏️</button>
        <button class="delete-btn" data-index="${index}">🗑️</button>
      </div>
    `;
    todoList.appendChild(taskEl);
  });
}

function formatDate(dateStr) {
  const options = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
  return new Date(dateStr).toLocaleDateString('id-ID', options);
}

function showError(message) {
  errorMessage.textContent = message;
  errorMessage.classList.add('show');

  setTimeout(() => {
    errorMessage.classList.remove('show');
    setTimeout(() => {
      errorMessage.textContent = '';
    }, 300); // tunggu transisi selesai baru kosongkan teks
  }, 3000);
}


form.addEventListener('submit', (e) => {
  e.preventDefault();
  const task = todoInput.value.trim();
  const date = todoDate.value;

  if (todos.some((todo, i) => todo.task.toLowerCase() === task.toLowerCase() && i !== editIndex)) {
    showError("Todo with the same name already exists.");
    return;
  }

  if (editIndex !== null) {
    todos[editIndex] = { task, date };
    editIndex = null;
  } else {
    todos.push({ task, date });
  }

  todoInput.value = '';
  todoDate.value = '';
  renderTodos(filterInput.value);
});

todoList.addEventListener('click', (e) => {
  const index = e.target.dataset.index;

  if (e.target.classList.contains('delete-btn')) {
    todos.splice(index, 1);
    renderTodos(filterInput.value);
  }

  if (e.target.classList.contains('edit-btn')) {
    const todo = todos[index];
    todoInput.value = todo.task;
    todoDate.value = todo.date;
    editIndex = index;
    todoInput.focus();
  }
});

filterInput.addEventListener('input', () => {
  renderTodos(filterInput.value);
});

deleteAllBtn.addEventListener('click', () => {
  todos = [];
  renderTodos();
});

renderTodos();

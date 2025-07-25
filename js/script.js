<script>
  const form = document.querySelector("form");
  const todoInput = document.getElementById("todo");
  const todoDate = document.getElementById("date");
  const todoList = document.getElementById("todo-list");
  const searchInput = document.getElementById("search");
  const monthFilter = document.getElementById("monthFilter");
  const errorMessage = document.getElementById("error-message");

  let todos = [];
  let editIndex = null;

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const task = todoInput.value.trim();
    const date = todoDate.value;

    if (!task || !date) {
      showError("Harap isi semua kolom.");
      return;
    }

    if (
      todos.some(
        (todo, i) =>
          todo.task.toLowerCase() === task.toLowerCase() && i !== editIndex
      )
    ) {
      showError("Todo dengan nama yang sama sudah ada.");
      return;
    }

    if (editIndex !== null) {
      todos[editIndex] = { task, date };
      editIndex = null;
    } else {
      todos.push({ task, date });
    }

    todoInput.value = "";
    todoDate.value = "";
    renderTodos(searchInput.value, monthFilter.value);
  });

  function renderTodos(searchText = "", month = "") {
    todoList.innerHTML = "";

    todos
      .filter((todo) => {
        const matchesSearch = todo.task
          .toLowerCase()
          .includes(searchText.toLowerCase());

        const todoDateObj = new Date(todo.date);
        const todoMonth = todoDateObj.getMonth() + 1;

        const matchesMonth =
          month === "" || todoMonth === parseInt(month, 10);

        return matchesSearch && matchesMonth;
      })
      .forEach((todo, index) => {
        const item = document.createElement("div");
        item.className = "todo-item";

        const info = document.createElement("div");
        info.className = "task-info";
        info.innerHTML = `<strong>${todo.task}</strong> <span>${todo.date}</span>`;

        const actions = document.createElement("div");
        actions.className = "actions";

        const editBtn = document.createElement("button");
        editBtn.textContent = "Edit";
        editBtn.onclick = () => editTodo(index);

        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "Hapus";
        deleteBtn.onclick = () => deleteTodo(index);

        actions.appendChild(editBtn);
        actions.appendChild(deleteBtn);

        item.appendChild(info);
        item.appendChild(actions);

        todoList.appendChild(item);
      });
  }

  function editTodo(index) {
    todoInput.value = todos[index].task;
    todoDate.value = todos[index].date;
    editIndex = index;
  }

  function deleteTodo(index) {
    todos.splice(index, 1);
    renderTodos(searchInput.value, monthFilter.value);
  }

  function showError(message) {
    errorMessage.textContent = message;
    errorMessage.classList.add("show");
    setTimeout(() => {
      errorMessage.classList.remove("show");
    }, 2500);
  }

  // Filter otomatis saat ketik dan pilih bulan
  searchInput.addEventListener("input", () => {
    renderTodos(searchInput.value, monthFilter.value);
  });

  monthFilter.addEventListener("change", () => {
    renderTodos(searchInput.value, monthFilter.value);
  });

  // Hapus semua
  document.getElementById("hapusSemua").addEventListener("click", () => {
    todos = [];
    renderTodos();
  });

  // Inisialisasi bulan tanpa option default
  (() => {
    const months = [
      "Januari", "Februari", "Maret", "April", "Mei", "Juni",
      "Juli", "Agustus", "September", "Oktober", "November", "Desember"
    ];
    months.forEach((month, index) => {
      const option = document.createElement("option");
      option.value = index + 1;
      option.text = month;
      monthFilter.appendChild(option);
    });
  })();
</script>

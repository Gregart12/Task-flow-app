let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let filter = "all";

const taskList = document.getElementById("task-list");
const newTaskInput = document.getElementById("new-task-input");
const addTaskButton = document.getElementById("add-task-button");
const taskCount = document.getElementById("task-count");
const clearCompleted = document.getElementById("clear-completed");
const filterButtons = document.querySelectorAll(".filters button");
const darkToggle = document.getElementById("dark-mode-toggle");

function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function updateTaskCount() {
  const count = tasks.filter(t => !t.completed).length;
  taskCount.textContent = `${count} task${count !== 1 ? "s" : ""} remaining`;
}

function renderTasks() {
  taskList.innerHTML = "";
  tasks
    .filter(task => {
      if (filter === "active") return !task.completed;
      if (filter === "completed") return task.completed;
      return true;
    })
    .forEach(task => {
      const li = document.createElement("li");
      li.className = "task-item";

      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.checked = task.completed;
      checkbox.onchange = () => {
        task.completed = checkbox.checked;
        saveTasks();
        renderTasks();
      };

      const span = document.createElement("span");
      span.textContent = task.text;
      span.className = "task-text";
      if (task.completed) span.classList.add("completed");
      span.contentEditable = true;
      span.onblur = () => {
        task.text = span.textContent.trim();
        saveTasks();
      };

      const delBtn = document.createElement("button");
      delBtn.textContent = "🗑️";
      delBtn.onclick = () => {
        tasks = tasks.filter(t => t.id !== task.id);
        saveTasks();
        renderTasks();
      };

      const actions = document.createElement("div");
      actions.className = "task-actions";
      actions.appendChild(delBtn);

      li.appendChild(checkbox);
      li.appendChild(span);
      li.appendChild(actions);
      taskList.appendChild(li);
    });

  updateTaskCount();
}

addTaskButton.onclick = () => {
  const text = newTaskInput.value.trim();
  if (text === "") return;
  tasks.push({ id: Date.now(), text, completed: false });
  newTaskInput.value = "";
  saveTasks();
  renderTasks();
};

newTaskInput.addEventListener("keypress", e => {
  if (e.key === "Enter") addTaskButton.click();
});

clearCompleted.onclick = () => {
  tasks = tasks.filter(t => !t.completed);
  saveTasks();
  renderTasks();
};

filterButtons.forEach(btn => {
  btn.onclick = () => {
    filterButtons.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    filter = btn.getAttribute("data-filter");
    renderTasks();
  };
});

darkToggle.onchange = () => {
  document.body.classList.toggle("dark-mode", darkToggle.checked);
};

// Load dark mode from preference
if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
  darkToggle.checked = true;
  document.body.classList.add("dark-mode");
}

renderTasks();

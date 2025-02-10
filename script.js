const titleInput = document.getElementById("titleInput");
const descriptionInput = document.getElementById("descriptionInput");
const categorySelect = document.getElementById("categorySelect");
const prioritySelect = document.getElementById("prioritySelect");
const dateElement = document.getElementById("date");
const TimeElement = document.getElementById("time");
const todoList = document.querySelector(".todo-lists");
const searchBox = document.getElementById("searchBox");
const allButton = document.getElementById("allButton");
const personalButton = document.getElementById("personalData");
const workButton = document.getElementById("workData");
const otherButton = document.getElementById("otherData");
const addCategoryButton = document.getElementById("addCategory");
const addIconContainer = document.querySelector(".add-icon");
const addNode = document.querySelector(".cta-button");
const displayContainer = document.querySelector(".displayData");
const nonDisplayContainer = document.querySelector(".disable-on-data");
function goBack() {
  window.history.back();
}
if (todoList && displayContainer) {
  displayContainer.style.display = "block";
}

if (addIconContainer) {
  addIconContainer.addEventListener("click", function () {
    localStorage.removeItem("taskToEdit");
    window.location.href = "./components/add.html";
  });
}

if (addNode) {
  addNode.addEventListener("click", function () {
    localStorage.removeItem("taskToEdit");
    window.location.href = "./components/add.html";
  });
}

function showDateTime() {
  const now = new Date();
  const date = now.toLocaleDateString();
  const time = now.toLocaleTimeString();

  if (dateElement) {
    dateElement.textContent = `Date: ${date} `;
  }
  if (TimeElement) {
    TimeElement.textContent = `Time: ${time}`;
  }
}

function createTaskElement(task, index) {
  const listItem = document.createElement("li");
  listItem.classList.add("todo");

  if (task.completed) {
    listItem.classList.add("completed");
  }

  listItem.innerHTML = `
  <div class="todo-lists">
    <span id="title"><i class="fas fa-book"></i> ${task.title}</span><br>
    <div class="datetime">
      <span><i class="fas fa-calendar-alt"></i>  ${task.date}</span><br>
      <span><i class="fas fa-clock"></i> ${task.time}</span><br>
    </div>
    <span id="Description"><i class="fas fa-align-left"></i> ${task.description}</span><br>
    <span id="Category"><i class="fas fa-list-alt"></i> ${task.category}</span><br>
    <span id="Priority"><i class="fas fa-exclamation-circle"></i> ${task.priority}</span><br>
    <div class ="button">
    <button onclick="editTask(${index})">
      <i class="fas fa-edit"></i> Edit
    </button>
        <button onclick="deleteTask(${index})">
      <i class="fas fa-trash-alt"></i> Delete
    </button>
    
    </div>
  </div>
`;

  return listItem;
}

function saveData() {
  const title = titleInput.value;
  const description = descriptionInput.value;
  const category = categorySelect.value || "All";
  const priority = prioritySelect.value || "Low";
  const date = new Date().toLocaleDateString();
  const time = new Date().toLocaleTimeString();

  if (title && description && category && priority) {
    const taskData = {
      title,
      description,
      category,
      priority,
      date,
      time,
      completed: false,
    };

    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    tasks.push(taskData);
    localStorage.setItem("tasks", JSON.stringify(tasks));

    titleInput.value = "";
    descriptionInput.value = "";
    categorySelect.value = "";
    prioritySelect.value = "Low";

    alert("Task saved successfully!");
    loadTasks();
    window.location.href = "./index.html";
  } else {
    alert("Please fill all the fields correctly.");
  }
}

function loadTasks() {
  if (!todoList) {
    console.error("The todoList element is not found!");
    return;
  }

  todoList.innerHTML = "";
  const tasks = JSON.parse(localStorage.getItem("tasks")) || [];

  if (tasks.length === 0) {
    nonDisplayContainer.style.display = "block";
    displayContainer.style.display = "none";
  } else {
    nonDisplayContainer.style.display = "none";
    displayContainer.style.display = "block";
  }

  const priorityOrder = { Low: 1, Medium: 2, High: 3 };

  tasks.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);

  tasks.forEach((task, index) => {
    const listItem = createTaskElement(task, index);
    todoList.appendChild(listItem);
  });
}

function toggleTaskCompletion(index) {
  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  tasks[index].completed = !tasks[index].completed;
  localStorage.setItem("tasks", JSON.stringify(tasks));
  loadTasks();
}

function deleteTask(index) {
  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  tasks.splice(index, 1);
  localStorage.setItem("tasks", JSON.stringify(tasks));
  loadTasks();
}

let debounceTimer;

function handleSearch() {
  const searchQuery = searchBox.value.toLowerCase().trim();
  const tasks = JSON.parse(localStorage.getItem("tasks")) || [];

  if (searchQuery === "") {
    displayTasks(tasks);
    return;
  }

  const filteredTasks = tasks.filter(
    (task) =>
      task.title.toLowerCase().includes(searchQuery) ||
      task.date.split("/").some((part) => part.includes(searchQuery))
  );

  if (filteredTasks.length === 0) {
    todoList.innerHTML = "<p>No tasks found.</p>";
  } else {
    displayTasks(filteredTasks);
  }
}

function displayTasks(tasks) {
  todoList.innerHTML = "";

  const priorityOrder = { Low: 1, Medium: 2, High: 3 };
  tasks.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);

  tasks.forEach((task, index) => {
    const listItem = createTaskElement(task, index);
    todoList.appendChild(listItem);
  });
}

if (searchBox) {
  searchBox.addEventListener("input", function () {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(handleSearch, 300);
  });
}

function filterTasksByCategory(category) {
  const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  const filteredTasks = tasks.filter(
    (task) => task.category === category || category === "All"
  );

  const priorityOrder = { Low: 1, Medium: 2, High: 3 };
  filteredTasks.sort(
    (a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]
  );

  todoList.innerHTML = "";
  filteredTasks.forEach((task, index) => {
    const listItem = createTaskElement(task, index);
    todoList.appendChild(listItem);
  });
}

if (allButton) {
  allButton.addEventListener("click", () => filterTasksByCategory("All"));
}

if (personalButton) {
  personalButton.addEventListener("click", () =>
    filterTasksByCategory("Personal")
  );
}

if (workButton) {
  workButton.addEventListener("click", () => filterTasksByCategory("Work"));
}

if (otherButton) {
  otherButton.addEventListener("click", () => filterTasksByCategory("Other"));
}

function editTask(index) {
  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  const task = tasks[index];

  if (!task) {
    alert("Error: Task not found.");
    return;
  }

  localStorage.setItem("taskToEdit", JSON.stringify(task));
  window.location.href = "./components/edit.html";
}

function updateTask(taskToEdit) {
  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  const title = titleInput.value;
  const description = descriptionInput.value;
  const category = categorySelect.value;
  const priority = prioritySelect.value;
  const date = new Date().toLocaleDateString();
  const time = new Date().toLocaleTimeString();

  if (title && description && category !== "default" && priority) {
    const updatedTask = {
      title,
      description,
      category,
      priority,
      date,
      time,
      completed: taskToEdit.completed,
    };

    const index = tasks.findIndex((t) => t.title === taskToEdit.title);
    if (index !== -1) {
      tasks[index] = updatedTask;
      localStorage.setItem("tasks", JSON.stringify(tasks));

      titleInput.value = "";
      descriptionInput.value = "";
      categorySelect.value = "default";
      prioritySelect.value = "Low";
      alert("Task updated successfully!");
      window.location.href = "./index.html";
      loadTasks();
    } else {
      alert("Task not found.");
    }
  } else {
    alert("Please fill all the fields correctly.");
  }
}

document.addEventListener("DOMContentLoaded", function () {
  loadTasks();
  setInterval(showDateTime, 1000);

  const taskToEdit = JSON.parse(localStorage.getItem("taskToEdit"));
  if (taskToEdit) {
    titleInput.value = taskToEdit.title;
    descriptionInput.value = taskToEdit.description;
    categorySelect.value = taskToEdit.category;
    prioritySelect.value = taskToEdit.priority;

    const saveButton = document.querySelector(".save-button");
    if (saveButton) {
      saveButton.onclick = function () {
        updateTask(taskToEdit);
      };
    } else {
      alert("Error: Save button not found.");
    }
  }
});

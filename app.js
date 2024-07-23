class Task {
    constructor(task, id, status) {
      this.task = task;
      this.id = id;
      this.status = status;
    }
  }
  
  const generateId = () => Math.floor(Math.random() * 100 + 1);
  
  const getTasks = () => {
    const tasks = localStorage.getItem("tasks");
    return tasks ? JSON.parse(tasks) : [];
  };
  
  const saveTasks = (tasks) => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  };
  
  const createTaskElement = (task, status) => {
    const list = document.querySelector("#task-list");
    const item = document.createElement("li");
  
    item.innerHTML = `
      <div class="task-item status ${status}" id="${task.id}">${task.task}</div>
      <div class="actions">
        <button class="start-btn start">Start</button>
        <button class="done-btn mark-as-done" hidden=${
          status === "to-do"
        }>Mark as Done</button>
        <button class="edit-btn edit">Edit</button>
        <button class="delete-btn delete">Delete</button>
      </div>
    `;
  
    list.appendChild(item);
  };
  
  const loadTasks = () => {
    const tasks = getTasks();
    tasks.forEach(createTaskElement);
  };
  
  // TASK ACTIONS
  const taskInput = document.getElementById("taskInput");
  const addBtn = document.querySelector("#add-task");
  const updateBtn = document.querySelector("#update-task");
  const cancelBtn = document.querySelector("#cancel");
  const startTask = document.querySelector(".start-btn");
  const doneTask = document.querySelector(".done-btn");
  let activeTaskID = null;
  
  const addTask = () => {
    const taskElement = taskInput.value.trim();
  
    if (taskElement) {
      const task = new Task(taskElement, generateId(), "to-do");
      createTaskElement(task, "to-do");
      const tasks = getTasks();
      tasks.push(task);
      saveTasks(tasks);
      taskInput.value = "";
    } else {
      showError("Please enter a task!");
    }
  };
  
  const updateTask = (updatedTask, id) => {
    const tasks = getTasks();
    const updatedTasks = tasks.map((task) => {
      if (task.id === Number(id)) {
        return { ...task, task: updatedTask };
      }
      return task;
    });
    saveTasks(updatedTasks);
    location.reload();
  };
  
  const deleteTask = (id) => {
    const tasks = getTasks();
    const updatedTasks = tasks.filter((task) => task.id !== Number(id));
    saveTasks(updatedTasks);
  };
  
  const showError = (message) => {
    const errorContainer = document.createElement("div");
    errorContainer.classList.add("error");
    errorContainer.textContent = message;
  
    const taskInput = document.querySelector(".app-title");
    taskInput.parentNode.insertBefore(errorContainer, taskInput);
  
    setTimeout(() => {
      errorContainer.remove();
    }, 3000);
  };
  
  const handleStartTask = (e) => {
    if (e.target.classList.contains("start-btn")) {
      const taskId = e.target.parentElement.previousElementSibling.id;
      const taskElement = e.target.parentElement.parentElement;
      const parentTaskElement = e.target.parentElement.previousElementSibling;
      const tasks = getTasks();
      const updatedTasks = tasks.map((task) => {
        if (task.id === Number(taskId)) {
          return { ...task, status: "pending" };
        }
        return task;
      });
      saveTasks(updatedTasks);
  
      parentTaskElement.classList.remove("to-do");
      parentTaskElement.classList.add("pending");
      taskElement.querySelector(".start-btn").setAttribute("hidden", true);
      taskElement.querySelector(".done-btn").removeAttribute("hidden");
      activeTaskID = null;
    }
  };
  
  const handleMarkAsDoneTask = (e) => {
    if (e.target.classList.contains("done-btn")) {
      const taskId = e.target.parentElement.previousElementSibling.id;
      const taskElement = e.target.parentElement.parentElement;
      const parentTaskElement = e.target.parentElement.previousElementSibling;
      const tasks = getTasks();
      const updatedTasks = tasks.map((task) => {
        if (task.id === Number(taskId)) {
          return { ...task, status: "done" };
        }
        return task;
      });
      saveTasks(updatedTasks);
      parentTaskElement.classList.remove("pending");
      parentTaskElement.classList.add("done");
      parentTaskElement.style.textDecoration = "line-through";
      taskElement.strikeThrough = true;
      taskElement.querySelector(".done-btn").setAttribute("hidden", true);
      taskElement.querySelector(".edit-btn").setAttribute("hidden", true);
      activeTaskID = null;
    }
  };
  
  const handleEditTask = (e) => {
    if (e.target.classList.contains("edit-btn")) {
      const taskId = e.target.parentElement.previousElementSibling.id;
      const taskName = getTasks().find((task) => task.id === Number(taskId)).task;
      taskInput.value = taskName;
      activeTaskID = taskId;
  
      addBtn.setAttribute("hidden", true);
      updateBtn.removeAttribute("hidden");
      cancelBtn.removeAttribute("hidden");
    }
  };
  
  const handleDeleteTask = (e) => {
    if (e.target.classList.contains("delete-btn")) {
      const taskId = e.target.parentElement.previousElementSibling.id;
      const taskElement = e.target.parentElement.parentElement;
      deleteTask(taskId);
      taskElement.remove();
    }
  };
  
  // Event listeners
  loadTasks();
  
  addBtn.addEventListener("click", addTask);
  
  updateBtn.addEventListener("click", () => {
    const task = taskInput.value.trim();
    updateTask(task, activeTaskID);
    taskInput.value = "";
    addBtn.removeAttribute("hidden");
    updateBtn.setAttribute("hidden", true);
    cancelBtn.setAttribute("hidden", true);
    activeTaskID = null;
  });
  
  cancelBtn.addEventListener("click", () => {
    taskInput.value = "";
    addBtn.removeAttribute("hidden");
    updateBtn.setAttribute("hidden", true);
    cancelBtn.setAttribute("hidden", true);
    activeTaskID = null;
  });
  
  document.querySelector("#task-list").addEventListener("click", handleEditTask);
  document
    .querySelector("#task-list")
    .addEventListener("click", handleDeleteTask);
  document.querySelector("#task-list").addEventListener("click", handleStartTask);
  document
    .querySelector("#task-list")
    .addEventListener("click", handleMarkAsDoneTask);
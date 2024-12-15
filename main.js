class TodoApp {
  constructor(list, taskInput, dateInput, timeInput) {
    this.tasks = [];
    this.taskListElem = list;
    this.newTaskInputElem = taskInput;
    this.dueDateInput = dateInput;
    this.dueTimeInput = timeInput;
    this.statusFilter = "all"; // Default filter
    this.searchFilter = ""; // Default search query

    // Initial render
    this.renderTaskList();
  }
  addTask() {
    const taskName = this.newTaskInputElem.value.trim();
    const dueDate = this.dueDateInput.value.trim();
    const dueTime = this.dueTimeInput.value.trim();
    const currentTime = new Date();
    let currentDay = currentTime.getDay();
    let currentDate = currentTime.getDate();
    let currentMonth = currentTime.getMonth() + 1;
    let currentYear = currentTime.getFullYear();
    let currentMinute =currentTime.getMinutes();
    let currentHour = currentTime.getHours();

    if (taskName) {
      const words = taskName.split(" ");
      const longWord = words.filter(word => word.length > 15);
      if (longWord.length > 0) {
        alert("Too long word;")
      }
      else {
        const newTask = {
          id: this.tasks.length ? this.tasks[this.tasks.length - 1].id + 1 : 1,
          name: taskName,
          completed: false,
          selected: false,
          createdDate: currentDate + "/" + currentMonth + "/" + currentYear,
          createdTime: currentHour + ":" + currentMinute,
          dueDate: dueDate,
          dueTime: dueTime,
        }
        this.tasks.push(newTask);
        this.newTaskInputElem.value = "";
        this.dueDateInput.value = "";
        this.dueTimeInput.value = "";
        this.renderTaskList();

      }
    }
    else {
      alert("Please enter a task name.");
    }
  }

  deleteSelectedTasks() {
    this.tasks = this.tasks.filter(task => !task.selected);
    this.renderTaskList();
  }

  markSelectedTasks() {
    this.tasks.forEach(task => {
      if (task.selected) {
        task.completed = !task.completed;
        task.selected = false;
      }
    });
    this.renderTaskList();
  }

  toggleTaskSelection(id) {
    const task = this.tasks.find(task => task.id === id);
    if (task) {
      task.selected = !task.selected;
      this.renderTaskList();
    }
  }

  groupTasksByDate() {
    const groupedTasks = {};
    const currentTime = new Date();
    let currentDay = currentTime.getDay();
    let currentDate = currentTime.getDate();
    let currentMonth = currentTime.getMonth() + 1;
    let currentYear = currentTime.getFullYear();
    let currentMinute = currentTime.getMinutes() < 10 ? 0 + currentTime.getMinutes() : currentTime.getMinutes();
    this.tasks
      .filter(task => {
        if (this.statusFilter === "completed") return task.completed;
        if (this.statusFilter === "pending") return !task.completed;
        return true;
      })
      .filter(task => task.name.toLowerCase().includes(this.searchFilter.toLowerCase()))
      .forEach(task => {
        const taskDate = task.createdDate;
        const groupName = taskDate == currentDate + "/" + currentMonth + "/" + currentYear ? "Today" : taskDate;

        if (!groupedTasks[groupName]) {
          groupedTasks[groupName] = [];
        }
        groupedTasks[groupName].push(task);
      });

    return groupedTasks;
  }

  applyFilters(statusFilter) {
    const statusFilterElem = statusFilter;
    this.statusFilter = statusFilterElem.value;
    this.renderTaskList();
  }
  renderTaskList() {
    this.taskListElem.innerHTML = "";
    if (this.tasks.length == 0) {
      this.taskListElem.innerHTML = "<h1>No task yet</h1>"
    }
    const groupedTasks = this.groupTasksByDate();

    Object.keys(groupedTasks).forEach(groupName => {
      const groupHeading = document.createElement("h3");
      groupHeading.textContent = groupName;
      this.taskListElem.appendChild(groupHeading);

      groupedTasks[groupName].forEach(task => {
        const taskItem = document.createElement("li");
        const taskBox = document.createElement("span");
        taskItem.className = "taskContainer";
        const taskName = document.createElement("span");
        taskName.textContent = task.name;
        taskName.style.textDecoration = task.completed ? "line-through" : "none";
        taskItem.style.backgroundColor = task.selected ? "#ddd" : "";
        taskBox.ontouchstart = (e) => {
          e.preventDefault();
          this.longPressTimeout = setTimeout(() => {
            task.selected = !task.selected;
            this.renderTaskList();
          }, 500);
        };

        taskBox.ontouchend = (e) => {
          e.preventDefault();
          clearTimeout(this.longPressTimeout);
        }
        const infoButton = document.createElement("button");
        infoButton.innerHTML = "<i class='bx bx-info-circle'></i>";
        infoButton.style.marginLeft = "10px";
        infoButton.onclick = () => this.showTaskInfo(task);

        // Add elements to task item
        taskBox.appendChild(taskName);
        taskItem.appendChild(taskBox);
        taskItem.appendChild(infoButton)

        this.taskListElem.appendChild(taskItem);

      });
    });
  }
  showTaskInfo(task) {
    ; // Format creation date
    const dueDate = task.dueDate ? task.dueDate : "Not set";
    const dueTime = task.dueTime ? task.dueTime : "Not set";
    alert(`Task Info:\n\nName: ${task.name}\n\nCreated At: ${task.createdDate + ' at '+ task.createdTime}\n\nDue Date: ${dueDate}\n\nDue Time: ${dueTime}`);
  }


}
// Initialize the app
document.addEventListener("DOMContentLoaded", () => {

  const taskInput = document.getElementById('taskInput');
  const taskList = document.getElementById('task-list');
  const taskTime = document.getElementById('taskTime');
  const taskDate = document.getElementById('taskDate');

  const app = new TodoApp(taskList, taskInput, taskDate, taskTime);



  app.renderTaskList();
  document.getElementById("addBtn").onclick = () => { app.addTask() ;};
  document.getElementById("dltBtn").onclick = () => { app.deleteSelectedTasks(); }
  
  document.getElementById("markBtn").onclick = () => { app.markSelectedTasks(); }
  
  document.getElementById("status-filter").onchange = () => { app.applyFilters(document.getElementById('status-filter')); };

const navIcon = document.querySelector('.menu-icon');
const slide = document.querySelector('.sidebar');

let ind = false;
navIcon.onclick=()=>{
  if(!ind){
  slide.style.animation = "slide 0.3s linear forwards";
    ind = true;
  }
  else{}
}

document.querySelector('.one').onclick=()=>{
  if(ind){
    slide.style.animation = "slideBack 0.3s linear forwards";
    ind = false;
  }
}

document.querySelector('.two').onclick=()=>{
  if(ind){
    slide.style.animation = "slideBack 0.3s linear forwards";
    ind = false;
  }
}
});
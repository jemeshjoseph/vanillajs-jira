/**
 * Put the JavaScript code in this file
 */
let tasksList = [];
let assigneeList = [];
let taskType = null;
let taskSections = document.querySelectorAll('.section-container');
let selectedTask = null;

(async function () {
  let data = await fetch('data.json').then((response) => response.json());
  console.log('Result: ', data);
  if (data && data.data && data.data.assignee && data.data.assignee.length) {
    assigneeList = data.data.assignee;

    const assigneeSelect = document.querySelector('#assignee');
    assigneeList.forEach((assignee) => {
      assigneeSelect.innerHTML += `<option value="${assignee.name}">${assignee.name}</option>`;
    });
  }

  if (data && data.data && data.data.tasks && data.data.tasks.length) {
    tasksList = data.data.tasks;
    console.log('tasksList: ', tasksList);
    console.log('taskSections: ', taskSections);

    refreshBoard();
  }
})();

function refreshBoard() {
  taskSections.forEach((section) => {
    section.innerHTML = '';
  });

  tasksList.forEach((task) => {
    const template = `<div class="task" id="task${task.id}">
  <div class="name">${task.text}</div>
  <div class="data">${task.date}</div>
  <div class="assignee">${task.assignee}</div>
</div>`;
    switch (task.status) {
      case 'todo':
        taskSections[0].innerHTML += template;
        break;
      case 'inprogress':
        taskSections[1].innerHTML += template;
        break;
      case 'done':
        taskSections[2].innerHTML += template;
        break;
    }
  });

  addListernersForTask();
}

function addListernersForTask() {
  tasksList.forEach((task) => {
    const element = document.querySelector(`#task${task.id}`);
    element.addEventListener('click', function () {
      console.log(element.id, task);
      selectedTask = task;
      let modalDiv = document.querySelector('#add-task');
      modalDiv.className = 'modal';
      document.querySelector('#task').value = task.text;
      document.querySelector('#date').value = task.date;
      document.querySelector('#assignee').value = task.assignee;
    });
  });
}

function openAddTaskModal(taskTypeValue) {
  taskType = taskTypeValue;
  console.log('Opening modal: ', taskTypeValue);
  let modalDiv = document.querySelector('#add-task');
  modalDiv.className = 'modal';
}

function closeModal() {
  let modalDiv = document.querySelector('#add-task');
  modalDiv.className = 'modal hide';
}

function submitForm() {
  console.log('Form submit fired');
  const taskValue = document.querySelector('#task').value;
  const dateValue = document.querySelector('#date').value;
  const assigneeValue = document.querySelector('#assignee').value;

  console.log(taskValue, dateValue, assigneeValue);
  if (taskValue && dateValue && assigneeValue) {
    tasksList.push({
      id: 'XXX',
      text: taskValue,
      date: dateValue,
      assignee: assigneeValue,
      status: taskType,
    });

    refreshBoard();
    closeModal();
  }
}

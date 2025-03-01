function addTask() {
    let taskInput = document.getElementById("taskInput");
    let taskList = document.getElementById("taskList");

    if (taskInput.value === "") {
        alert("Please enter a task!");
        return;
    }

    let li = document.createElement("li");
    li.innerHTML = `${taskInput.value} <button onclick="removeTask(this)">❌</button>`;
    li.addEventListener("click", function () {
        li.classList.toggle("completed");
    });

    taskList.appendChild(li);
    taskInput.value = "";
}

function removeTask(task) {
    task.parentElement.remove();
}

document.addEventListener("DOMContentLoaded", () => {
    const taskInput = document.getElementById("task-input");
    const addTaskBtn = document.getElementById("add-task-btn");
    const todoList = document.getElementById("todo-list");
    const markCompletedBtn = document.getElementById("mark-completed-btn");
    const deleteCompletedBtn = document.getElementById("delete-completed-btn");
    const prevDayBtn = document.getElementById("prev-day-btn");
    const nextDayBtn = document.getElementById("next-day-btn");
    const currentDateSpan = document.getElementById("current-date");
    const calendar = document.getElementById("calendar");

    let selectedDate = new Date();

    function formatDate(date) {
        return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    }

    function updateDateDisplay() {
        const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        currentDateSpan.textContent = `${monthNames[selectedDate.getMonth()]} ${selectedDate.getDate()}, ${dayNames[selectedDate.getDay()]}`;
    }

    function changeSelectedDate(days) {
        selectedDate.setDate(selectedDate.getDate() + days);
        updateDateDisplay();
        createCalendar();
        displayTasksForSelectedDate();
    }

    prevDayBtn.addEventListener("click", () => {
        changeSelectedDate(-1);
    });

    nextDayBtn.addEventListener("click", () => {
        changeSelectedDate(1);
    });

    updateDateDisplay();

    function createCalendar() {
        calendar.innerHTML = "";

        const currentMonth = selectedDate.getMonth();
        const currentYear = selectedDate.getFullYear();
        const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
        const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

        let dayNumber = 1;
        for (let i = 0; i < 6; i++) {
            const row = document.createElement("tr");
            for (let j = 0; j < 7; j++) {
                const cell = document.createElement("td");
                if (i === 0 && j < firstDayOfMonth || dayNumber > daysInMonth) {
                    cell.classList.add("empty");
                } else {
                    cell.textContent = dayNumber;
                    cell.addEventListener("click", () => {
                        setSelectedDate(new Date(currentYear, currentMonth, dayNumber));
                    });
                    if (selectedDate.getDate() === dayNumber && selectedDate.getMonth() === currentMonth && selectedDate.getFullYear() === currentYear) {
                        cell.classList.add("selected");
                    }
                    dayNumber++;
                }
                row.appendChild(cell);
            }
            calendar.appendChild(row);
        }
    }

    createCalendar();

    function setSelectedDate(date) {
        selectedDate = date;
        updateDateDisplay();
        createCalendar();
        displayTasksForSelectedDate();
    }

    function addTask() {
        const taskText = taskInput.value.trim();
        if (taskText.length > 0) {
            const newTask = document.createElement("li");
            newTask.textContent = taskText;
            todoList.appendChild(newTask);
            taskInput.value = "";
            saveTasks();
        }
    }

    function toggleCompleted(event) {
        if (event.target.tagName === "LI") {
            event.target.classList.toggle("selected");
            checkButtons();
        }
    }

    function markCompleted() {
        const selectedItems = document.querySelectorAll("#todo-list .selected");
        selectedItems.forEach(item => {
            item.classList.remove("selected");
            item.classList.add("completed");
        });
        checkButtons();
        saveTasks();
    }

    function deleteCompleted() {
        const selectedItems = document.querySelectorAll("#todo-list .completed.selected");
        selectedItems.forEach(item => {
            todoList.removeChild(item);
        });
        checkButtons();
        saveTasks();
    }

    function checkButtons() {
        const selectedItems = document.querySelectorAll("#todo-list .selected");
        const completedSelectedItems = document.querySelectorAll("#todo-list .completed.selected");
        markCompletedBtn.disabled = completedSelectedItems.length === selectedItems.length;
        deleteCompletedBtn.disabled = completedSelectedItems.length === 0;
    }

    function saveTasks() {
        const tasks = {};
        const listItems = document.querySelectorAll("#todo-list li");
        listItems.forEach(item => {
            const dateKey = formatDate(selectedDate);
            if (!tasks[dateKey]) {
                tasks[dateKey] = [];
            }
            tasks[dateKey].push({
                text: item.textContent,
                completed: item.classList.contains("completed")
            });
        });
        localStorage.setItem("tasks", JSON.stringify(tasks));
    }

    function loadTasks() {
        const tasks = JSON.parse(localStorage.getItem("tasks"));
        return tasks ? tasks : {};
    }

    function displayTasksForSelectedDate() {
        const tasks = loadTasks();
        const dateKey = formatDate(selectedDate);

        todoList.innerHTML = "";

        if (tasks[dateKey]) {
            tasks[dateKey].forEach(task => {
                const newTask = document.createElement("li");
                newTask.textContent = task.text;
                if (task.completed) {
                    newTask.classList.add("completed");
                }
                todoList.appendChild(newTask);
            });
        }
    }

    addTaskBtn.addEventListener("click", addTask);
    todoList.addEventListener("click", toggleCompleted);
    markCompletedBtn.addEventListener("click", markCompleted);
    deleteCompletedBtn.addEventListener("click", deleteCompleted);

    displayTasksForSelectedDate();
});

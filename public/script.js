const API_URL = "/api";


// ===============================
// SECTION NAVIGATION
// ===============================

function showSection(sectionId) {

    const sections = [
        "home",
        "skills",
        "login",
        "register",
        "tasks"
    ];

    sections.forEach(id => {
        const section = document.getElementById(id);

        if (section) {
            section.classList.add("hidden");
        }
    });

    const selectedSection = document.getElementById(sectionId);

    if (selectedSection) {
        selectedSection.classList.remove("hidden");
    }

    if (sectionId === "tasks") {
        loadTasks();
    }
}


// ===============================
// MESSAGE HELPER
// ===============================

function showMessage(elementId, message) {

    const element = document.getElementById(elementId);

    element.textContent = message;
    element.style.display = "block";
}


// ===============================
// REGISTER
// ===============================

document
    .getElementById("registerForm")
    .addEventListener("submit", async function (event) {

        event.preventDefault();

        const name =
            document.getElementById("registerName").value;

        const email =
            document.getElementById("registerEmail").value;

        const password =
            document.getElementById("registerPassword").value;

        try {

            const response = await fetch(
                `${API_URL}/auth/register`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
                        name,
                        email,
                        password
                    })
                }
            );

            const data = await response.json();

            showMessage(
                "registerMessage",
                data.message
            );

            if (data.success) {

                document
                    .getElementById("registerForm")
                    .reset();

                setTimeout(() => {
                    showSection("login");
                }, 1000);
            }

        } catch (error) {

            showMessage(
                "registerMessage",
                "Unable to connect to server."
            );
        }
    });


// ===============================
// LOGIN
// ===============================

document
    .getElementById("loginForm")
    .addEventListener("submit", async function (event) {

        event.preventDefault();

        const email =
            document.getElementById("loginEmail").value;

        const password =
            document.getElementById("loginPassword").value;

        try {

            const response = await fetch(
                `${API_URL}/auth/login`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
                        email,
                        password
                    })
                }
            );

            const data = await response.json();

            showMessage(
                "loginMessage",
                data.message
            );

            if (data.success) {

                localStorage.setItem(
                    "token",
                    data.token
                );

                document
                    .getElementById("loginForm")
                    .reset();

                document
                    .getElementById("taskNav")
                    .classList.remove("hidden");

                document
                    .getElementById("logoutBtn")
                    .classList.remove("hidden");

                setTimeout(() => {
                    showSection("tasks");
                }, 500);
            }

        } catch (error) {

            showMessage(
                "loginMessage",
                "Unable to connect to server."
            );
        }
    });


// ===============================
// LOAD TASKS
// ===============================

async function loadTasks() {

    const token = localStorage.getItem("token");

    if (!token) {
        showSection("login");
        return;
    }

    try {

        const response = await fetch(
            `${API_URL}/tasks`,
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );

        const data = await response.json();

        if (!response.ok) {

            if (response.status === 401) {
                logout();
                return;
            }

            throw new Error(data.message);
        }

        displayTasks(data.tasks);

    } catch (error) {

        document.getElementById("taskList").innerHTML =
            `<div class="card">
                <p>Unable to load tasks.</p>
            </div>`;
    }
}


// ===============================
// DISPLAY TASKS
// ===============================

function displayTasks(tasks) {

    const taskList =
        document.getElementById("taskList");

    taskList.innerHTML = "";

    if (!tasks || tasks.length === 0) {

        taskList.innerHTML =
            `<div class="card">
                <p>No tasks yet. Create your first task!</p>
            </div>`;

        return;
    }

    tasks.forEach(task => {

        const taskElement =
            document.createElement("div");

        taskElement.className = "task";

        taskElement.innerHTML = `
            <h3>${escapeHTML(task.title)}</h3>

            <p>
                ${escapeHTML(task.description || "No description")}
            </p>

            <p>
                <strong>Status:</strong>
                ${escapeHTML(task.status || "Pending")}
            </p>

            <p>
                <strong>Priority:</strong>
                ${escapeHTML(task.priority || "Medium")}
            </p>

            <p>
                <strong>Due Date:</strong>
                ${task.dueDate
                    ? escapeHTML(
                        new Date(task.dueDate)
                            .toLocaleDateString()
                    )
                    : "Not set"}
            </p>

            <div class="task-actions">

                <button
                    class="delete-btn"
                    onclick="deleteTask('${task._id}')"
                >
                    Delete
                </button>

            </div>
        `;

        taskList.appendChild(taskElement);
    });
}


// ===============================
// CREATE TASK
// ===============================

document
    .getElementById("taskForm")
    .addEventListener("submit", async function (event) {

        event.preventDefault();

        const token =
            localStorage.getItem("token");

        if (!token) {
            showSection("login");
            return;
        }

        const title =
            document.getElementById("taskTitle").value;

        const description =
            document.getElementById("taskDescription").value;

        const status =
            document.getElementById("taskStatus").value;

        const priority =
            document.getElementById("taskPriority").value;

        const dueDate =
            document.getElementById("taskDueDate").value;

        try {

            const response = await fetch(
                `${API_URL}/tasks`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json",

                        Authorization:
                            `Bearer ${token}`
                    },

                    body: JSON.stringify({
                        title,
                        description,
                        status,
                        priority,
                        dueDate
                    })
                }
            );

            const data = await response.json();

            if (!response.ok) {
                alert(data.message || "Failed to create task");
                return;
            }

            document
                .getElementById("taskForm")
                .reset();

            loadTasks();

        } catch (error) {

            alert("Unable to connect to server.");
        }
    });


// ===============================
// DELETE TASK
// ===============================

async function deleteTask(taskId) {

    const token =
        localStorage.getItem("token");

    if (!token) {
        showSection("login");
        return;
    }

    try {

        const response = await fetch(
            `${API_URL}/tasks/${taskId}`,
            {
                method: "DELETE",

                headers: {
                    Authorization:
                        `Bearer ${token}`
                }
            }
        );

        const data = await response.json();

        if (!response.ok) {
            alert(data.message || "Failed to delete task");
            return;
        }

        loadTasks();

    } catch (error) {

        alert("Unable to connect to server.");
    }
}


// ===============================
// LOGOUT
// ===============================

function logout() {

    localStorage.removeItem("token");

    document
        .getElementById("taskNav")
        .classList.add("hidden");

    document
        .getElementById("logoutBtn")
        .classList.add("hidden");

    showSection("home");
}


// ===============================
// SECURITY HELPER
// ===============================

function escapeHTML(value) {

    const div = document.createElement("div");

    div.textContent = value ?? "";

    return div.innerHTML;
}


// ===============================
// CHECK EXISTING LOGIN
// ===============================

window.addEventListener("DOMContentLoaded", () => {

    const token =
        localStorage.getItem("token");

    if (token) {

        document
            .getElementById("taskNav")
            .classList.remove("hidden");

        document
            .getElementById("logoutBtn")
            .classList.remove("hidden");
    }
});
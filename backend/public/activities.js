import {
    inputEnabled,
    setDiv,
    message,
    setToken,
    token,
    enableInput,
} from "./index.js";
import { showLoginRegister } from "./loginRegister.js";
import { showAddEdit } from "./addEdit.js";

let activitiesDiv = null;
let activitiesTable = null;
let activitiesTableHeader = null;

export const handleActivities = () => {
    activitiesDiv = document.getElementById("activities");
    const logoff = document.getElementById("logoff");
    const addActivity = document.getElementById("add-activity");
    activitiesTable = document.getElementById("activities-table");
    activitiesTableHeader = document.getElementById("activities-table-header");

    activitiesDiv.addEventListener("click", async (e) => {
        if (inputEnabled && e.target.nodeName === "BUTTON") {
            if (e.target === addActivity) {
                showAddEdit(null);
            } else if (e.target === logoff) {
                setToken(null);
                message.textContent = "You have been logged off.";
                activitiesTable.replaceChildren([activitiesTableHeader]);
                showLoginRegister();
            } else if (e.target.classList.contains("editButton")) {
                message.textContent = "";
                showAddEdit(e.target.dataset.id);
            } else if (e.target.classList.contains("deleteButton")) {
                enableInput(false);
                try {
                    const response = await fetch(
                        `/api/v1/activities/${e.target.dataset.id}`,
                        {
                            method: "DELETE",
                            headers: {
                                Authorization: `Bearer ${token}`,
                            },
                        }
                    );

                    if (response.status === 200) {
                        message.textContent = "Activity deleted successfully.";
                        showActivities();
                    } else {
                        const data = await response.json();
                        message.textContent = data.msg;
                    }
                } catch (err) {
                    console.error(err);
                    message.textContent = "A communication error occurred.";
                }
                enableInput(true);
            }
        }
    });
};

export const showActivities = async () => {
    try {
        enableInput(false);

        const response = await fetch("/api/v1/activities", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        });

        const data = await response.json();
        let children = [activitiesTableHeader];

        if (response.status === 200) {
            if (data.count === 0) {
                activitiesTable.replaceChildren(...children);
            } else {
                data.activities.forEach((activity) => {
                    const row = document.createElement("tr");

                    const editButton = `<td><button type="button" class="editButton" data-id=${activity._id}>edit</button></td>`;
                    const deleteButton = `<td><button type="button" class="deleteButton" data-id=${activity._id}>delete</button></td>`;
                    const rowHTML = `
                        <td>${activity.name}</td>
                        <td>${activity.description}</td>
                        <td>${activity.location}</td>
                        <td>${activity.price}</td>
                        <td>${activity.ageGroup.min}-${activity.ageGroup.max}</td>
                        <div>${editButton}${deleteButton}</div>`;

                    row.innerHTML = rowHTML;
                    children.push(row);
                });
                activitiesTable.replaceChildren(...children);
            }
        } else {
            message.textContent = data.msg;
        }
    } catch (err) {
        console.log(err);
        message.textContent = "A communication error occurred.";
    }
    enableInput(true);
    setDiv(activitiesDiv);
};

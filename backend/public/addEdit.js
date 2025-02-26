import { enableInput, inputEnabled, message, setDiv, token } from "./index.js";
import { showActivities } from "./activities.js";

let addEditDiv = null;
let name = null;
let description = null;
let location = null;
let price = null;
let minAge = null;
let maxAge = null;
let addingActivity = null;

export const handleAddEdit = () => {
    addEditDiv = document.getElementById("edit-activity");
    name = document.getElementById("activity-name");
    description = document.getElementById("description");
    location = document.getElementById("location");
    price = document.getElementById("price");
    minAge = document.getElementById("min-age");
    maxAge = document.getElementById("max-age");
    addingActivity = document.getElementById("adding-activity");
    const editCancel = document.getElementById("edit-cancel");

    addEditDiv.addEventListener("click", async (e) => {
        if (inputEnabled && e.target.nodeName === "BUTTON") {
            if (e.target === addingActivity) {
                enableInput(false);

                const method = addingActivity.textContent === "update" ? "PATCH" : "POST";
                const url = addingActivity.textContent === "update"
                    ? `/api/v1/activities/${addEditDiv.dataset.id}`
                    : "/api/v1/activities";

                // Validate input
                if (!name.value.trim() || !description.value.trim() || !location.value.trim() || isNaN(price.value) || price.value <= 0 ||
                    isNaN(minAge.value) || isNaN(maxAge.value) || Number(minAge.value) < 0 ||
                    Number(maxAge.value) < Number(minAge.value)) {
                    message.textContent = "Please provide valid name, description, location, price, and age group.";
                    enableInput(true);
                    return;
                }

                try {
                    const response = await fetch(url, {
                        method: method,
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${token}`,
                        },
                        body: JSON.stringify({
                            name: name.value.trim(),
                            description: description.value.trim(),
                            location: location.value.trim(),
                            price: parseFloat(price.value),
                            ageGroup: {
                                min: parseInt(minAge.value, 10),
                                max: parseInt(maxAge.value, 10),
                            },
                        }),
                    });
                    const data = await response.json();
                    if (response.status === 201 || response.status === 200) {
                        message.textContent =
                            response.status === 201
                                ? "Activity was created successfully."
                                : "Activity was updated successfully.";
                        name.value = "";
                        description.value = "";
                        location.value = "";
                        price.value = "";
                        minAge.value = "";
                        maxAge.value = "";
                        showActivities(); // Refresh the activities list
                    } else {
                        message.textContent = data.message || "Failed to save activity.";
                    }
                } catch (err) {
                    console.error(err);
                    message.textContent = "A communication error occurred.";
                }
                enableInput(true);

                    } else if (e.target === editCancel) {
                message.textContent = "";
                showActivities();
            }
        }
    });
};

export const showAddEdit = async (activityId) => {
    if (!activityId) {
        name.value = "";
        description.value = "";
        location.value = "";
        price.value = "";
        minAge.value = "";
        maxAge.value = "";
        addingActivity.textContent = "add";
        message.textContent = "";
        setDiv(addEditDiv);
    } else {
        enableInput(false);
        try {
            const response = await fetch(`/api/v1/activities/${activityId}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });

            const data = await response.json();
            if (response.status === 200) {
                name.value = data.activity.name;
                description.value = data.activity.description;
                location.value = data.activity.location;
                price.value = data.activity.price;
                minAge.value = data.activity.ageGroup.min;
                maxAge.value = data.activity.ageGroup.max;
                addingActivity.textContent = "update";
                message.textContent = "";
                addEditDiv.dataset.id = activityId;

                setDiv(addEditDiv);
            } else {
                message.textContent = "Activity not found.";
                showActivities();
            }
        } catch (err) {
            console.log(err);
            message.textContent = "A communication error occurred.";
            showActivities();
        }
        enableInput(true);
    }
};

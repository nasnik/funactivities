import React, { useState } from "react";
import axios from "axios";
import styles from "./CreateActivityModal.module.css";

interface Activity {
    _id: string;
    name: string;
    description: string;
    imageUrl: string | null;
    location: string;
    ageGroup: { min: number; max: number };
    price: number;
    numOfMeetings: number;
    schedule: { day: string; startDate: string; time: string }[];
}

interface CreateActivityModalProps {
    providerId: string;
    onClose: () => void;
    onActivityAdded: () => void;
    editingActivity: Activity | null;
}

const CreateActivityModal: React.FC<CreateActivityModalProps> = ({
                                                                     providerId,
                                                                     onClose,
                                                                     onActivityAdded,
                                                                     editingActivity,
                                                                 }) => {
    const [formData, setFormData] = useState({
        name: editingActivity?.name || "",
        description: editingActivity?.description || "",
        location: editingActivity?.location || "",
        ageMin: editingActivity?.ageGroup.min.toString() || "",
        ageMax: editingActivity?.ageGroup.max.toString() || "",
        price: editingActivity?.price.toString() || "",
        numOfMeetings: editingActivity?.numOfMeetings.toString() || "",
        day: editingActivity?.schedule[0]?.day || "",
        startDate: editingActivity?.schedule[0]?.startDate || "",
        time: editingActivity?.schedule[0]?.time || "",
        imageUrl: editingActivity?.imageUrl || null,
    });

    const [file, setFile] = useState<File | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setFile(e.target.files[0]); // Set the new file
        }
    };

    const handleSubmit = async () => {
        try {
            let imageUrl = formData.imageUrl; // Use existing imageUrl by default

            // Upload new file if selected
            if (file) {
                const fileData = new FormData();
                fileData.append("file", file);

                const uploadResponse = await axios.post(
                    `http://localhost:3000/api/v1/providers/${providerId}/upload`,
                    fileData,
                    {
                        headers: {
                            "Content-Type": "multipart/form-data",
                            Authorization: `Bearer ${localStorage.getItem("token")}`,
                        },
                    }
                );

                imageUrl = uploadResponse.data.imageUrl;
            }

            const activityData = {
                ...formData,
                ageGroup: { min: Number(formData.ageMin), max: Number(formData.ageMax) },
                price: Number(formData.price),
                numOfMeetings: Number(formData.numOfMeetings),
                schedule: [{ day: formData.day, startDate: formData.startDate, time: formData.time }],
                imageUrl, // Include the imageUrl in the activity data
                providerId,
            };

            if (editingActivity) {
                await axios.patch(
                    `http://localhost:3000/api/v1/activities/${editingActivity._id}`,
                    activityData,
                    {
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${localStorage.getItem("token")}`,
                        },
                    }
                );
            } else {
                // Create new activity
                await axios.post("http://localhost:3000/api/v1/activities", activityData, {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                });
            }

            onActivityAdded();
            onClose();
        } catch (error) {
            console.error("Error saving activity:", error);
        }
    };

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modal}>
                <h2 className={styles.title}>
                    {editingActivity ? "Edit Activity" : "Create New Activity"}
                </h2>
                <input className={styles.input} type="text" name="name" placeholder="Activity Name" value={formData.name} onChange={handleChange} />
                <textarea className={styles.textarea} name="description" placeholder="Description" value={formData.description} onChange={handleChange} />
                <input className={styles.input} type="text" name="location" placeholder="Location" value={formData.location} onChange={handleChange} />
                <input className={styles.input} type="number" name="ageMin" placeholder="Min Age" value={formData.ageMin} onChange={handleChange} />
                <input className={styles.input} type="number" name="ageMax" placeholder="Max Age" value={formData.ageMax} onChange={handleChange} />
                <input className={styles.input} type="number" name="price" placeholder="Price" value={formData.price} onChange={handleChange} />
                <input className={styles.input} type="number" name="numOfMeetings" placeholder="Number of Meetings" value={formData.numOfMeetings} onChange={handleChange} />
                <input className={styles.input} type="text" name="day" placeholder="Day" value={formData.day} onChange={handleChange} />
                <input className={styles.input} type="date" name="startDate" value={formData.startDate} onChange={handleChange} />
                <input className={styles.input} type="time" name="time" value={formData.time} onChange={handleChange} />
                <input className={styles.input} type="file" onChange={handleFileChange} />

                {formData.imageUrl && (
                    <div className={styles.imagePreview}>
                        <img src={formData.imageUrl} alt="Activity Preview" className={styles.previewImage} />
                    </div>
                )}

                <div className={styles.buttonContainer}>
                    <button className={styles.createButton} onClick={handleSubmit}>
                        {editingActivity ? "Save" : "Create"}
                    </button>
                    <button className={styles.cancelButton} onClick={onClose}>
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CreateActivityModal;
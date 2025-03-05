import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import styles from "./ProviderPage.module.css";
import CreateActivityModal from "./CreateActivityModal";
const baseUrl = import.meta.env.VITE_REACT_APP_BASE_URL;

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

const ProviderPage: React.FC = () => {
    const { providerId } = useParams() as { providerId: string };
    const [providerName, setProviderName] = useState<string>("");
    const [activities, setActivities] = useState<Activity[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
  //  const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [editingActivity, setEditingActivity] = useState<Activity | null>(null);

    const fetchProviderDetails = async () => {
        try {
            const token = localStorage.getItem("token");
            if (!token) throw new Error("No authentication token found");

            const providerRes = await axios.get(`${baseUrl}/provider/${providerId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            console.log("Provider Name:", providerRes.data.provider.name);
            setProviderName(providerRes.data.provider.name);

            const activitiesRes = await axios.get(`${baseUrl}/activities/provider/${providerId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            console.log("Activities Data:", activitiesRes.data);
            setActivities(activitiesRes.data.activities || []);
        } catch (error) {
            console.error("Error fetching provider details or activities:", error);
        }
    };

    useEffect(() => {
        fetchProviderDetails();
    }, [providerId]);

    const handleActivityAdded = () => {
        fetchProviderDetails();
    };


/*    const handleFileUpload = async () => {
        if (!selectedFile) return;

        const formData = new FormData();
        formData.append("image", selectedFile);

        try {
            const response = await axios.post(`${baseUrl}/providers/${providerId}/upload`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });

            console.log("File uploaded successfully:", response.data);
        } catch (error) {
            console.error("Error uploading file:", error);
        }
    };*/

    const handleDeleteActivity = async (activityId: string) => {
        try {
            const token = localStorage.getItem("token");
            if (!token) throw new Error("No authentication token found");

            await axios.delete(`${baseUrl}/activities/${activityId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            setActivities((prevActivities) =>
                prevActivities.filter((activity) => activity._id !== activityId)
            );

            console.log("Activity deleted successfully");
        } catch (error) {
            console.error("Error deleting activity:", error);
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.content}>
                <h2 className={styles.header}>Provider: {providerName}</h2>
                <button className={`${styles.button} ${styles.addButton}`} onClick={() => setIsModalOpen(true)}>
                    Add Activity
                </button>

                <table className={styles.table}>
                    <thead>
                    <tr>
                        <th>Image</th>
                        <th>Name</th>
                        <th>Description</th>
                        <th>Location</th>
                        <th>Age Group</th>
                        <th>Price</th>
                        <th>Meetings</th>
                        <th>Schedule</th>
                        <th>Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {activities.length > 0 ? (
                        activities.map((activity) => (
                            <tr key={activity._id}>
                                <td>
                                    {activity.imageUrl ? (
                                        <img src={activity.imageUrl} alt={activity.name} className={styles.activityImage} />
                                    ) : (
                                        <span>No Image</span>
                                    )}
                                </td>
                                <td>{activity.name}</td>
                                <td>{activity.description}</td>
                                <td>{activity.location}</td>
                                <td>{activity.ageGroup.min} - {activity.ageGroup.max}</td>
                                <td>${activity.price}</td>
                                <td>{activity.numOfMeetings}</td>
                                <td>
                                    {activity.schedule.map((s, index) => (
                                        <div key={index}>
                                            {s.day}, {s.startDate}, {s.time}
                                        </div>
                                    ))}
                                </td>
                                <td>
                                    <button className={`${styles.button} ${styles.editButton}`}
                                            onClick={() => {
                                                setEditingActivity(activity);
                                                setIsModalOpen(true);
                                            }}>Edit
                                    </button>
                                    <button
                                        className={`${styles.button} ${styles.deleteButton}`}
                                        onClick={() => handleDeleteActivity(activity._id)}
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={9} className={styles.noData}>No activities available</td>
                        </tr>
                    )}
                    </tbody>
                </table>
            </div>
            {isModalOpen && (
                <CreateActivityModal
                    providerId={providerId}
                    onClose={() => {
                        setIsModalOpen(false);
                        setEditingActivity(null);
                    }}
                    onActivityAdded={handleActivityAdded}
                    editingActivity={editingActivity}
                />
            )}
        </div>
    );
};

export default ProviderPage;
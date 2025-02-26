import React from 'react';
import styles from "./ActivityPage.module.css";
import {useNavigate, useParams} from "react-router-dom";

interface Activity {
    id?: string;
    name: string;
    location: string;
    description: string;
    imageUrl: string;
    ageGroup: { min: number; max: number };
    numOfMeetings: number;
    price: number;
    schedule: { day: string; startDate: string; time: string }[];
    createdBy: string;
}

const ActivityPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    // Fetch activity details from the server or filter from state
    // For now, let's assume you have a list of activities
    const activities: Activity[] = [
        {
            id: '1',
            name: "Skiing",
            imageUrl: "/skiing.png",
            description: "Fun classes for kids to learn skiing skills.",
            location: "Lake Tahoe",
            ageGroup: {
                min: 10,
                max: 13
            },
            price: 200,
            numOfMeetings: 5,
            schedule:[{day: 'Thursday', startDate: '02-25-2025', time: '15.00 - 16.00'}],
            createdBy: "64c5f0bdf6eb123456789abc"
        },
        {
            id: '2',
            name: "Programming",
            imageUrl: "/programming.png",
            description: "Fun classes for kids to learn programming skills.",
            location: "Palo Alto Community Center",
            ageGroup: {
                min: 18,
                max: 100
            },
            price: 250,
            numOfMeetings: 5,
            schedule:[{day: 'Thursday', startDate: '02-25-2025', time: '15.00 - 16.00'}],
            createdBy: "64c5f0bdf6eb123456789abc"
        },
        {
            id: '3',
            name: "Hiking Club",
            imageUrl: "/hiking.png",
            description: "Fun family hiking across Bay Area.",
            location: "Park",
            ageGroup: {
                min: 8,
                max: 100
            },
            price: 30,
            numOfMeetings: 5,
            schedule:[{day: 'Thursday', startDate: '02-25-2025', time: '15.00 - 16.00'}],
            createdBy: "64c5f0bdf6eb123456789abc"
        },
        {
            id: '4',
            name: "String Orchestra",
            imageUrl: "/strings.png",
            description: "Fun string orchestra.",
            location: "Mountain View Community Center",
            ageGroup: {
                min: 8,
                max: 100
            },
            price: 200,
            numOfMeetings: 5,
            schedule:[{day: 'Thursday', startDate: '02-25-2025', time: '15.00 - 16.00'}],
            createdBy: "64c5f0bdf6eb123456789abc"
        }
    ];
    const activity = activities.find((act) => act.id === id);

    if (!activity) {
        return <h2>Activity not found</h2>;
    }
    const handleRegister = (session: { day: string; startDate: string; time: string  }) => {
        navigate('/booking', { state: { activity, session } });
    };
    return (
        <div className={styles.activityPage}>
            {/* Header Section */}
            <div className={styles.header}>
                <img src={activity.imageUrl} alt={activity.name} className={styles.image} />
                <h1 className={styles.title}>{activity.name}</h1>
            </div>

            {/* Details Section */}
            <div className={styles.details}>
                <p><strong>Location:</strong> {activity.location}</p>
                <p><strong>Description:</strong> {activity.description}</p>
                <p><strong>Age:</strong> {activity.ageGroup.min} - {activity.ageGroup.max}</p>
                <p><strong>Number of Meetings:</strong> {activity.numOfMeetings}</p>
                <p><strong>Price:</strong> {activity.price}</p>
            </div>

            {/* Schedule Table */}
            <table className={styles.scheduleTable}>
                <thead>
                <tr>
                    <th>Day</th>
                    <th>Start Date</th>
                    <th>Time</th>
                    <th></th>
                </tr>
                </thead>
                <tbody>
                {activity.schedule.map((session, index) => (
                    <tr key={index}>
                        <td>{session.day}</td>
                        <td>{session.startDate}</td>
                        <td>{session.time}</td>
                        <td><button className={styles.button} onClick={() => handleRegister(session)}>Register</button></td>

                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default ActivityPage;
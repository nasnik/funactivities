import styles from "./Activities.module.css";
import {useNavigate} from "react-router-dom";
import React from "react";
interface AgeGroup {
    min: number;
    max: number;
}

interface Activity {
    id?: string;
    imageUrl: string
    name: string;
    description: string;
    location: string;
    ageGroup: AgeGroup;
    price: number;
    createdBy: string;
}
interface ActivitiesProps {
    activities: Activity[];
}

const Activities: React.FC<ActivitiesProps> = ({ activities }) => {
    const navigate = useNavigate();

    return (
        <div className={styles.activityGrid}>
            {activities.map((activity) => (
                <div
                    key={activity.id}
                    className={styles.activityCard}
                    onClick={() => navigate(`/activities/${activity.id}`)}
                >
                    <img src={activity.imageUrl} alt={activity.name} className={styles.activityImage}/>
                    <div className={styles.activityContent}>
                    <h3 className={styles.activityTitle}>{activity.name}</h3>
                        <div className={styles.activityInfo}>
                            <div>📍 {activity.location}</div>
                            <div>👶 Age: {activity.ageGroup.min} - {activity.ageGroup.max}</div>
                            <span>💲 {activity.price}</span>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default Activities;

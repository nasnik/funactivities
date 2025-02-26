import React from 'react';
import {useLocation, useNavigate} from 'react-router-dom';
import styles from "./BookingPage.module.css";

const BookingPage: React.FC = () => {
    const location = useLocation();
    const { activity, session } = location.state || {};
    const navigate = useNavigate();

    const handleConfirm = () => {
        navigate("/success"); // Redirect to SuccessPage
    };
    if (!activity || !session) {
        return <h2>Invalid registration details.</h2>;
    }

    const totalPrice = activity.price; // Assuming 1 session = 1 price

    return (
        <div className={styles.registerPage}>
            <div className={styles.header}>
                <img src={activity.imageUrl} alt={activity.name} className={styles.image} />
                <h1 className={styles.title}>Register for {activity.name}</h1>
            </div>

            <div className={styles.details}>
                <p><strong>Location:</strong> {activity.location}</p>
                <p><strong>Day:</strong> {session.day}</p>
                <p><strong>Date:</strong> {session.startDate}</p>
                <p><strong>Time:</strong> {session.time}</p>
                <p><strong>Price:</strong> ${activity.price}</p>
                <p className={styles.total}><strong>Total Price:</strong> ${totalPrice}</p>
            </div>

            <button className={styles.registerButton} onClick={handleConfirm}>Confirm Registration</button>
        </div>
    );
};

export default BookingPage;

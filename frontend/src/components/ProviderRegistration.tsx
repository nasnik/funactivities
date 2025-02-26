import { useState } from "react";
import styles from "./ProviderRegistration.module.css";
import { useNavigate } from "react-router-dom";

const ProviderRegistration = () => {
    const [providerName, setProviderName] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [verifyPassword, setVerifyPassword] = useState("");
    const navigate = useNavigate();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
    };

    return (
        <div className={styles.container}>
            <button className={styles.homeButton} onClick={() => navigate("/")}>Home</button>
            <form className={styles.form} onSubmit={handleSubmit}>
                <h2 className={styles.title}>Provider Registration</h2>
                <input
                    type="text"
                    placeholder="Provider Name"
                    value={providerName}
                    onChange={(e) => setProviderName(e.target.value)}
                    className={styles.input}
                    required
                />
                <input
                    type="tel"
                    placeholder="Provider Phone Number"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className={styles.input}
                    required
                />
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={styles.input}
                    required
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={styles.input}
                    required
                />
                <input
                    type="password"
                    placeholder="Verify Password"
                    value={verifyPassword}
                    onChange={(e) => setVerifyPassword(e.target.value)}
                    className={styles.input}
                    required
                />
                <button type="submit" className={styles.button}>Register</button>
            </form>
        </div>
    );
};

export default ProviderRegistration;
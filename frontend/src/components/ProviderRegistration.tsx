import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import styles from "./ProviderRegistration.module.css";

const ProviderRegistration = () => {
    const [providerName, setProviderName] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [verifyPassword, setVerifyPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!providerName || !phoneNumber || !email || !password) {
            setError("All fields are required.");
            return;
        }
        setLoading(true);
        try {
            const response = await axios.post(
                "http://localhost:3000/api/v1/auth/register/provider",
                { providerName, phone: phoneNumber, email, password, verifyPassword },
                { withCredentials: true }
            );
            console.log("Registration successful:", response.data);
            navigate("/login");
        } catch (err: any) {
            console.error("Registration failed:", err.response?.data?.message || err.message);
            setError(err.response?.data?.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.container}>
            <button className={styles.homeButton} onClick={() => navigate("/")}>Home</button>
            <form className={styles.form} onSubmit={handleSubmit}>
                <h2 className={styles.title}>Provider Registration</h2>
                {error && <p className={styles.error}>{error}</p>}
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
                <button type="submit" className={styles.button} disabled={loading}>
                    {loading ? "Registering..." : "Register"}
                </button>
            </form>
        </div>
    );
};

export default ProviderRegistration;

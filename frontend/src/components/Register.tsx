import { useState } from "react";
import styles from "./Register.module.css";
import {useNavigate} from "react-router-dom";
import axios from "axios";
const baseUrl = import.meta.env.VITE_REACT_APP_BASE_URL;

const Register = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [verifyPassword, setVerifyPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name || !email || !password) {
            setError("All fields are required.");
            return;
        }
        setLoading(true);
        try {`${baseUrl}/auth/register/user`
            const response = await axios.post(
                `${baseUrl}/auth/register/user`,
                { name, email, password, verifyPassword }, {
                    headers: {"Content-Type": "application/json"},
                });
            console.log("Registration successful:", response.data);
            navigate("/login");
        } catch (err: any) {
            console.error("Registration failed:", err.response?.data?.message || err.message);
            setError(err.response?.data?.message || "Something went wrong");
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.container}>
            <button className={styles.homeButton} onClick={() => navigate("/")}>
                Home
            </button>
            <form className={styles.form} onSubmit={handleSubmit}>
                <h2 className={styles.title}>Register</h2>
                <input
                    type="text"
                    placeholder="Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
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

export default Register;
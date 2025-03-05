import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import styles from "./Login.module.css";

const Login = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleLogin = async () => {
        setError("");
        try {
            const response = await axios.post("http://localhost:3000/api/v1/auth/login", {
                email,
                password,
            });

            if (response.status === 200) {
                const { token, user } = response.data;
                const role = user?.role;

                if (!role) {
                    console.error("No role returned from API");
                    return;
                }

                localStorage.setItem("token", token);
                localStorage.setItem("role", role);

                if (role === "provider") {
                    const providerId = user?.providerId; // Ensure the API includes this
                    if (!providerId) {
                        console.error("No providerId returned for provider user");
                        return;
                    }
                    localStorage.setItem("providerId", providerId);
                    navigate(`/activities/provider/${providerId}`);
                } else {
                    navigate("/");
                }
            }
        } catch (error) {
            setError(error.response?.data?.msg || "Login failed");
        }
    };

    return (
        <div className={styles.container}>
            <button className={styles.homeButton} onClick={() => navigate("/")}>Home</button>
            <div className={styles.form}>
                <h2 className={styles.title}>Login</h2>
                {error && <p className={styles.error}>{error}</p>}
                <input
                    type="email"
                    placeholder="Email"
                    className={styles.input}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <input
                    type="password"
                    placeholder="Password"
                    className={styles.input}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <button className={styles.button} onClick={handleLogin}>Login</button>
            </div>
        </div>
    );
};

export default Login;
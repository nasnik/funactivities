import { useNavigate } from "react-router-dom";
import styles from "./Login.module.css";

const Login = () => {
    const navigate = useNavigate();

    return (
        <div className={styles.container}>
            <button className={styles.homeButton} onClick={() => navigate("/")}>
                Home
            </button>
            <div className={styles.form}>
                <h2 className={styles.title}>Login</h2>
                <input type="text" placeholder="Username" className={styles.input} />
                <input type="password" placeholder="Password" className={styles.input} />
                <button className={styles.button}>Login</button>
            </div>
        </div>
    );
};

export default Login;

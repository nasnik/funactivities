import styles from "./SuccessPage.module.css";

const SuccessPage = () => {
    return (
        <div className={styles.successPage}>
            <div className={styles.container}>
                <h2 className={styles.title}>You are registered!</h2>
                <p className={styles.message}>Thank you for your registration.</p>
            </div>
        </div>
    );
};

export default SuccessPage;

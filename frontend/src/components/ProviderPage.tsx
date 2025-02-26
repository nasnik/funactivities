import styles from "./ProviderPage.module.css";

const ProviderPage = () => {
    return (
        <div className={styles.container}>
            <button className={styles.logoffButton}>Log Off</button>
            <div className={styles.content}>
                <h2 className={styles.header}>Provider:</h2>
                <table className={styles.table}>
                    <thead>
                    <tr>
                        <th>Name</th>
                        <th>Description</th>
                        <th>Location</th>
                        <th>Price</th>
                        <th>Age Group</th>
                        <th>Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr>
                        <td>Example Activity</td>
                        <td>Fun and engaging activity</td>
                        <td>San Francisco, CA</td>
                        <td>$50</td>
                        <td>5-12 years</td>
                        <td>
                            <button className={`${styles.button} ${styles.editButton}`}>Edit</button>
                            <button className={`${styles.button} ${styles.deleteButton}`}>Delete</button>
                        </td>
                    </tr>
                    </tbody>
                </table>
                <button className={`${styles.button} ${styles.addButton}`}>Add Activity</button>
            </div>
        </div>
    );
};

export default ProviderPage;

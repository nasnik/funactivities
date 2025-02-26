import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Activities from "./Activities";
import styles from "./HomePage.module.css";

interface AgeGroup {
    min: number;
    max: number;
}

interface Activity {
    id?: string;
    imageUrl:string;
    name: string;
    description: string;
    location: string;
    ageGroup: AgeGroup;
    price: number;
    createdBy: string;
}
const HomePage: React.FC = () => {
    const [search, setSearch] = useState<string>("");
    const navigate = useNavigate();

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
            price: 50,
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
            price: 40,
            createdBy: "64c5f0bdf6eb123456789abc"
        }
    ];

    return (
        <div className={styles.landingPage}>
            <header className={styles.header}>
                <h1 className={styles.logo}>FunActivities</h1>
                <div className={styles.authButtons}>
                    <button className={`${styles.button} ${styles.signup}`} onClick={() => navigate("/provider-registration")}>Provider SignUp</button>
                    <button className={styles.button} onClick={() => navigate("/login")}>Login</button>
                    <button className={`${styles.button} ${styles.signup}`} onClick={() => navigate("/register")}>Sign Up</button>
                </div>
            </header>

            <main className={styles.main}>
                <h2 className={styles.title}>Find the Best Activities for You</h2>
                <div className={styles.searchBox}>
                    <input
                        type="text"
                        placeholder="Search for activities..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className={styles.input}
                    />
                    <select className={styles.filter}>
                        <option value="">All Categories</option>
                        <option value="sports">Sports</option>
                        <option value="arts">Arts</option>
                        <option value="education">Education</option>
                        <option value="outdoor">Outdoor</option>
                    </select>
                    <button className={styles.searchButton}>Search</button>
                </div>
            </main>
            <Activities activities={activities} />
        </div>
    );
};

export default HomePage;

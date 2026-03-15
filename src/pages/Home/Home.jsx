import { useNavigate } from "react-router-dom";
import styles from "./Home.module.css";
import heroImg from "../../assets/psyc-1.png";

const Home = () => {
  const navigate = useNavigate();

  return (
    <main className={styles.main}>
      <div className={`container ${styles.contentWrapper}`}>
        <div className={styles.leftSide}>
          <h1 className={styles.title}>
            The road to the <span className={styles.accent}>depths</span> of the
            human soul
          </h1>
          <p className={styles.description}>
            We help you to reveal your potential, overcome challenges and find a
            guide in your own life with the help of our experienced
            psychologists.
          </p>
          <button
            className={styles.getStartedBtn}
            onClick={() => navigate("/psychologists")}
          >
            Get started
            <svg
              width="18"
              height="18"
              viewBox="0 0 18 18"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M13.5 4.5L4.5 13.5M13.5 4.5H6.75M13.5 4.5V11.25"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>

        <div className={styles.rightSide}>
          <div className={styles.imageContainer}>
            <img src={heroImg} alt="Psychologist" className={styles.image} />

            <div className={styles.badge}>
              <div className={styles.checkIcon}>
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              </div>
              <div>
                <p className={styles.badgeText}>Experienced psychologists</p>
                <p className={styles.badgeNumber}>15,000</p>
              </div>
            </div>

            <div className={styles.questionTag}>?</div>
            <div className={styles.userTag}>
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                <circle cx="9" cy="7" r="4"></circle>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
              </svg>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Home;

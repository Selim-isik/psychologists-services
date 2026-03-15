import { useEffect, useState } from "react";
import { ref, onValue } from "firebase/database";
import { auth, db } from "../../services/firebase";
import PsychologistCard from "../../components/PsychologistCard/PsychologistCard";
import styles from "../Psychologists/Psychologists.module.css";

const Favorites = () => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = auth.currentUser;

  useEffect(() => {
    if (!user) return;

    const favRef = ref(db, `favorites/${user.uid}`);
    const unsubscribe = onValue(favRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const favArray = Object.keys(data).map((key) => ({
          id: key,
          ...data[key],
        }));
        setFavorites(favArray);
      } else {
        setFavorites([]);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  if (!user)
    return (
      <p className={styles.loadingText}>Please log in to see your favorites.</p>
    );

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <h2 className={styles.title} style={{ marginBottom: "40px" }}>
          Your Favorites
        </h2>
        <div className={styles.list}>
          {favorites.length > 0 ? (
            favorites.map((psych) => (
              <PsychologistCard key={psych.id} psychologist={psych} />
            ))
          ) : (
            <p className={styles.loadingText}>
              You haven't added any favorites yet.
            </p>
          )}
        </div>
      </div>
    </section>
  );
};

export default Favorites;

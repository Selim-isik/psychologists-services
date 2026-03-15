import { useState, useEffect } from "react";
import { ref, set, onValue, remove } from "firebase/database";
import { auth, db } from "../../services/firebase";
import toast from "react-hot-toast";
import AppointmentModal from "../Modal/AppointmentModal";
import styles from "./PsychologistCard.module.css";

const PsychologistCard = ({ psychologist }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isAppointmentOpen, setIsAppointmentOpen] = useState(false);
  const user = auth.currentUser;

  useEffect(() => {
    if (!user) return;
    const favRef = ref(db, `favorites/${user.uid}/${psychologist.id}`);
    const unsubscribe = onValue(favRef, (snapshot) => {
      setIsFavorite(snapshot.exists());
    });
    return () => unsubscribe();
  }, [user, psychologist.id]);

  const toggleFavorite = async () => {
    if (!user) {
      toast.error("Please log in to add favorites!", {
        style: {
          borderRadius: "12px",
          background: "#191A15",
          color: "#FBFBFB",
          fontFamily: "Inter, sans-serif",
        },
      });
      return;
    }
    const favRef = ref(db, `favorites/${user.uid}/${psychologist.id}`);
    if (isFavorite) {
      await remove(favRef);
      toast.success("Removed from favorites");
    } else {
      await set(favRef, psychologist);
      toast.success("Added to favorites");
    }
  };

  return (
    <div className={styles.card}>
      <div className={styles.avatarWrapper}>
        <div className={styles.avatarBorder}>
          <img
            src={psychologist.avatar_url}
            alt={psychologist.name}
            className={styles.avatarImg}
          />
          <div className={styles.onlineStatus}></div>
        </div>
      </div>

      <div className={styles.infoWrapper}>
        <div className={styles.headerRow}>
          <div className={styles.nameBlock}>
            <span className={styles.label}>Psychologist</span>
            <h2 className={styles.name}>{psychologist.name}</h2>
          </div>

          <div className={styles.statsBlock}>
            <div className={styles.rating}>
              ⭐ Rating: {psychologist.rating}
            </div>
            <div className={styles.statsDivider}></div>
            <div className={styles.price}>
              Price / 1 hour:{" "}
              <span className={styles.priceValue}>
                {psychologist.price_per_hour}$
              </span>
            </div>
            <button className={styles.heartBtn} onClick={toggleFavorite}>
              <svg
                width="26"
                height="26"
                viewBox="0 0 24 24"
                fill={isFavorite ? "#3470FF" : "none"}
                stroke={isFavorite ? "#3470FF" : "#191A15"}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l8.78-8.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
              </svg>
            </button>
          </div>
        </div>

        <div className={styles.tags}>
          <div className={styles.tag}>
            Experience: <span>{psychologist.experience}</span>
          </div>
          <div className={styles.tag}>
            License: <span>{psychologist.license}</span>
          </div>
          <div className={styles.tag}>
            Specialization: <span>{psychologist.specialization}</span>
          </div>
          <div className={styles.tag}>
            Initial_consultation:{" "}
            <span>{psychologist.initial_consultation}</span>
          </div>
        </div>

        <p className={styles.about}>{psychologist.about}</p>

        {!isExpanded && (
          <button
            className={styles.readMore}
            onClick={() => setIsExpanded(true)}
          >
            Read more
          </button>
        )}

        {isExpanded && (
          <div className={styles.reviewsSection}>
            {psychologist.reviews.map((review, index) => (
              <div key={index} className={styles.review}>
                <div className={styles.reviewUser}>
                  <div className={styles.reviewAvatar}>
                    {review.reviewer[0]}
                  </div>
                  <div>
                    <p className={styles.reviewerName}>{review.reviewer}</p>
                    <p className={styles.reviewerRating}>⭐ {review.rating}</p>
                  </div>
                </div>
                <p className={styles.reviewComment}>{review.comment}</p>
              </div>
            ))}
            <button
              className={styles.appointmentBtn}
              onClick={() => setIsAppointmentOpen(true)}
            >
              Make an appointment
            </button>
          </div>
        )}
      </div>

      <AppointmentModal
        isOpen={isAppointmentOpen}
        onClose={() => setIsAppointmentOpen(false)}
        psychologist={psychologist}
      />
    </div>
  );
};

export default PsychologistCard;

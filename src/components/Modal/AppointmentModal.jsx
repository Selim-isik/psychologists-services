import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import styles from "./Modal.module.css";

const schema = yup
  .object({
    name: yup.string().required("Name is required"),
    phone: yup.string().required("Phone number is required"),
    email: yup.string().email("Invalid email").required("Email is required"),
    comment: yup.string(),
  })
  .required();

const AppointmentModal = ({ isOpen, onClose, psychologist }) => {
  const [selectedTime, setSelectedTime] = useState("00:00");
  const [isTimeOpen, setIsTimeOpen] = useState(false);
  const times = ["09:00", "09:30", "10:00", "10:30", "11:00", "11:30"];

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => {
      window.removeEventListener("keydown", handleEsc);
      reset();
    };
  }, [onClose, reset]);

  const onSubmit = (data) => {
    console.log("Appointment Data:", {
      ...data,
      time: selectedTime,
      psychologistId: psychologist.id,
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className={styles.backdrop} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeBtn} onClick={onClose}>
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
            <path
              d="M24 8L8 24M8 8L24 24"
              stroke="#191A15"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>

        <h2 className={styles.title}>
          Make an appointment with a psychologist
        </h2>
        <p className={styles.text}>
          You are on the verge of changing your life for the better. Fill out
          the short form below to book your personal appointment.
        </p>

        <div className={styles.psychInfo}>
          <img
            src={psychologist.avatar_url}
            alt={psychologist.name}
            className={styles.miniAvatar}
          />
          <div>
            <p className={styles.miniLabel}>Your psychologist</p>
            <p className={styles.miniName}>{psychologist.name}</p>
          </div>
        </div>

        <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
          <div className={styles.inputGroup}>
            <input
              {...register("name")}
              placeholder="Name"
              className={styles.input}
            />
            {errors.name && (
              <span className={styles.error}>{errors.name.message}</span>
            )}
          </div>

          <div className={styles.row}>
            <div className={styles.inputGroup} style={{ flex: 1 }}>
              <input
                {...register("phone")}
                placeholder="+380"
                className={styles.inputSmall}
              />
              {errors.phone && (
                <span className={styles.error}>{errors.phone.message}</span>
              )}
            </div>

            <div className={styles.timeWrapper} style={{ flex: 1 }}>
              <div
                className={styles.inputSmall}
                onClick={() => setIsTimeOpen(!isTimeOpen)}
              >
                {selectedTime}
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <circle
                    cx="10"
                    cy="10"
                    r="8.33"
                    stroke="#191A15"
                    strokeWidth="1.5"
                  />
                  <path
                    d="M10 5V10L13.33 11.66"
                    stroke="#191A15"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
              {isTimeOpen && (
                <div className={styles.timeDropdown}>
                  {times.map((t) => (
                    <div
                      key={t}
                      className={`${styles.timeOption} ${selectedTime === t ? styles.activeTime : ""}`}
                      onClick={() => {
                        setSelectedTime(t);
                        setIsTimeOpen(false);
                      }}
                    >
                      {t}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className={styles.inputGroup}>
            <input
              {...register("email")}
              placeholder="Email"
              className={styles.input}
            />
            {errors.email && (
              <span className={styles.error}>{errors.email.message}</span>
            )}
          </div>

          <div className={styles.inputGroup}>
            <textarea
              {...register("comment")}
              placeholder="Comment"
              className={styles.textarea}
            />
          </div>

          <button type="submit" className={styles.submitBtn}>
            Send
          </button>
        </form>
      </div>
    </div>
  );
};

export default AppointmentModal;

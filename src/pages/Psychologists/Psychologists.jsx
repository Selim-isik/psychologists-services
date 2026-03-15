import { useEffect, useState, useMemo } from "react";
import {
  ref,
  query,
  get,
  limitToFirst,
  startAt,
  orderByKey,
} from "firebase/database";
import { db } from "../../services/firebase";
import PsychologistCard from "../../components/PsychologistCard/PsychologistCard";
import styles from "./Psychologists.module.css";

const Psychologists = () => {
  const [psychologists, setPsychologists] = useState([]);
  const [lastKey, setLastKey] = useState(null);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [filter, setFilter] = useState("A to Z");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const filterOptions = [
    "A to Z",
    "Z to A",
    "Less than 10$",
    "Greater than 10$",
    "Popular",
    "Not popular",
    "Show all",
  ];

  const fetchData = async (isFirstLoad = false) => {
    if (loading) return;
    setLoading(true);
    try {
      const dbRef = ref(db);
      let q;
      if (isFirstLoad) {
        q = query(dbRef, orderByKey(), limitToFirst(3));
      } else {
        q = query(dbRef, orderByKey(), startAt(lastKey), limitToFirst(4));
      }
      const snapshot = await get(q);
      if (snapshot.exists()) {
        const data = snapshot.val();
        let dataArray = Object.keys(data).map((key) => ({
          id: key,
          ...data[key],
        }));
        dataArray.sort((a, b) =>
          a.id.localeCompare(b.id, undefined, { numeric: true }),
        );
        if (!isFirstLoad) dataArray = dataArray.slice(1);
        if (dataArray.length === 0) {
          setHasMore(false);
        } else {
          setPsychologists((prev) =>
            isFirstLoad ? dataArray : [...prev, ...dataArray],
          );
          setLastKey(dataArray[dataArray.length - 1].id);
          if (dataArray.length < 3) setHasMore(false);
        }
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error(error);
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  };

  const sortedPsychologists = useMemo(() => {
    let result = [...psychologists];
    switch (filter) {
      case "A to Z":
        return result.sort((a, b) => a.name.localeCompare(b.name));
      case "Z to A":
        return result.sort((a, b) => b.name.localeCompare(a.name));
      case "Less than 10$":
        return result.sort((a, b) => a.price_per_hour - b.price_per_hour);
      case "Greater than 10$":
        return result.sort((a, b) => b.price_per_hour - a.price_per_hour);
      case "Popular":
        return result.sort((a, b) => b.rating - a.rating);
      case "Not popular":
        return result.sort((a, b) => a.rating - b.rating);
      default:
        return result;
    }
  }, [psychologists, filter]);

  useEffect(() => {
    fetchData(true);
  }, []);

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.filterWrapper}>
          <label className={styles.filterLabel}>Filters</label>
          <div
            className={styles.customDropdown}
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          >
            <div className={styles.selectedOption}>
              {filter}
              <svg
                className={`${styles.chevron} ${isDropdownOpen ? styles.chevronOpen : ""}`}
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
              >
                <path
                  d="M5 7.5L10 12.5L15 7.5"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            {isDropdownOpen && (
              <ul className={styles.optionsList}>
                {filterOptions.map((option) => (
                  <li
                    key={option}
                    className={`${styles.optionItem} ${filter === option ? styles.activeOption : ""}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      setFilter(option);
                      setIsDropdownOpen(false);
                    }}
                  >
                    {option}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
        <div className={styles.list}>
          {sortedPsychologists.map((psych) => (
            <PsychologistCard key={psych.id} psychologist={psych} />
          ))}
        </div>
        {loading && <div className={styles.loadingText}>Loading...</div>}
        {hasMore && !loading && (
          <button className={styles.loadMore} onClick={() => fetchData(false)}>
            Load more
          </button>
        )}
      </div>
    </section>
  );
};

export default Psychologists;

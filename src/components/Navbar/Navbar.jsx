import { useEffect, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "../../services/firebase";
import RegisterModal from "../Modal/RegisterModal";
import LoginModal from "../Modal/LoginModal";
import styles from "./Navbar.module.css";

const Navbar = () => {
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setIsMenuOpen(false);
      navigate("/");
    } catch (error) {
      console.error(error);
    }
  };

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  return (
    <>
      <nav className={styles.nav}>
        <div className={styles.headerContainer}>
          <Link to="/" className={styles.logo} onClick={closeMenu}>
            psychologists.<span className={styles.logoSpan}>services</span>
          </Link>

          <button className={styles.hamburger} onClick={toggleMenu}>
            <div
              className={`${styles.bar} ${isMenuOpen ? styles.bar1 : ""}`}
            ></div>
            <div
              className={`${styles.bar} ${isMenuOpen ? styles.bar2 : ""}`}
            ></div>
            <div
              className={`${styles.bar} ${isMenuOpen ? styles.bar3 : ""}`}
            ></div>
          </button>

          <div
            className={`${styles.menuWrapper} ${isMenuOpen ? styles.menuOpen : ""}`}
          >
            <div className={styles.links}>
              <NavLink
                to="/"
                className={({ isActive }) =>
                  isActive ? `${styles.link} ${styles.active}` : styles.link
                }
                onClick={closeMenu}
              >
                Home <span className={styles.dot}></span>
              </NavLink>
              <NavLink
                to="/psychologists"
                className={({ isActive }) =>
                  isActive ? `${styles.link} ${styles.active}` : styles.link
                }
                onClick={closeMenu}
              >
                Psychologists <span className={styles.dot}></span>
              </NavLink>
              {user && (
                <NavLink
                  to="/favorites"
                  className={({ isActive }) =>
                    isActive ? `${styles.link} ${styles.active}` : styles.link
                  }
                  onClick={closeMenu}
                >
                  Favorites <span className={styles.dot}></span>
                </NavLink>
              )}
            </div>

            <div className={styles.authSection}>
              {user ? (
                <div className={styles.userSection}>
                  <div className={styles.userInfo}>
                    <div className={styles.userIcon}>
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                        <circle cx="12" cy="7" r="4"></circle>
                      </svg>
                    </div>
                    <span className={styles.userName}>
                      {user.displayName || "User"}
                    </span>
                  </div>
                  <button className={styles.logoutBtn} onClick={handleLogout}>
                    Log Out
                  </button>
                </div>
              ) : (
                <div className={styles.authButtons}>
                  <button
                    className={styles.loginBtn}
                    onClick={() => {
                      setIsLoginOpen(true);
                      closeMenu();
                    }}
                  >
                    Log In
                  </button>
                  <button
                    className={styles.registerBtn}
                    onClick={() => {
                      setIsRegisterOpen(true);
                      closeMenu();
                    }}
                  >
                    Registration
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className={styles.divider}></div>
      </nav>

      <RegisterModal
        isOpen={isRegisterOpen}
        onClose={() => setIsRegisterOpen(false)}
      />
      <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
    </>
  );
};

export default Navbar;

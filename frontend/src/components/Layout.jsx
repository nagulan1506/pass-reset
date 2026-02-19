import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import styles from './Layout.module.css';

export function Layout({ children, title, subtitle }) {
  const { user, logout } = useAuth();
  const location = useLocation();
  const isAuthPage = ['/login', '/register', '/forgot-password', '/reset-password'].some(
    (p) => location.pathname === p
  );

  return (
    <div className={styles.wrapper}>
      <header className={styles.header}>
        <Link to="/" className={styles.logo}>
          SecureAuth
        </Link>
        <nav className={styles.nav}>
          {user ? (
            <>
              <span className={styles.userName}>{user.name}</span>
              <button type="button" onClick={logout} className={styles.btnOutline}>
                Sign out
              </button>
            </>
          ) : (
            <>
              {!isAuthPage && (
                <>
                  <Link to="/login" className={styles.link}>Sign in</Link>
                  <Link to="/register" className={styles.btnPrimary}>Sign up</Link>
                </>
              )}
            </>
          )}
        </nav>
      </header>

      <main className={styles.main}>
        {(title || subtitle) && (
          <div className={styles.pageHead}>
            {title && <h1 className={styles.title}>{title}</h1>}
            {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
          </div>
        )}
        {children}
      </main>

      <footer className={styles.footer}>
        <p>Password reset flow · MERN stack</p>
      </footer>
    </div>
  );
}

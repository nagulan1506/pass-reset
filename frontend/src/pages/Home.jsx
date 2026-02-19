import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Layout } from '../components/Layout';
import styles from './Home.module.css';

export function Home() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <Layout>
        <div className={styles.loading}>Loading…</div>
      </Layout>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <Layout title={`Hello, ${user.name}`} subtitle="You're signed in securely.">
      <div className={styles.card}>
        <p className={styles.email}>{user.email}</p>
        <p className={styles.hint}>Use the header to sign out or navigate to other pages.</p>
      </div>
    </Layout>
  );
}

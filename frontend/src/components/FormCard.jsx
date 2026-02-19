import styles from './FormCard.module.css';

export function FormCard({ children, className }) {
  return <div className={`${styles.card} ${className || ''}`}>{children}</div>;
}

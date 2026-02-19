import styles from './Button.module.css';

export function Button({ children, loading, disabled, variant = 'primary', type = 'button', ...props }) {
  return (
    <button
      type={type}
      className={`${styles.btn} ${styles[variant]}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <span className={styles.spinner} aria-hidden />
      ) : (
        children
      )}
    </button>
  );
}

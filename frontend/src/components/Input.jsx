import styles from './Input.module.css';

export function Input({ label, error, type = 'text', ...props }) {
  const id = props.id || props.name;
  return (
    <div className={styles.wrap}>
      {label && (
        <label htmlFor={id} className={styles.label}>
          {label}
        </label>
      )}
      <input
        id={id}
        type={type}
        className={`${styles.input} ${error ? styles.inputError : ''}`}
        autoComplete={type === 'password' ? 'current-password' : type === 'email' ? 'email' : undefined}
        {...props}
      />
      {error && <p className={styles.error}>{error}</p>}
    </div>
  );
}

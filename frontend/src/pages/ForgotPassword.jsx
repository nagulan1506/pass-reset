import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Layout } from '../components/Layout';
import { FormCard } from '../components/FormCard';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { api } from '../api';

export function ForgotPassword() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [sent, setSent] = useState(false);
  const [email, setEmail] = useState('');
  const [resetLink, setResetLink] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!email.trim()) {
      setError('Please enter your email');
      return;
    }
    setLoading(true);
    const res = await api.post('/api/auth/forgot-password', { email: email.trim() });
    setLoading(false);
    if (res.success) {
      setSent(true);
      if (res.resetLink) {
        setResetLink(res.resetLink);
      }
    } else {
      setError(res.message || 'Something went wrong');
    }
  };

  if (sent) {
    return (
      <Layout title="Check your email" subtitle="If an account exists, we sent a reset link.">
        <FormCard>
          <p className="formSuccess">
            If an account exists for <strong>{email}</strong>, you will receive a password reset link shortly.
            Check your spam folder if you don't see it.
          </p>
          {resetLink && (
            <div style={{ marginTop: '1rem', padding: '1rem', background: 'var(--bg-input)', borderRadius: '8px', border: '1px solid var(--border)' }}>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                {resetLink.includes('localhost') ? '🔧 Dev mode: ' : ''}Reset link:
              </p>
              <a href={resetLink} style={{ color: 'var(--accent)', wordBreak: 'break-all', fontSize: '0.85rem' }}>
                {resetLink}
              </a>
            </div>
          )}
          <Link to="/login" className="formBackLink">Back to sign in</Link>
        </FormCard>
      </Layout>
    );
  }

  return (
    <Layout title="Forgot password?" subtitle="Enter your email and we'll send a reset link.">
      <FormCard>
        <form onSubmit={handleSubmit}>
          {error && <p className="formError">{error}</p>}
          <Input
            label="Email"
            name="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            autoComplete="email"
          />
          <Button type="submit" loading={loading}>
            Send reset link
          </Button>
        </form>
        <p className="formFooter">
          Remember your password? <Link to="/login">Sign in</Link>
        </p>
      </FormCard>
    </Layout>
  );
}

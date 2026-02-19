import { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Layout } from '../components/Layout';
import { FormCard } from '../components/FormCard';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { api } from '../api';
import { useAuth } from '../context/AuthContext';

export function ResetPassword() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const navigate = useNavigate();
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');

  useEffect(() => {
    if (!token) setError('Invalid reset link. Please use the link from your email.');
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!token) return;
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    if (password !== confirm) {
      setError('Passwords do not match');
      return;
    }
    setLoading(true);
    const res = await api.post('/api/auth/reset-password', { token, password });
    setLoading(false);
    if (res.success) {
      setSuccess(true);
      login(res.token, res.user);
      setTimeout(() => navigate('/', { replace: true }), 1500);
    } else {
      setError(res.message || 'Reset failed. Link may have expired.');
    }
  };

  if (success) {
    return (
      <Layout title="Password updated" subtitle="Redirecting you…">
        <FormCard>
          <p className="formSuccess">Your password has been reset. You're now signed in.</p>
        </FormCard>
      </Layout>
    );
  }

  if (!token) {
    return (
      <Layout title="Invalid link" subtitle="This reset link is missing or invalid.">
        <FormCard>
          <p className="formError">Please request a new password reset from the sign-in page.</p>
          <Link to="/forgot-password" className="formBackLink">Request new link</Link>
        </FormCard>
      </Layout>
    );
  }

  return (
    <Layout title="Set new password" subtitle="Enter your new password below.">
      <FormCard>
        <form onSubmit={handleSubmit}>
          {error && <p className="formError">{error}</p>}
          <Input
            label="New password"
            name="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="At least 6 characters"
            autoComplete="new-password"
          />
          <Input
            label="Confirm password"
            name="confirm"
            type="password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            placeholder="Repeat password"
            autoComplete="new-password"
          />
          <Button type="submit" loading={loading}>
            Reset password
          </Button>
        </form>
        <p className="formFooter">
          <Link to="/login">Back to sign in</Link>
        </p>
      </FormCard>
    </Layout>
  );
}

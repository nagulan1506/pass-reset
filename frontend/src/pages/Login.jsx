import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Layout } from '../components/Layout';
import { FormCard } from '../components/FormCard';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { api } from '../api';
import { useAuth } from '../context/AuthContext';

export function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({ email: '', password: '' });

  const handleChange = (e) => {
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.email.trim() || !form.password) {
      setError('Please enter email and password');
      return;
    }
    setLoading(true);
    const res = await api.post('/api/auth/login', form);
    setLoading(false);
    if (res.success) {
      login(res.token, res.user);
      navigate('/', { replace: true });
    } else {
      setError(res.message || 'Login failed');
    }
  };

  return (
    <Layout title="Sign in" subtitle="Welcome back.">
      <FormCard>
        <form onSubmit={handleSubmit}>
          {error && <p className="formError">{error}</p>}
          <Input
            label="Email"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            placeholder="you@example.com"
            autoComplete="email"
          />
          <Input
            label="Password"
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Your password"
          />
          <div className="formLinkWrap">
            <Link to="/forgot-password">Forgot password?</Link>
          </div>
          <Button type="submit" loading={loading}>
            Sign in
          </Button>
        </form>
        <p className="formFooter">
          Don't have an account? <Link to="/register">Sign up</Link>
        </p>
      </FormCard>
    </Layout>
  );
}

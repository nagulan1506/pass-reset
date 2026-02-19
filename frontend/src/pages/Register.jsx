import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Layout } from '../components/Layout';
import { FormCard } from '../components/FormCard';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { api } from '../api';
import { useAuth } from '../context/AuthContext';

export function Register() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({ name: '', email: '', password: '' });

  const handleChange = (e) => {
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.name.trim() || !form.email.trim() || !form.password) {
      setError('Please fill all fields');
      return;
    }
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    setLoading(true);
    const res = await api.post('/api/auth/register', form);
    setLoading(false);
    if (res.success) {
      login(res.token, res.user);
      navigate('/', { replace: true });
    } else {
      setError(res.message || 'Registration failed');
    }
  };

  return (
    <Layout title="Create account" subtitle="Sign up to get started.">
      <FormCard>
        <form onSubmit={handleSubmit}>
          {error && <p className="formError">{error}</p>}
          <Input
            label="Name"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Your name"
            autoComplete="name"
          />
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
            placeholder="At least 6 characters"
          />
          <Button type="submit" loading={loading}>
            Sign up
          </Button>
        </form>
        <p className="formFooter">
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </FormCard>
    </Layout>
  );
}

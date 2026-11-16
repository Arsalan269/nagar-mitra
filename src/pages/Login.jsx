import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogIn, AlertTriangle } from 'lucide-react';
import useAuth from '../hooks/useAuth';
import { validateEmail } from '../utils/validators';

export default function Login() {
  const { signIn, user } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (user) { navigate('/dashboard', { replace: true }); return null; }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!validateEmail(form.email)) { setError('Please enter a valid email address.'); return; }
    if (!form.password) { setError('Please enter your password.'); return; }
    setLoading(true);
    const { error: err } = await signIn({ email: form.email, password: form.password });
    if (err) { setError(err); setLoading(false); }
    else navigate('/dashboard');
  };

  const s = {
    wrapper: { display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh', padding: 'var(--space-lg)' },
    card: {
      width: '100%', maxWidth: 420, background: 'var(--white)', borderRadius: 'var(--radius-xl)',
      boxShadow: 'var(--shadow-lg)', padding: 'var(--space-2xl)',
    },
    title: { fontSize: 'var(--font-size-2xl)', fontWeight: 700, color: 'var(--navy)', marginBottom: 'var(--space-xs)' },
    sub: { color: 'var(--text-muted)', fontSize: 'var(--font-size-sm)', marginBottom: 'var(--space-xl)' },
    footer: { textAlign: 'center', marginTop: 'var(--space-lg)', fontSize: 'var(--font-size-sm)', color: 'var(--text-muted)' },
  };

  return (
    <div className="page-container" style={s.wrapper}>
      <div style={s.card}>
        <h1 style={s.title}>Welcome Back</h1>
        <p style={s.sub}>Sign in to your Nagar Mitra account</p>
        {error && <div className="alert alert-error"><AlertTriangle size={16} /> {error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Email</label>
            <input type="email" className="form-input" value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })} placeholder="you@example.com" />
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <input type="password" className="form-input" value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })} placeholder="Your password" />
          </div>
          <button type="submit" className="btn btn-accent btn-block btn-lg" disabled={loading}>
            {loading ? 'Signing in...' : <><LogIn size={18} /> Sign In</>}
          </button>
        </form>
        <div style={s.footer}>
          <p>Don't have an account? <Link to="/register">Create one</Link></p>
          <p style={{ marginTop: 'var(--space-sm)' }}><Link to="/admin/login">Administrator Login</Link></p>
        </div>
      </div>
    </div>
  );
}

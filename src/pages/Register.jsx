import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserPlus, AlertTriangle, CheckCircle } from 'lucide-react';
import useAuth from '../hooks/useAuth';
import { validateEmail, validatePassword } from '../utils/validators';

export default function Register() {
  const { signUp, user } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ fullName: '', email: '', password: '', confirmPassword: '' });
  const [errors, setErrors] = useState({});
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  if (user && !success) { navigate('/dashboard', { replace: true }); return null; }

  const validate = () => {
    const errs = {};
    if (!form.fullName.trim()) errs.fullName = 'Full name is required.';
    if (!validateEmail(form.email)) errs.email = 'Please enter a valid email.';
    const pw = validatePassword(form.password);
    if (!pw.valid) errs.password = pw.message;
    if (form.password !== form.confirmPassword) errs.confirmPassword = 'Passwords do not match.';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!validate()) return;
    setLoading(true);
    const { error: err } = await signUp({ email: form.email, password: form.password, fullName: form.fullName });
    if (err) { setError(err); setLoading(false); }
    else setSuccess(true);
    setLoading(false);
  };

  const s = {
    wrapper: { display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh', padding: 'var(--space-lg)' },
    card: { width: '100%', maxWidth: 420, background: 'var(--white)', borderRadius: 'var(--radius-xl)', boxShadow: 'var(--shadow-lg)', padding: 'var(--space-2xl)' },
  };

  if (success) {
    return (
      <div className="page-container" style={s.wrapper}>
        <div style={{ ...s.card, textAlign: 'center' }}>
          <CheckCircle size={56} color="var(--success)" style={{ margin: '0 auto var(--space-md)' }} />
          <h2 style={{ color: 'var(--navy)', marginBottom: 'var(--space-sm)' }}>Registration Successful!</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: 'var(--space-lg)' }}>
            Please check your email to verify your account, then sign in.
          </p>
          <Link to="/login" className="btn btn-accent btn-lg">Go to Login</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container" style={s.wrapper}>
      <div style={s.card}>
        <h1 style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 700, color: 'var(--navy)', marginBottom: 'var(--space-xs)' }}>
          Create Your Account
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: 'var(--font-size-sm)', marginBottom: 'var(--space-xl)' }}>
          Join Nagar Mitra to report civic issues
        </p>
        {error && <div className="alert alert-error"><AlertTriangle size={16} /> {error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input className={`form-input ${errors.fullName ? 'error' : ''}`} value={form.fullName}
              onChange={e => setForm({ ...form, fullName: e.target.value })} placeholder="Your full name" />
            {errors.fullName && <p className="form-error">{errors.fullName}</p>}
          </div>
          <div className="form-group">
            <label className="form-label">Email</label>
            <input type="email" className={`form-input ${errors.email ? 'error' : ''}`} value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })} placeholder="you@example.com" />
            {errors.email && <p className="form-error">{errors.email}</p>}
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <input type="password" className={`form-input ${errors.password ? 'error' : ''}`} value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })} placeholder="Minimum 6 characters" />
            {errors.password && <p className="form-error">{errors.password}</p>}
          </div>
          <div className="form-group">
            <label className="form-label">Confirm Password</label>
            <input type="password" className={`form-input ${errors.confirmPassword ? 'error' : ''}`} value={form.confirmPassword}
              onChange={e => setForm({ ...form, confirmPassword: e.target.value })} placeholder="Re-enter your password" />
            {errors.confirmPassword && <p className="form-error">{errors.confirmPassword}</p>}
          </div>
          <button type="submit" className="btn btn-accent btn-block btn-lg" disabled={loading}>
            {loading ? 'Creating Account...' : <><UserPlus size={18} /> Create Account</>}
          </button>
        </form>
        <p style={{ textAlign: 'center', marginTop: 'var(--space-lg)', fontSize: 'var(--font-size-sm)', color: 'var(--text-muted)' }}>
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </div>
    </div>
  );
}

import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Shield, LogIn, AlertTriangle } from 'lucide-react';
import useAuth from '../hooks/useAuth';
import { validateEmail } from '../utils/validators';
import { isAdmin as checkAdmin } from '../services/authService';

export default function AdminLogin() {
  const { signIn, user, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (user && isAdmin) { navigate('/admin/dashboard', { replace: true }); return null; }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!validateEmail(form.email)) { setError('Please enter a valid email.'); return; }
    if (!form.password) { setError('Please enter your password.'); return; }
    setLoading(true);

    const { data, error: signInErr } = await signIn({ email: form.email, password: form.password });
    if (signInErr) { setError(signInErr); setLoading(false); return; }

    // Check admin role
    const userId = data?.user?.id || data?.session?.user?.id;
    if (userId) {
      const { data: isAdminUser } = await checkAdmin(userId);
      if (!isAdminUser) {
        setError('Unauthorized. This account does not have administrator privileges.');
        setLoading(false);
        return;
      }
    }
    navigate('/admin/dashboard');
  };

  return (
    <div className="page-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh', padding: 'var(--space-lg)' }}>
      <div style={{
        width: '100%', maxWidth: 420, background: 'var(--navy)', borderRadius: 'var(--radius-xl)',
        boxShadow: 'var(--shadow-xl)', padding: 'var(--space-2xl)', color: 'var(--white)',
      }}>
        <div style={{ textAlign: 'center', marginBottom: 'var(--space-xl)' }}>
          <div style={{
            width: 64, height: 64, borderRadius: '50%', background: 'rgba(15,157,138,0.2)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto var(--space-md)',
          }}>
            <Shield size={32} color="#0F9D8A" />
          </div>
          <h1 style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 700 }}>Administrator Login</h1>
          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 'var(--font-size-sm)' }}>Nagar Mitra Admin Panel</p>
        </div>

        {error && <div className="alert alert-error" style={{ background: 'rgba(239,68,68,0.15)', color: '#fca5a5', border: '1px solid rgba(239,68,68,0.3)' }}>
          <AlertTriangle size={16} /> {error}
        </div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" style={{ color: 'rgba(255,255,255,0.8)' }}>Email</label>
            <input type="email" className="form-input" style={{ background: 'rgba(255,255,255,0.1)', borderColor: 'rgba(255,255,255,0.2)', color: 'var(--white)' }}
              value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="admin@example.com" />
          </div>
          <div className="form-group">
            <label className="form-label" style={{ color: 'rgba(255,255,255,0.8)' }}>Password</label>
            <input type="password" className="form-input" style={{ background: 'rgba(255,255,255,0.1)', borderColor: 'rgba(255,255,255,0.2)', color: 'var(--white)' }}
              value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} placeholder="Your password" />
          </div>
          <button type="submit" className="btn btn-accent btn-block btn-lg" disabled={loading}>
            {loading ? 'Verifying...' : <><LogIn size={18} /> Sign In as Admin</>}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: 'var(--space-lg)', fontSize: 'var(--font-size-sm)', color: 'rgba(255,255,255,0.5)' }}>
          <Link to="/login" style={{ color: 'rgba(255,255,255,0.7)' }}>← Citizen Login</Link>
        </p>
      </div>
    </div>
  );
}

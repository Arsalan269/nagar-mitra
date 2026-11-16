import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search, FileText, Clock, CheckCircle, XCircle } from 'lucide-react';
import useAuth from '../hooks/useAuth';
import { getMyReports } from '../services/reportService';
import { isSupabaseConfigured } from '../services/supabase';
import ReportCard from '../components/reports/ReportCard';
import LoadingSpinner from '../components/common/LoadingSpinner';

export default function CitizenDashboard() {
  const { user, profile } = useAuth();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    document.title = 'Dashboard — Nagar Mitra';
    const fetch = async () => {
      if (!isSupabaseConfigured() || !user) { setLoading(false); return; }
      const { data, error: err } = await getMyReports(user.id);
      if (err) setError(err); else setReports(data || []);
      setLoading(false);
    };
    fetch();
  }, [user]);

  const counts = {
    total: reports.length,
    pending: reports.filter(r => r.status === 'submitted' || r.status === 'under_review').length,
    inProgress: reports.filter(r => r.status === 'in_progress').length,
    resolved: reports.filter(r => r.status === 'resolved').length,
  };

  const statCards = [
    { label: 'Total Reports', value: counts.total, icon: FileText, color: 'var(--secondary-blue)' },
    { label: 'Awaiting Review', value: counts.pending, icon: Clock, color: 'var(--warning)' },
    { label: 'In Progress', value: counts.inProgress, icon: Search, color: 'var(--status-in-progress)' },
    { label: 'Resolved', value: counts.resolved, icon: CheckCircle, color: 'var(--success)' },
  ];

  if (loading) return <LoadingSpinner fullPage />;

  return (
    <div className="page-container">
      <div className="container">
        <div style={{ marginBottom: 'var(--space-2xl)' }}>
          <h1 style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 700, color: 'var(--navy)' }}>
            Welcome, {profile?.full_name || 'Citizen'}
          </h1>
          <p style={{ color: 'var(--text-muted)' }}>Manage and track your civic issue reports</p>
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        <div className="grid grid-4" style={{ marginBottom: 'var(--space-2xl)' }}>
          {statCards.map((sc, i) => (
            <div key={i} className="card" style={{ textAlign: 'center' }}>
              <sc.icon size={24} color={sc.color} style={{ margin: '0 auto var(--space-sm)' }} />
              <div style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 800, color: 'var(--navy)' }}>{sc.value}</div>
              <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-muted)' }}>{sc.label}</div>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', gap: 'var(--space-md)', marginBottom: 'var(--space-2xl)', flexWrap: 'wrap' }}>
          <Link to="/report" className="btn btn-accent"><Plus size={18} /> Report New Issue</Link>
          <Link to="/track" className="btn btn-secondary"><Search size={18} /> Track Reports</Link>
        </div>

        <h2 style={{ fontSize: 'var(--font-size-xl)', fontWeight: 700, color: 'var(--navy)', marginBottom: 'var(--space-md)' }}>
          Your Recent Reports
        </h2>
        {reports.length === 0 ? (
          <div className="empty-state">
            <FileText size={48} />
            <h3>No Reports Yet</h3>
            <p>Submit your first civic issue report to get started.</p>
            <Link to="/report" className="btn btn-accent" style={{ marginTop: 'var(--space-md)' }}>
              <Plus size={18} /> Report an Issue
            </Link>
          </div>
        ) : (
          <div style={{ display: 'grid', gap: 'var(--space-md)' }}>
            {reports.slice(0, 10).map(r => <ReportCard key={r.id} report={r} />)}
          </div>
        )}
      </div>
    </div>
  );
}

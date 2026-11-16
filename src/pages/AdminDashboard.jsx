import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FileText, Clock, Search, CheckCircle, XCircle, BarChart3, MapPin, List } from 'lucide-react';
import useAuth from '../hooks/useAuth';
import { getAllReports } from '../services/reportService';
import { isSupabaseConfigured } from '../services/supabase';
import { CATEGORIES } from '../utils/constants';
import { getCategoryById } from '../utils/helpers';
import ReportsTable from '../components/admin/ReportsTable';
import StatusUpdateModal from '../components/admin/StatusUpdateModal';
import { updateReportStatus } from '../services/reportService';
import LoadingSpinner from '../components/common/LoadingSpinner';
import CategoryIcon from '../components/common/CategoryIcon';

export default function AdminDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalReport, setModalReport] = useState(null);

  const fetchReports = async () => {
    if (!isSupabaseConfigured()) { setLoading(false); return; }
    const { data } = await getAllReports();
    setReports(data || []);
    setLoading(false);
  };

  useEffect(() => {
    document.title = 'Admin Dashboard — Nagar Mitra';
    fetchReports();
  }, []);

  const statusCounts = {
    total: reports.length,
    submitted: reports.filter(r => r.status === 'submitted').length,
    under_review: reports.filter(r => r.status === 'under_review').length,
    in_progress: reports.filter(r => r.status === 'in_progress').length,
    resolved: reports.filter(r => r.status === 'resolved').length,
    rejected: reports.filter(r => r.status === 'rejected').length,
  };

  const catCounts = {};
  CATEGORIES.forEach(c => { catCounts[c.id] = reports.filter(r => r.category === c.id).length; });

  const statusCards = [
    { label: 'Total Reports', value: statusCounts.total, icon: FileText, color: 'var(--secondary-blue)' },
    { label: 'Submitted', value: statusCounts.submitted, icon: FileText, color: 'var(--status-submitted)' },
    { label: 'Under Review', value: statusCounts.under_review, icon: Clock, color: 'var(--status-under-review)' },
    { label: 'In Progress', value: statusCounts.in_progress, icon: Search, color: 'var(--status-in-progress)' },
    { label: 'Resolved', value: statusCounts.resolved, icon: CheckCircle, color: 'var(--status-resolved)' },
    { label: 'Rejected', value: statusCounts.rejected, icon: XCircle, color: 'var(--status-rejected)' },
  ];

  const handleUpdateStatus = async (reportId, newStatus, adminNote) => {
    await updateReportStatus(reportId, newStatus, adminNote, user.id);
    fetchReports();
  };

  if (loading) return <LoadingSpinner fullPage />;

  return (
    <div className="page-container">
      <div className="container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 'var(--space-md)', marginBottom: 'var(--space-2xl)' }}>
          <div>
            <h1 style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 700, color: 'var(--navy)' }}>Admin Dashboard</h1>
            <p style={{ color: 'var(--text-muted)' }}>Manage civic issue reports</p>
          </div>
          <div style={{ display: 'flex', gap: 'var(--space-sm)' }}>
            <Link to="/admin/reports" className="btn btn-primary"><List size={16} /> Manage Reports</Link>
            <Link to="/map" className="btn btn-secondary"><MapPin size={16} /> Map</Link>
            <Link to="/admin/analytics" className="btn btn-secondary"><BarChart3 size={16} /> Analytics</Link>
          </div>
        </div>

        {/* Status summary */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 'var(--space-md)', marginBottom: 'var(--space-2xl)' }}>
          {statusCards.map((sc, i) => (
            <div key={i} className="card" style={{ textAlign: 'center', padding: 'var(--space-lg)' }}>
              <sc.icon size={20} color={sc.color} style={{ margin: '0 auto var(--space-xs)' }} />
              <div style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 800, color: 'var(--navy)' }}>{sc.value}</div>
              <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-muted)' }}>{sc.label}</div>
            </div>
          ))}
        </div>

        {/* Category breakdown */}
        <h2 style={{ fontSize: 'var(--font-size-lg)', fontWeight: 700, color: 'var(--navy)', marginBottom: 'var(--space-md)' }}>
          By Category
        </h2>
        <div className="grid grid-5" style={{ marginBottom: 'var(--space-2xl)' }}>
          {CATEGORIES.map(c => (
            <div key={c.id} className="card" style={{ textAlign: 'center', borderTop: `3px solid ${c.color}` }}>
              <CategoryIcon categoryId={c.id} size={24} />
              <div style={{ fontSize: 'var(--font-size-xl)', fontWeight: 800, color: 'var(--navy)', margin: 'var(--space-xs) 0' }}>
                {catCounts[c.id]}
              </div>
              <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-muted)' }}>{c.name}</div>
            </div>
          ))}
        </div>

        {/* Recent reports */}
        <h2 style={{ fontSize: 'var(--font-size-lg)', fontWeight: 700, color: 'var(--navy)', marginBottom: 'var(--space-md)' }}>
          Recent Reports
        </h2>
        <ReportsTable
          reports={reports.slice(0, 10)}
          onViewReport={(r) => navigate(`/admin/reports/${r.id}`)}
          onUpdateStatus={(r) => setModalReport(r)}
        />

        <StatusUpdateModal
          report={modalReport}
          isOpen={!!modalReport}
          onClose={() => setModalReport(null)}
          onUpdate={handleUpdateStatus}
        />
      </div>
    </div>
  );
}

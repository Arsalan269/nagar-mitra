import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Filter, X } from 'lucide-react';
import useAuth from '../hooks/useAuth';
import { getAllReports, updateReportStatus } from '../services/reportService';
import { isSupabaseConfigured } from '../services/supabase';
import { CATEGORIES, STATUSES, SEVERITIES } from '../utils/constants';
import ReportsTable from '../components/admin/ReportsTable';
import StatusUpdateModal from '../components/admin/StatusUpdateModal';
import LoadingSpinner from '../components/common/LoadingSpinner';

export default function ReportManagement() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalReport, setModalReport] = useState(null);
  const [filters, setFilters] = useState({ category: '', status: '', severity: '', dateFrom: '', dateTo: '', search: '' });

  const fetchReports = async () => {
    if (!isSupabaseConfigured()) { setLoading(false); return; }
    setLoading(true);
    const activeFilters = {};
    Object.entries(filters).forEach(([k, v]) => { if (v) activeFilters[k] = v; });
    const { data } = await getAllReports(activeFilters);
    setReports(data || []);
    setLoading(false);
  };

  useEffect(() => {
    document.title = 'Report Management — Nagar Mitra';
    fetchReports();
  }, []);

  const applyFilters = (e) => { e.preventDefault(); fetchReports(); };
  const clearFilters = () => {
    setFilters({ category: '', status: '', severity: '', dateFrom: '', dateTo: '', search: '' });
    setTimeout(fetchReports, 0);
  };

  const handleUpdateStatus = async (reportId, newStatus, adminNote) => {
    await updateReportStatus(reportId, newStatus, adminNote, user.id);
    fetchReports();
  };

  return (
    <div className="page-container">
      <div className="container">
        <h1 style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 700, color: 'var(--navy)', marginBottom: 'var(--space-lg)' }}>
          Report Management
        </h1>

        {/* Filters */}
        <form onSubmit={applyFilters} className="card" style={{ marginBottom: 'var(--space-lg)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)', marginBottom: 'var(--space-md)' }}>
            <Filter size={18} color="var(--text-muted)" />
            <span style={{ fontWeight: 600 }}>Filters</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 'var(--space-md)' }}>
            <div>
              <label className="form-label">Category</label>
              <select className="form-select" value={filters.category} onChange={e => setFilters({ ...filters, category: e.target.value })}>
                <option value="">All</option>
                {CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div>
              <label className="form-label">Status</label>
              <select className="form-select" value={filters.status} onChange={e => setFilters({ ...filters, status: e.target.value })}>
                <option value="">All</option>
                {STATUSES.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
              </select>
            </div>
            <div>
              <label className="form-label">Severity</label>
              <select className="form-select" value={filters.severity} onChange={e => setFilters({ ...filters, severity: e.target.value })}>
                <option value="">All</option>
                {SEVERITIES.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
              </select>
            </div>
            <div>
              <label className="form-label">From</label>
              <input type="date" className="form-input" value={filters.dateFrom} onChange={e => setFilters({ ...filters, dateFrom: e.target.value })} />
            </div>
            <div>
              <label className="form-label">To</label>
              <input type="date" className="form-input" value={filters.dateTo} onChange={e => setFilters({ ...filters, dateTo: e.target.value })} />
            </div>
            <div>
              <label className="form-label">Search</label>
              <input className="form-input" placeholder="ID, title, locality..." value={filters.search} onChange={e => setFilters({ ...filters, search: e.target.value })} />
            </div>
          </div>
          <div style={{ display: 'flex', gap: 'var(--space-sm)', marginTop: 'var(--space-md)' }}>
            <button type="submit" className="btn btn-primary btn-sm">Apply Filters</button>
            <button type="button" className="btn btn-secondary btn-sm" onClick={clearFilters}><X size={14} /> Clear</button>
          </div>
        </form>

        <p style={{ color: 'var(--text-muted)', fontSize: 'var(--font-size-sm)', marginBottom: 'var(--space-md)' }}>
          Showing {reports.length} report{reports.length !== 1 ? 's' : ''}
        </p>

        {loading ? <LoadingSpinner /> : (
          <ReportsTable
            reports={reports}
            onViewReport={(r) => navigate(`/admin/reports/${r.id}`)}
            onUpdateStatus={(r) => setModalReport(r)}
          />
        )}

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

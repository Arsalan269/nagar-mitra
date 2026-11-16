import { useState, useEffect } from 'react';
import { Search, FileText } from 'lucide-react';
import useAuth from '../hooks/useAuth';
import { getMyReports, getReportByReferenceId } from '../services/reportService';
import { isSupabaseConfigured } from '../services/supabase';
import ReportCard from '../components/reports/ReportCard';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { CATEGORIES, STATUSES } from '../utils/constants';

export default function TrackReport() {
  const { user } = useAuth();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchId, setSearchId] = useState('');
  const [searchResult, setSearchResult] = useState(null);
  const [searchError, setSearchError] = useState('');
  const [searching, setSearching] = useState(false);
  const [filterCat, setFilterCat] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  useEffect(() => {
    document.title = 'Track Report — Nagar Mitra';
    if (user && isSupabaseConfigured()) {
      getMyReports(user.id).then(({ data }) => {
        setReports(data || []);
        setLoading(false);
      });
    } else {
      setLoading(false);
    }
  }, [user]);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchId.trim()) return;
    if (!isSupabaseConfigured()) { setSearchError('Database not configured.'); return; }
    setSearching(true);
    setSearchError('');
    setSearchResult(null);
    const { data, error } = await getReportByReferenceId(searchId.trim().toUpperCase());
    if (error || !data) setSearchError('Report not found. Please check the reference ID.');
    else setSearchResult(data);
    setSearching(false);
  };

  let filtered = reports;
  if (filterCat) filtered = filtered.filter(r => r.category === filterCat);
  if (filterStatus) filtered = filtered.filter(r => r.status === filterStatus);

  return (
    <div className="page-container">
      <div className="container" style={{ maxWidth: 800, margin: '0 auto' }}>
        <h1 style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 700, color: 'var(--navy)', marginBottom: 'var(--space-xl)' }}>
          Track Your Report
        </h1>

        {/* Search by ID */}
        <div className="card" style={{ marginBottom: 'var(--space-2xl)' }}>
          <h3 style={{ fontWeight: 600, marginBottom: 'var(--space-md)' }}>Search by Reference ID</h3>
          <form onSubmit={handleSearch} style={{ display: 'flex', gap: 'var(--space-sm)' }}>
            <input
              className="form-input"
              placeholder="e.g. NM-2026-0001"
              value={searchId}
              onChange={e => setSearchId(e.target.value)}
              style={{ flex: 1 }}
            />
            <button type="submit" className="btn btn-primary" disabled={searching}>
              {searching ? '...' : <><Search size={16} /> Search</>}
            </button>
          </form>
          {searchError && <p className="form-error" style={{ marginTop: 'var(--space-sm)' }}>{searchError}</p>}
          {searchResult && (
            <div style={{ marginTop: 'var(--space-md)' }}>
              <ReportCard report={searchResult} />
            </div>
          )}
        </div>

        {/* User's reports */}
        {user && (
          <>
            <div style={{ display: 'flex', gap: 'var(--space-sm)', flexWrap: 'wrap', marginBottom: 'var(--space-lg)', alignItems: 'center' }}>
              <h2 style={{ fontSize: 'var(--font-size-xl)', fontWeight: 700, color: 'var(--navy)', marginRight: 'auto' }}>
                Your Reports ({filtered.length})
              </h2>
              <select className="form-select" style={{ width: 'auto' }} value={filterCat} onChange={e => setFilterCat(e.target.value)}>
                <option value="">All Categories</option>
                {CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
              <select className="form-select" style={{ width: 'auto' }} value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
                <option value="">All Statuses</option>
                {STATUSES.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
              </select>
            </div>

            {loading ? <LoadingSpinner /> : filtered.length === 0 ? (
              <div className="empty-state">
                <FileText size={48} />
                <h3>No Reports Found</h3>
                <p>{reports.length > 0 ? 'No reports match the current filters.' : 'You haven\'t submitted any reports yet.'}</p>
              </div>
            ) : (
              <div style={{ display: 'grid', gap: 'var(--space-md)' }}>
                {filtered.map(r => <ReportCard key={r.id} report={r} />)}
              </div>
            )}
          </>
        )}

        {!user && (
          <div className="alert alert-info" style={{ marginTop: 'var(--space-md)' }}>
            <FileText size={18} />
            <span>Sign in to see all your submitted reports and track their progress.</span>
          </div>
        )}
      </div>
    </div>
  );
}

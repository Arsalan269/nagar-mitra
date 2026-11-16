import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Calendar, Tag } from 'lucide-react';
import useAuth from '../hooks/useAuth';
import { getReportById, getReportUpdates, getPhotoUrl, updateReportStatus } from '../services/reportService';
import { isSupabaseConfigured } from '../services/supabase';
import { getCategoryById, formatDateTime, getSeverityInfo } from '../utils/helpers';
import CategoryIcon from '../components/common/CategoryIcon';
import StatusBadge from '../components/common/StatusBadge';
import ReportTimeline from '../components/reports/ReportTimeline';
import StatusUpdateModal from '../components/admin/StatusUpdateModal';
import LoadingSpinner from '../components/common/LoadingSpinner';
import MapView from '../components/map/MapView';

export default function ReportDetails() {
  const { id } = useParams();
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [report, setReport] = useState(null);
  const [updates, setUpdates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);

  const fetchData = async () => {
    if (!isSupabaseConfigured()) { setError('Database not configured.'); setLoading(false); return; }
    const { data: r, error: rErr } = await getReportById(id);
    if (rErr || !r) { setError('Report not found.'); setLoading(false); return; }
    setReport(r);
    const { data: u } = await getReportUpdates(id);
    setUpdates(u || []);
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, [id]);
  useEffect(() => { if (report) document.title = `${report.reference_id} — Nagar Mitra`; }, [report]);

  const handleUpdateStatus = async (reportId, newStatus, adminNote) => {
    await updateReportStatus(reportId, newStatus, adminNote, user.id);
    fetchData();
  };

  if (loading) return <LoadingSpinner fullPage />;
  if (error) return (
    <div className="page-container">
      <div className="container" style={{ textAlign: 'center', padding: 'var(--space-3xl)' }}>
        <h2 style={{ color: 'var(--danger)', marginBottom: 'var(--space-md)' }}>{error}</h2>
        <button className="btn btn-primary" onClick={() => navigate(-1)}>Go Back</button>
      </div>
    </div>
  );

  const cat = getCategoryById(report.category);
  const sev = getSeverityInfo(report.severity);
  const photoUrl = report.photo_path ? getPhotoUrl(report.photo_path) : null;

  return (
    <div className="page-container">
      <div className="container" style={{ maxWidth: 800, margin: '0 auto' }}>
        <button className="btn btn-secondary btn-sm" onClick={() => navigate(-1)} style={{ marginBottom: 'var(--space-lg)' }}>
          <ArrowLeft size={16} /> Back
        </button>

        {/* Header */}
        <div className="card" style={{ marginBottom: 'var(--space-lg)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 'var(--space-sm)', marginBottom: 'var(--space-md)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)' }}>
              <CategoryIcon categoryId={report.category} size={24} />
              <span style={{ fontSize: 'var(--font-size-sm)', fontWeight: 700, color: 'var(--text-muted)' }}>{report.reference_id}</span>
            </div>
            <div style={{ display: 'flex', gap: 'var(--space-sm)', alignItems: 'center' }}>
              <StatusBadge status={report.status} />
              {isAdmin && (
                <button className="btn btn-sm btn-primary" onClick={() => setShowModal(true)}>Update Status</button>
              )}
            </div>
          </div>

          <h1 style={{ fontSize: 'var(--font-size-xl)', fontWeight: 700, color: 'var(--navy)', marginBottom: 'var(--space-sm)' }}>
            {report.title}
          </h1>

          <div style={{ display: 'flex', gap: 'var(--space-lg)', flexWrap: 'wrap', fontSize: 'var(--font-size-sm)', color: 'var(--text-muted)', marginBottom: 'var(--space-md)' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Tag size={14} /> {cat?.name}</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><MapPin size={14} /> {report.locality}</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Calendar size={14} /> {formatDateTime(report.created_at)}</span>
            {sev && <span className="badge" style={{ background: sev.color + '18', color: sev.color }}>{sev.label}</span>}
          </div>

          <div style={{ marginBottom: 'var(--space-md)' }}>
            <h3 style={{ fontSize: 'var(--font-size-sm)', fontWeight: 600, marginBottom: 'var(--space-xs)' }}>Issue Type</h3>
            <p style={{ color: 'var(--text-muted)' }}>{report.issue_type}</p>
          </div>

          <div>
            <h3 style={{ fontSize: 'var(--font-size-sm)', fontWeight: 600, marginBottom: 'var(--space-xs)' }}>Description</h3>
            <p style={{ color: 'var(--text)', lineHeight: 1.7 }}>{report.description}</p>
          </div>
        </div>

        {/* Photo */}
        {photoUrl && (
          <div className="card" style={{ marginBottom: 'var(--space-lg)' }}>
            <h3 style={{ fontSize: 'var(--font-size-sm)', fontWeight: 600, marginBottom: 'var(--space-sm)' }}>Photograph</h3>
            <img src={photoUrl} alt="Report photograph" style={{ width: '100%', borderRadius: 'var(--radius-md)', maxHeight: 400, objectFit: 'cover' }}
              onError={(e) => { e.target.style.display = 'none'; }} />
          </div>
        )}

        {/* Location */}
        {report.latitude && report.longitude && (
          <div className="card" style={{ marginBottom: 'var(--space-lg)' }}>
            <h3 style={{ fontSize: 'var(--font-size-sm)', fontWeight: 600, marginBottom: 'var(--space-sm)' }}>Location</h3>
            <MapView reports={[report]} height="250px" />
            <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-muted)', marginTop: 'var(--space-xs)' }}>
              Coordinates: {parseFloat(report.latitude).toFixed(5)}, {parseFloat(report.longitude).toFixed(5)}
            </p>
          </div>
        )}

        {/* Timeline */}
        <div className="card">
          <h3 style={{ fontSize: 'var(--font-size-sm)', fontWeight: 600, marginBottom: 'var(--space-md)' }}>Status History</h3>
          <ReportTimeline updates={updates} currentStatus={report.status} createdAt={report.created_at} />
        </div>

        <StatusUpdateModal
          report={report}
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          onUpdate={handleUpdateStatus}
        />
      </div>
    </div>
  );
}

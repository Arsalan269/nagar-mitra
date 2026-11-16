import { useNavigate } from 'react-router-dom';
import CategoryIcon from '../common/CategoryIcon';
import StatusBadge from '../common/StatusBadge';
import { getCategoryById, formatDate, getSeverityInfo } from '../../utils/helpers';
import { MapPin, Calendar } from 'lucide-react';

export default function ReportCard({ report }) {
  const navigate = useNavigate();
  const cat = getCategoryById(report.category);
  const sev = getSeverityInfo(report.severity);

  return (
    <div
      className="card card-clickable"
      style={{ borderLeft: `4px solid ${cat?.color || 'var(--border)'}`, cursor: 'pointer' }}
      onClick={() => navigate(`/report/${report.id}`)}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 'var(--space-sm)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)' }}>
          <CategoryIcon categoryId={report.category} size={20} />
          <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-muted)', fontWeight: 600 }}>
            {report.reference_id}
          </span>
        </div>
        <StatusBadge status={report.status} />
      </div>
      <h3 style={{ fontSize: 'var(--font-size-base)', fontWeight: 700, margin: 'var(--space-sm) 0 var(--space-xs)', color: 'var(--text)' }}>
        {report.title}
      </h3>
      <div style={{ display: 'flex', gap: 'var(--space-md)', flexWrap: 'wrap', fontSize: 'var(--font-size-xs)', color: 'var(--text-muted)' }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><MapPin size={12} /> {report.locality}</span>
        <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Calendar size={12} /> {formatDate(report.created_at)}</span>
        {sev && (
          <span className="badge" style={{ background: sev.color + '18', color: sev.color, fontSize: 'var(--font-size-xs)' }}>
            {sev.label}
          </span>
        )}
      </div>
    </div>
  );
}

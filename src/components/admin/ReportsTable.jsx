import { Eye, RefreshCw } from 'lucide-react';
import CategoryIcon from '../common/CategoryIcon';
import StatusBadge from '../common/StatusBadge';
import { getCategoryById, formatDate, getSeverityInfo } from '../../utils/helpers';

export default function ReportsTable({ reports = [], onViewReport, onUpdateStatus }) {
  if (reports.length === 0) {
    return (
      <div className="empty-state">
        <h3>No Reports Found</h3>
        <p>No reports match the current filters.</p>
      </div>
    );
  }

  return (
    <div className="table-wrapper">
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Category</th>
            <th>Title</th>
            <th>Locality</th>
            <th>Date</th>
            <th>Severity</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {reports.map(r => {
            const cat = getCategoryById(r.category);
            const sev = getSeverityInfo(r.severity);
            return (
              <tr key={r.id}>
                <td style={{ fontWeight: 600, fontSize: 'var(--font-size-xs)', whiteSpace: 'nowrap' }}>
                  {r.reference_id}
                </td>
                <td>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <CategoryIcon categoryId={r.category} size={16} />
                    <span style={{ fontSize: 'var(--font-size-xs)' }}>{cat?.name || r.category}</span>
                  </span>
                </td>
                <td style={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {r.title}
                </td>
                <td style={{ fontSize: 'var(--font-size-xs)' }}>{r.locality}</td>
                <td style={{ fontSize: 'var(--font-size-xs)', whiteSpace: 'nowrap' }}>{formatDate(r.created_at)}</td>
                <td>
                  {sev && (
                    <span className="badge" style={{ background: sev.color + '18', color: sev.color }}>
                      {sev.label}
                    </span>
                  )}
                </td>
                <td><StatusBadge status={r.status} /></td>
                <td>
                  <div style={{ display: 'flex', gap: 'var(--space-xs)' }}>
                    <button className="btn btn-sm btn-secondary" onClick={() => onViewReport?.(r)} title="View">
                      <Eye size={14} />
                    </button>
                    <button className="btn btn-sm btn-primary" onClick={() => onUpdateStatus?.(r)} title="Update Status">
                      <RefreshCw size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

import { formatDateTime, getStatusInfo } from '../../utils/helpers';
import { CheckCircle, Clock, FileText } from 'lucide-react';

export default function ReportTimeline({ updates = [], currentStatus, createdAt }) {
  const allEvents = [
    { status: 'submitted', label: 'Report Submitted', note: 'Your report has been recorded in the system.', date: createdAt },
    ...updates.map(u => ({
      status: u.new_status,
      label: `Status changed to ${getStatusInfo(u.new_status)?.label || u.new_status}`,
      note: u.admin_note || '',
      date: u.created_at,
    })),
  ];

  return (
    <div style={{ position: 'relative', paddingLeft: 28 }}>
      <div style={{
        position: 'absolute', left: 9, top: 8, bottom: 8, width: 2,
        background: 'var(--border)',
      }} />
      {allEvents.map((ev, i) => {
        const info = getStatusInfo(ev.status);
        const isLast = i === allEvents.length - 1;
        return (
          <div key={i} style={{ position: 'relative', paddingBottom: isLast ? 0 : 'var(--space-lg)' }}>
            <div style={{
              position: 'absolute', left: -28, top: 2,
              width: 20, height: 20, borderRadius: '50%',
              background: isLast ? (info?.color || 'var(--info)') : 'var(--white)',
              border: `2px solid ${info?.color || 'var(--info)'}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              {isLast && <CheckCircle size={12} color="var(--white)" />}
            </div>
            <div>
              <p style={{ fontWeight: 600, fontSize: 'var(--font-size-sm)', color: 'var(--text)' }}>
                {ev.label}
              </p>
              {ev.note && (
                <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-muted)', marginTop: 2 }}>
                  {ev.note}
                </p>
              )}
              <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-light)', marginTop: 2, display: 'flex', alignItems: 'center', gap: 4 }}>
                <Clock size={10} /> {formatDateTime(ev.date)}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

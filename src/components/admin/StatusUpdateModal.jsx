import { useState } from 'react';
import { X } from 'lucide-react';
import { STATUSES } from '../../utils/constants';
import StatusBadge from '../common/StatusBadge';

export default function StatusUpdateModal({ report, isOpen, onClose, onUpdate }) {
  const [newStatus, setNewStatus] = useState(report?.status || '');
  const [note, setNote] = useState('');
  const [saving, setSaving] = useState(false);

  if (!isOpen || !report) return null;

  const handleSave = async () => {
    if (!newStatus || newStatus === report.status) return;
    setSaving(true);
    await onUpdate(report.id, newStatus, note);
    setSaving(false);
    setNote('');
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Update Report Status</h2>
          <button className="modal-close" onClick={onClose}><X size={20} /></button>
        </div>
        <div style={{ marginBottom: 'var(--space-md)' }}>
          <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-muted)', marginBottom: 'var(--space-xs)' }}>
            Report: <strong>{report.reference_id}</strong>
          </p>
          <p style={{ fontSize: 'var(--font-size-sm)', marginBottom: 'var(--space-sm)' }}>
            Current Status: <StatusBadge status={report.status} />
          </p>
        </div>
        <div className="form-group">
          <label className="form-label">New Status</label>
          <select value={newStatus} onChange={e => setNewStatus(e.target.value)} className="form-select">
            {STATUSES.map(s => (
              <option key={s.id} value={s.id}>{s.label}</option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label className="form-label">Admin Note (optional)</label>
          <textarea value={note} onChange={e => setNote(e.target.value)} className="form-textarea" placeholder="Add a note about this status change..." rows={3} />
        </div>
        <div style={{ display: 'flex', gap: 'var(--space-sm)', justifyContent: 'flex-end' }}>
          <button className="btn btn-secondary" onClick={onClose} disabled={saving}>Cancel</button>
          <button className="btn btn-primary" onClick={handleSave} disabled={saving || newStatus === report.status}>
            {saving ? 'Saving...' : 'Update Status'}
          </button>
        </div>
      </div>
    </div>
  );
}

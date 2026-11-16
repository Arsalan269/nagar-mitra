import { getStatusInfo } from '../../utils/helpers';

export default function StatusBadge({ status }) {
  const info = getStatusInfo(status);
  if (!info) return <span className="badge">{status}</span>;

  return (
    <span
      className="badge"
      style={{
        background: info.color + '18',
        color: info.color,
        border: `1px solid ${info.color}30`,
      }}
    >
      <span style={{
        width: 6, height: 6, borderRadius: '50%',
        background: info.color, display: 'inline-block',
      }} />
      {info.label}
    </span>
  );
}

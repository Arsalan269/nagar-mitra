import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { KALYAN_CENTER, DEFAULT_ZOOM, CATEGORIES } from '../../utils/constants';
import { getCategoryById, formatDate, getStatusInfo } from '../../utils/helpers';
import StatusBadge from '../common/StatusBadge';

// Fix Leaflet default icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

function createCategoryIcon(categoryId) {
  const cat = getCategoryById(categoryId);
  const color = cat?.color || '#6B7280';
  return L.divIcon({
    className: '',
    html: `<div style="width:28px;height:28px;border-radius:50%;background:${color};border:3px solid white;box-shadow:0 2px 6px rgba(0,0,0,0.3);"></div>`,
    iconSize: [28, 28],
    iconAnchor: [14, 14],
    popupAnchor: [0, -16],
  });
}

export default function MapView({ reports = [], height = '500px', onMarkerClick, showFilters = false, filters, onFilterChange }) {
  return (
    <div>
      {showFilters && (
        <div style={{
          display: 'flex', gap: 'var(--space-sm)', flexWrap: 'wrap',
          marginBottom: 'var(--space-md)',
        }}>
          <button
            className={`btn btn-sm ${!filters?.category ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => onFilterChange?.({ ...filters, category: '' })}
          >All</button>
          {CATEGORIES.map(c => (
            <button
              key={c.id}
              className={`btn btn-sm ${filters?.category === c.id ? 'btn-primary' : 'btn-secondary'}`}
              style={filters?.category === c.id ? { background: c.color, borderColor: c.color } : {}}
              onClick={() => onFilterChange?.({ ...filters, category: c.id })}
            >{c.name}</button>
          ))}
        </div>
      )}
      <MapContainer
        center={[KALYAN_CENTER.lat, KALYAN_CENTER.lng]}
        zoom={DEFAULT_ZOOM}
        style={{ height, borderRadius: 'var(--radius-lg)', width: '100%' }}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {reports.filter(r => r.latitude && r.longitude).map(report => (
          <Marker
            key={report.id}
            position={[parseFloat(report.latitude), parseFloat(report.longitude)]}
            icon={createCategoryIcon(report.category)}
          >
            <Popup>
              <div style={{ minWidth: 180, fontFamily: 'var(--font-family)' }}>
                <p style={{ fontWeight: 700, fontSize: '0.75rem', color: '#64748B', marginBottom: 4 }}>
                  {report.reference_id}
                </p>
                <p style={{ fontWeight: 600, fontSize: '0.875rem', marginBottom: 4 }}>
                  {report.title || report.issue_type}
                </p>
                <p style={{ fontSize: '0.75rem', color: '#64748B', marginBottom: 4 }}>
                  {getCategoryById(report.category)?.name} · {report.locality}
                </p>
                <div style={{ marginBottom: 4 }}>
                  <StatusBadge status={report.status} />
                </div>
                <p style={{ fontSize: '0.7rem', color: '#94A3B8' }}>
                  {formatDate(report.created_at)}
                </p>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
      {showFilters && (
        <div style={{
          display: 'flex', gap: 'var(--space-md)', flexWrap: 'wrap',
          marginTop: 'var(--space-md)', fontSize: 'var(--font-size-xs)',
        }}>
          {CATEGORIES.map(c => (
            <span key={c.id} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <span style={{ width: 12, height: 12, borderRadius: '50%', background: c.color, display: 'inline-block' }} />
              {c.name}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

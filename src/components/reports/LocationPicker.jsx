import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import { Navigation } from 'lucide-react';
import L from 'leaflet';
import { KALYAN_CENTER, DEFAULT_ZOOM } from '../../utils/constants';

// Fix Leaflet default marker icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

function MapClickHandler({ onLocationSelect }) {
  useMapEvents({
    click(e) {
      onLocationSelect({ lat: e.latlng.lat, lng: e.latlng.lng });
    },
  });
  return null;
}

export default function LocationPicker({ onLocationSelect, initialLocation }) {
  const [position, setPosition] = useState(initialLocation || null);
  const [locating, setLocating] = useState(false);

  const handleSelect = (loc) => {
    setPosition(loc);
    onLocationSelect(loc);
  };

  const handleUseMyLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const loc = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        handleSelect(loc);
        setLocating(false);
      },
      () => {
        alert('Unable to access your location. Please select manually on the map.');
        setLocating(false);
      },
      { timeout: 10000 }
    );
  };

  return (
    <div>
      <div style={{ marginBottom: 'var(--space-sm)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-muted)' }}>
          Click on the map to select the issue location
        </span>
        <button
          type="button"
          onClick={handleUseMyLocation}
          disabled={locating}
          className="btn btn-sm btn-secondary"
          style={{ fontSize: 'var(--font-size-xs)' }}
        >
          <Navigation size={12} />
          {locating ? 'Locating...' : 'Use My Location'}
        </button>
      </div>
      <MapContainer
        center={[initialLocation?.lat || KALYAN_CENTER.lat, initialLocation?.lng || KALYAN_CENTER.lng]}
        zoom={DEFAULT_ZOOM}
        style={{ height: 300, borderRadius: 'var(--radius-lg)' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapClickHandler onLocationSelect={handleSelect} />
        {position && <Marker position={[position.lat, position.lng]} />}
      </MapContainer>
      {position && (
        <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-muted)', marginTop: 'var(--space-xs)' }}>
          Selected: {position.lat.toFixed(5)}, {position.lng.toFixed(5)}
        </p>
      )}
    </div>
  );
}

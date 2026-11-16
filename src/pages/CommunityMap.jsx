import { useState, useEffect } from 'react';
import MapView from '../components/map/MapView';
import { getPublicMapReports } from '../services/reportService';
import { isSupabaseConfigured } from '../services/supabase';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { MapPin } from 'lucide-react';

export default function CommunityMap() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ category: '', status: '' });

  useEffect(() => {
    document.title = 'Community Issue Map — Nagar Mitra';
  }, []);

  useEffect(() => {
    const fetch = async () => {
      if (!isSupabaseConfigured()) { setLoading(false); return; }
      setLoading(true);
      const queryFilters = {};
      if (filters.category) queryFilters.category = filters.category;
      if (filters.status) queryFilters.status = filters.status;
      const { data } = await getPublicMapReports(queryFilters);
      setReports(data || []);
      setLoading(false);
    };
    fetch();
  }, [filters]);

  return (
    <div className="page-container">
      <div className="container">
        <div style={{ marginBottom: 'var(--space-lg)' }}>
          <h1 style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 700, color: 'var(--navy)' }}>
            Community Issue Map
          </h1>
          <p style={{ color: 'var(--text-muted)' }}>
            View reported civic issues across Kalyan, Maharashtra · {reports.length} reports shown
          </p>
        </div>

        {!isSupabaseConfigured() ? (
          <div className="alert alert-info">
            <MapPin size={18} />
            <span>Connect Supabase to view community reports on the map.</span>
          </div>
        ) : loading ? (
          <LoadingSpinner message="Loading map data..." />
        ) : (
          <MapView
            reports={reports}
            height="calc(100vh - 240px)"
            showFilters={true}
            filters={filters}
            onFilterChange={setFilters}
          />
        )}
      </div>
    </div>
  );
}

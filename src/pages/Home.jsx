import { useState, useEffect } from 'react';
import HeroSection from '../components/home/HeroSection';
import CategoryCards from '../components/home/CategoryCards';
import HowItWorks from '../components/home/HowItWorks';
import StatsSection from '../components/home/StatsSection';
import MapView from '../components/map/MapView';
import { getPublicMapReports } from '../services/reportService';
import { isSupabaseConfigured } from '../services/supabase';
import { MapPin } from 'lucide-react';

export default function Home() {
  const [mapReports, setMapReports] = useState([]);
  const [mapLoading, setMapLoading] = useState(true);

  useEffect(() => {
    document.title = 'Nagar Mitra — Community Civic Issue Reporting';
    const fetchReports = async () => {
      if (!isSupabaseConfigured()) { setMapLoading(false); return; }
      const { data } = await getPublicMapReports();
      if (data) setMapReports(data);
      setMapLoading(false);
    };
    fetchReports();
  }, []);

  return (
    <div>
      <HeroSection />
      <CategoryCards />
      <HowItWorks />
      <StatsSection />

      {/* Map Preview */}
      <section className="section" style={{ background: 'var(--white)' }}>
        <div className="container">
          <h2 className="section-title">Community Issue Map</h2>
          <p className="section-subtitle">See reported civic issues across Kalyan</p>
          {!isSupabaseConfigured() ? (
            <div className="alert alert-info">
              <MapPin size={18} />
              <span>Connect Supabase to see reported issues on the map.</span>
            </div>
          ) : mapLoading ? (
            <p style={{ textAlign: 'center', color: 'var(--text-muted)' }}>Loading map...</p>
          ) : (
            <MapView reports={mapReports} height="400px" />
          )}
        </div>
      </section>
    </div>
  );
}

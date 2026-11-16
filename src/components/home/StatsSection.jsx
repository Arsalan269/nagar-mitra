import { useState, useEffect } from 'react';
import { FileText, CheckCircle, Layers, MapPin } from 'lucide-react';
import { isSupabaseConfigured } from '../../services/supabase';

export default function StatsSection() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      if (!isSupabaseConfigured()) {
        setLoading(false);
        return;
      }
      try {
        const { supabase } = await import(/* @vite-ignore */ '../../services/supabase');
        const { data, error } = await supabase.rpc('get_public_stats');
        if (!error && data) setStats(data);
      } catch { /* silent */ }
      setLoading(false);
    };
    fetchStats();
  }, []);

  const items = [
    { icon: FileText, label: 'Total Reports', value: stats?.total_reports ?? '—' },
    { icon: CheckCircle, label: 'Resolved', value: stats?.resolved_reports ?? '—' },
    { icon: Layers, label: 'Categories', value: stats?.categories_used ?? '—' },
    { icon: MapPin, label: 'Areas Covered', value: stats?.areas_covered ?? '—' },
  ];

  return (
    <section className="section">
      <div className="container">
        <h2 className="section-title">Platform Statistics</h2>
        <p className="section-subtitle">Real data from community reports</p>
        {loading ? (
          <p style={{ textAlign: 'center', color: 'var(--text-muted)' }}>Loading statistics...</p>
        ) : (
          <div className="grid grid-4">
            {items.map((item, i) => (
              <div key={i} className="card" style={{ textAlign: 'center', padding: 'var(--space-xl)' }}>
                <item.icon size={32} color="var(--teal)" style={{ margin: '0 auto var(--space-sm)' }} />
                <div style={{ fontSize: 'var(--font-size-3xl)', fontWeight: 800, color: 'var(--navy)' }}>
                  {item.value}
                </div>
                <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-muted)', marginTop: 'var(--space-xs)' }}>
                  {item.label}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

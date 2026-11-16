import { useState, useEffect } from 'react';
import {
  Chart as ChartJS, CategoryScale, LinearScale, BarElement, PointElement,
  LineElement, ArcElement, Title, Tooltip, Legend, Filler
} from 'chart.js';
import { Doughnut, Bar, Line } from 'react-chartjs-2';
import { getReportStats, getCategoryStats, getSeverityStats, getTimelineStats, getTopLocalities, getHotspots } from '../services/analyticsService';
import { isSupabaseConfigured } from '../services/supabase';
import { CATEGORIES, STATUSES, SEVERITIES } from '../utils/constants';
import LoadingSpinner from '../components/common/LoadingSpinner';
import MapView from '../components/map/MapView';
import { BarChart3, TrendingUp, MapPin, AlertTriangle } from 'lucide-react';

ChartJS.register(CategoryScale, LinearScale, BarElement, PointElement, LineElement, ArcElement, Title, Tooltip, Legend, Filler);

export default function Analytics() {
  const [stats, setStats] = useState(null);
  const [catStats, setCatStats] = useState(null);
  const [sevStats, setSevStats] = useState(null);
  const [timeline, setTimeline] = useState(null);
  const [topLocalities, setTopLocalities] = useState(null);
  const [hotspots, setHotspots] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = 'Analytics — Nagar Mitra';
    const fetchAll = async () => {
      if (!isSupabaseConfigured()) { setLoading(false); return; }
      const [s, c, sv, t, l, h] = await Promise.all([
        getReportStats(), getCategoryStats(), getSeverityStats(),
        getTimelineStats(30), getTopLocalities(10), getHotspots(),
      ]);
      setStats(s.data);
      setCatStats(c.data);
      setSevStats(sv.data);
      setTimeline(t.data);
      setTopLocalities(l.data);
      setHotspots(h.data || []);
      setLoading(false);
    };
    fetchAll();
  }, []);

  if (loading) return <LoadingSpinner fullPage />;
  if (!isSupabaseConfigured()) return (
    <div className="page-container"><div className="container"><div className="alert alert-info">Connect Supabase to view analytics.</div></div></div>
  );

  const chartOptions = { responsive: true, maintainAspectRatio: true, plugins: { legend: { position: 'bottom', labels: { font: { family: 'Inter' } } } } };

  const categoryChartData = {
    labels: CATEGORIES.map(c => c.name),
    datasets: [{
      data: CATEGORIES.map(c => catStats?.[c.id] || 0),
      backgroundColor: CATEGORIES.map(c => c.color),
      borderWidth: 0,
    }],
  };

  const statusChartData = {
    labels: STATUSES.map(s => s.label),
    datasets: [{
      data: STATUSES.map(s => stats?.[s.id] || 0),
      backgroundColor: STATUSES.map(s => s.color),
      borderWidth: 0,
    }],
  };

  const severityChartData = {
    labels: SEVERITIES.map(s => s.label),
    datasets: [{
      label: 'Reports',
      data: SEVERITIES.map(s => sevStats?.[s.id] || 0),
      backgroundColor: SEVERITIES.map(s => s.color + '80'),
      borderColor: SEVERITIES.map(s => s.color),
      borderWidth: 2,
    }],
  };

  const timelineChartData = timeline ? {
    labels: timeline.map(t => t.date.substring(5)),
    datasets: [{
      label: 'Reports',
      data: timeline.map(t => t.count),
      borderColor: '#2563EB',
      backgroundColor: 'rgba(37,99,235,0.1)',
      fill: true,
      tension: 0.3,
      pointRadius: 2,
    }],
  } : null;

  const localityChartData = topLocalities ? {
    labels: topLocalities.map(l => l.locality),
    datasets: [{
      label: 'Reports',
      data: topLocalities.map(l => l.count),
      backgroundColor: '#0F9D8A80',
      borderColor: '#0F9D8A',
      borderWidth: 2,
    }],
  } : null;

  const cardStyle = { background: 'var(--white)', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-sm)', border: '1px solid var(--border-light)', padding: 'var(--space-xl)' };

  return (
    <div className="page-container">
      <div className="container">
        <h1 style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 700, color: 'var(--navy)', marginBottom: 'var(--space-sm)' }}>
          <BarChart3 size={24} style={{ verticalAlign: 'middle', marginRight: 8 }} /> Analytics & Hotspots
        </h1>
        <p style={{ color: 'var(--text-muted)', marginBottom: 'var(--space-2xl)' }}>
          Data insights from community reports
        </p>

        {/* Summary */}
        <div className="grid grid-4" style={{ marginBottom: 'var(--space-2xl)' }}>
          {[
            { label: 'Total', value: stats?.total || 0 },
            { label: 'Resolved', value: stats?.resolved || 0 },
            { label: 'In Progress', value: stats?.in_progress || 0 },
            { label: 'Pending', value: (stats?.submitted || 0) + (stats?.under_review || 0) },
          ].map((s, i) => (
            <div key={i} style={{ ...cardStyle, textAlign: 'center' }}>
              <div style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 800, color: 'var(--navy)' }}>{s.value}</div>
              <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-muted)' }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Charts */}
        <div className="grid grid-2" style={{ marginBottom: 'var(--space-2xl)' }}>
          <div style={cardStyle}>
            <h3 style={{ fontWeight: 600, marginBottom: 'var(--space-md)' }}>Reports by Category</h3>
            {stats?.total > 0 ? <Doughnut data={categoryChartData} options={chartOptions} /> : <p style={{ color: 'var(--text-muted)', textAlign: 'center' }}>No data yet</p>}
          </div>
          <div style={cardStyle}>
            <h3 style={{ fontWeight: 600, marginBottom: 'var(--space-md)' }}>Reports by Status</h3>
            {stats?.total > 0 ? <Doughnut data={statusChartData} options={chartOptions} /> : <p style={{ color: 'var(--text-muted)', textAlign: 'center' }}>No data yet</p>}
          </div>
        </div>

        <div className="grid grid-2" style={{ marginBottom: 'var(--space-2xl)' }}>
          <div style={cardStyle}>
            <h3 style={{ fontWeight: 600, marginBottom: 'var(--space-md)' }}>Severity Distribution</h3>
            {stats?.total > 0 ? <Bar data={severityChartData} options={{ ...chartOptions, indexAxis: 'x' }} /> : <p style={{ color: 'var(--text-muted)', textAlign: 'center' }}>No data yet</p>}
          </div>
          <div style={cardStyle}>
            <h3 style={{ fontWeight: 600, marginBottom: 'var(--space-md)' }}>Reports Over Time (30 days)</h3>
            {timelineChartData ? <Line data={timelineChartData} options={chartOptions} /> : <p style={{ color: 'var(--text-muted)', textAlign: 'center' }}>No data yet</p>}
          </div>
        </div>

        {localityChartData && topLocalities?.length > 0 && (
          <div style={{ ...cardStyle, marginBottom: 'var(--space-2xl)' }}>
            <h3 style={{ fontWeight: 600, marginBottom: 'var(--space-md)' }}>Top Reported Localities</h3>
            <Bar data={localityChartData} options={{ ...chartOptions, indexAxis: 'y' }} />
          </div>
        )}

        {/* Hotspots */}
        <div style={cardStyle}>
          <h3 style={{ fontWeight: 600, marginBottom: 'var(--space-sm)', display: 'flex', alignItems: 'center', gap: 8 }}>
            <AlertTriangle size={20} color="var(--warning)" /> Report Hotspots
          </h3>
          <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-muted)', marginBottom: 'var(--space-md)' }}>
            Areas with 3 or more reports in the same zone (~200m radius). Based on submitted reports, not officially verified.
          </p>
          {hotspots.length === 0 ? (
            <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: 'var(--space-xl)' }}>
              No hotspot clusters detected yet. Hotspots appear when 3+ reports are made in the same area.
            </p>
          ) : (
            <>
              <div style={{ display: 'grid', gap: 'var(--space-sm)', marginBottom: 'var(--space-md)' }}>
                {hotspots.map((h, i) => (
                  <div key={i} style={{
                    padding: 'var(--space-sm) var(--space-md)', background: 'var(--bg)',
                    borderRadius: 'var(--radius-md)', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  }}>
                    <span style={{ fontSize: 'var(--font-size-sm)' }}>
                      <MapPin size={14} style={{ verticalAlign: 'middle', marginRight: 4 }} />
                      Area near {h.latitude.toFixed(4)}°N, {h.longitude.toFixed(4)}°E
                    </span>
                    <span className="badge" style={{ background: 'var(--danger)', color: 'var(--white)' }}>
                      {h.count} reports
                    </span>
                  </div>
                ))}
              </div>
              <MapView
                reports={hotspots.flatMap(h => h.reports)}
                height="350px"
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
}

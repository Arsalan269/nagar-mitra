import { useEffect } from 'react';
import { Shield, Droplets, Trash2, Construction, Zap, Waves, Users, Target, Eye } from 'lucide-react';
import { CATEGORIES } from '../utils/constants';
import CategoryIcon from '../components/common/CategoryIcon';

export default function About() {
  useEffect(() => { document.title = 'About — Nagar Mitra'; }, []);

  const s = {
    section: { marginBottom: 'var(--space-2xl)' },
    h2: { fontSize: 'var(--font-size-xl)', fontWeight: 700, color: 'var(--navy)', marginBottom: 'var(--space-md)' },
    p: { color: 'var(--text-muted)', lineHeight: 1.8, marginBottom: 'var(--space-md)' },
  };

  return (
    <div className="page-container">
      <div className="container" style={{ maxWidth: 800, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 'var(--space-2xl)' }}>
          <Shield size={48} color="var(--teal)" style={{ margin: '0 auto var(--space-md)' }} />
          <h1 style={{ fontSize: 'var(--font-size-3xl)', fontWeight: 800, color: 'var(--navy)' }}>About Nagar Mitra</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: 'var(--font-size-lg)' }}>Your City. Your Voice. A Better Tomorrow.</p>
        </div>

        <div style={s.section}>
          <h2 style={s.h2}>What is Nagar Mitra?</h2>
          <p style={s.p}>
            Nagar Mitra is a community civic issue reporting platform designed for the residents of Kalyan, Maharashtra.
            It provides a centralized digital platform where citizens can report civic problems such as water supply issues,
            waste management concerns, road damage, electricity problems, and drainage issues.
          </p>
        </div>

        <div style={s.section}>
          <h2 style={s.h2}><Target size={20} style={{ verticalAlign: 'middle', marginRight: 8 }} />Our Mission</h2>
          <p style={s.p}>
            To improve visibility, organization, and tracking of community-reported civic problems. By creating a
            structured way for citizens to report and monitor issues, Nagar Mitra aims to empower communities and
            encourage civic engagement.
          </p>
        </div>

        <div style={s.section}>
          <h2 style={s.h2}>The Five Categories</h2>
          <div style={{ display: 'grid', gap: 'var(--space-md)' }}>
            {CATEGORIES.map(cat => (
              <div key={cat.id} className="card" style={{ display: 'flex', gap: 'var(--space-md)', alignItems: 'center', borderLeft: `4px solid ${cat.color}` }}>
                <CategoryIcon categoryId={cat.id} size={32} />
                <div>
                  <h3 style={{ fontWeight: 700, marginBottom: 2 }}>{cat.name}</h3>
                  <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-muted)' }}>{cat.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={s.section}>
          <h2 style={s.h2}>Technology Stack</h2>
          <div className="grid grid-3" style={{ gap: 'var(--space-sm)' }}>
            {['React', 'Vite', 'Supabase', 'PostgreSQL', 'Leaflet', 'OpenStreetMap', 'Chart.js', 'Lucide Icons', 'Vercel'].map(t => (
              <div key={t} className="card" style={{ textAlign: 'center', padding: 'var(--space-md)', fontSize: 'var(--font-size-sm)', fontWeight: 600 }}>
                {t}
              </div>
            ))}
          </div>
        </div>

        <div style={{ ...s.section, background: 'var(--warning-bg)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-xl)', border: '1px solid #fde68a' }}>
          <h2 style={{ ...s.h2, color: '#92400e' }}>⚠️ Important Disclaimer</h2>
          <p style={{ ...s.p, color: '#92400e' }}>
            This is an <strong>independent student-developed prototype</strong> created as a Class 12 Computer Science
            exhibition project. It is <strong>NOT officially connected</strong> to KDMC (Kalyan-Dombivli Municipal
            Corporation) or any government department.
          </p>
          <p style={{ ...s.p, color: '#92400e', marginBottom: 0 }}>
            Submitting a report through this platform <strong>does not guarantee</strong> that the municipal
            corporation will take action on the issue.
          </p>
        </div>

        <div style={s.section}>
          <h2 style={s.h2}>Project Information</h2>
          <p style={s.p}>
            <strong>Project:</strong> Class 12 Computer Science Exhibition<br />
            <strong>Location Focus:</strong> Kalyan, Maharashtra, India<br />
            <strong>Category:</strong> Community Civic Issue Reporting & Analytics System
          </p>
        </div>
      </div>
    </div>
  );
}

import { Link } from 'react-router-dom';
import { Shield } from 'lucide-react';

export default function Footer() {
  const year = new Date().getFullYear();

  const s = {
    footer: {
      background: 'var(--navy)', color: 'rgba(255,255,255,0.8)', padding: 'var(--space-3xl) 0 var(--space-lg)',
      marginTop: 'var(--space-3xl)',
    },
    inner: {
      maxWidth: 'var(--max-width)', margin: '0 auto', padding: '0 var(--space-lg)',
    },
    grid: {
      display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--space-2xl)',
    },
    heading: {
      color: 'var(--white)', fontWeight: 700, fontSize: 'var(--font-size-lg)',
      marginBottom: 'var(--space-md)',
    },
    logo: {
      display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--white)',
      fontWeight: 700, fontSize: 'var(--font-size-xl)', marginBottom: 'var(--space-sm)',
    },
    link: {
      color: 'rgba(255,255,255,0.7)', textDecoration: 'none', display: 'block',
      marginBottom: 'var(--space-sm)', fontSize: 'var(--font-size-sm)',
    },
    desc: { fontSize: 'var(--font-size-sm)', lineHeight: 1.7 },
    divider: {
      borderTop: '1px solid rgba(255,255,255,0.15)', marginTop: 'var(--space-2xl)',
      paddingTop: 'var(--space-lg)',
    },
    disclaimer: {
      fontSize: 'var(--font-size-xs)', color: 'rgba(255,255,255,0.5)',
      maxWidth: '700px', lineHeight: 1.6, marginBottom: 'var(--space-md)',
    },
    copy: { fontSize: 'var(--font-size-xs)', color: 'rgba(255,255,255,0.4)' },
  };

  return (
    <footer style={s.footer}>
      <div style={s.inner}>
        <div style={s.grid} className="footer-grid">
          <div>
            <div style={s.logo}><Shield size={20} /> Nagar Mitra</div>
            <p style={s.desc}>Your City. Your Voice. A Better Tomorrow.</p>
            <p style={{ ...s.desc, marginTop: 'var(--space-sm)' }}>
              A community civic issue reporting platform for Kalyan, Maharashtra.
            </p>
          </div>
          <div>
            <h4 style={s.heading}>Quick Links</h4>
            <Link to="/" style={s.link}>Home</Link>
            <Link to="/report" style={s.link}>Report an Issue</Link>
            <Link to="/track" style={s.link}>Track Report</Link>
            <Link to="/map" style={s.link}>Community Map</Link>
            <Link to="/about" style={s.link}>About</Link>
          </div>
          <div>
            <h4 style={s.heading}>Project Information</h4>
            <p style={s.desc}>Class 12 Computer Science Exhibition Project</p>
            <p style={{ ...s.desc, marginTop: 'var(--space-sm)' }}>Location: Kalyan, Maharashtra, India</p>
            <p style={{ ...s.desc, marginTop: 'var(--space-sm)' }}>Built with React, Supabase & Leaflet</p>
          </div>
        </div>
        <div style={s.divider}>
          <p style={s.disclaimer}>
            <strong>Disclaimer:</strong> This is an independent student-developed prototype. It is NOT officially
            connected to KDMC or any government department. Submitting a report does not guarantee that the
            municipal corporation will take action.
          </p>
          <p style={s.copy}>© {year} Nagar Mitra. All rights reserved. Student Project.</p>
        </div>
      </div>
      <style>{`
        @media(max-width:768px){
          .footer-grid{grid-template-columns:1fr !important}
        }
      `}</style>
    </footer>
  );
}

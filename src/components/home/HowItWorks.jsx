import { LayoutGrid, FileText, MapPin, CheckCircle } from 'lucide-react';

const steps = [
  { icon: LayoutGrid, title: 'Select Category', desc: 'Choose the type of civic issue you want to report' },
  { icon: FileText, title: 'Describe the Problem', desc: 'Provide details, upload a photo of the issue' },
  { icon: MapPin, title: 'Pin the Location', desc: 'Mark the exact issue location on the map' },
  { icon: CheckCircle, title: 'Track Progress', desc: 'Monitor your report status and updates' },
];

export default function HowItWorks() {
  const s = {
    step: {
      textAlign: 'center', padding: 'var(--space-lg)', position: 'relative',
    },
    num: {
      width: 32, height: 32, borderRadius: '50%', background: 'var(--teal)',
      color: 'var(--white)', display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: 'var(--font-size-sm)', fontWeight: 700,
      margin: '0 auto var(--space-md)',
    },
    iconWrap: {
      width: 64, height: 64, borderRadius: 'var(--radius-lg)',
      background: 'var(--navy)', display: 'flex', alignItems: 'center',
      justifyContent: 'center', margin: '0 auto var(--space-md)',
    },
    title: { fontWeight: 700, marginBottom: 'var(--space-xs)' },
    desc: { fontSize: 'var(--font-size-sm)', color: 'var(--text-muted)', lineHeight: 1.6 },
  };

  return (
    <section className="section" style={{ background: 'var(--white)' }}>
      <div className="container">
        <h2 className="section-title">How It Works</h2>
        <p className="section-subtitle">Report a civic issue in four simple steps</p>
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: 'var(--space-lg)',
        }}>
          {steps.map((st, i) => (
            <div key={i} style={s.step}>
              <div style={s.num}>{i + 1}</div>
              <div style={s.iconWrap}>
                <st.icon size={28} color="var(--teal)" />
              </div>
              <h3 style={s.title}>{st.title}</h3>
              <p style={s.desc}>{st.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

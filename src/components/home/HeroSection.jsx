import { Link } from 'react-router-dom';
import { Shield, ArrowRight } from 'lucide-react';

export default function HeroSection() {
  const s = {
    hero: {
      background: 'linear-gradient(135deg, #142B4A 0%, #0f1f35 100%)',
      color: 'var(--white)', padding: 'var(--space-3xl) 0',
      position: 'relative', overflow: 'hidden',
    },
    inner: {
      maxWidth: 'var(--max-width)', margin: '0 auto', padding: '3rem var(--space-lg)',
      textAlign: 'center', position: 'relative', zIndex: 2,
    },
    iconWrap: {
      width: 80, height: 80, borderRadius: '50%', background: 'rgba(15,157,138,0.2)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      margin: '0 auto var(--space-lg)',
    },
    h1: {
      fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 800, lineHeight: 1.1,
      marginBottom: 'var(--space-sm)',
    },
    sub: {
      fontSize: 'clamp(1.25rem, 3vw, 1.75rem)', fontWeight: 300,
      color: 'var(--teal-light, #14b8a6)', marginBottom: 'var(--space-lg)',
    },
    desc: {
      fontSize: 'var(--font-size-lg)', color: 'rgba(255,255,255,0.75)',
      maxWidth: 600, margin: '0 auto var(--space-2xl)', lineHeight: 1.7,
    },
    buttons: {
      display: 'flex', gap: 'var(--space-md)', justifyContent: 'center',
      flexWrap: 'wrap',
    },
    bg: {
      position: 'absolute', top: '-50%', right: '-20%', width: 600, height: 600,
      borderRadius: '50%', background: 'rgba(15,157,138,0.05)',
    },
  };

  return (
    <section style={s.hero}>
      <div style={s.bg} />
      <div style={s.inner}>
        <div style={s.iconWrap}>
          <Shield size={40} color="#0F9D8A" />
        </div>
        <h1 style={s.h1}>Your City. Your Voice.</h1>
        <p style={s.sub}>A Better Tomorrow.</p>
        <p style={s.desc}>
          Report civic issues in your neighbourhood — water, waste, roads, electricity and drainage.
          Help make Kalyan a better place to live.
        </p>
        <div style={s.buttons}>
          <Link to="/report" className="btn btn-accent btn-lg">
            Report an Issue <ArrowRight size={18} />
          </Link>
          <Link to="/track" className="btn btn-outline btn-lg">
            Track Your Report
          </Link>
        </div>
      </div>
    </section>
  );
}

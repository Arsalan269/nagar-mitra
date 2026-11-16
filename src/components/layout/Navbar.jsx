import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Shield, Menu, X, LogOut } from 'lucide-react';
import useAuth from '../../hooks/useAuth';

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, profile, isAdmin, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    setMenuOpen(false);
    navigate('/');
  };

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/report', label: 'Report Issue' },
    { to: '/track', label: 'Track Report' },
    { to: '/map', label: 'Community Map' },
    { to: '/about', label: 'About' },
  ];

  const styles = {
    nav: {
      position: 'fixed', top: 0, left: 0, right: 0, height: 'var(--navbar-height)',
      background: 'var(--navy)', color: 'var(--white)', zIndex: 100,
      boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
    },
    inner: {
      maxWidth: 'var(--max-width)', margin: '0 auto', padding: '0 var(--space-lg)',
      height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    },
    logo: {
      display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--white)',
      textDecoration: 'none', fontWeight: 700, fontSize: 'var(--font-size-xl)',
    },
    links: {
      display: 'flex', alignItems: 'center', gap: 'var(--space-lg)',
    },
    link: {
      color: 'rgba(255,255,255,0.85)', textDecoration: 'none', fontSize: 'var(--font-size-sm)',
      fontWeight: 500, transition: 'color 0.2s',
    },
    hamburger: {
      display: 'none', background: 'none', border: 'none', color: 'var(--white)',
      cursor: 'pointer', padding: '0.25rem',
    },
    mobileMenu: {
      position: 'absolute', top: 'var(--navbar-height)', left: 0, right: 0,
      background: 'var(--navy)', padding: 'var(--space-md) var(--space-lg)',
      display: menuOpen ? 'flex' : 'none', flexDirection: 'column', gap: 'var(--space-md)',
      boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
    },
    authBtn: {
      padding: '0.375rem 0.875rem', borderRadius: 'var(--radius-md)',
      fontSize: 'var(--font-size-sm)', fontWeight: 600, cursor: 'pointer',
      border: '1.5px solid rgba(255,255,255,0.3)', background: 'transparent',
      color: 'var(--white)', transition: 'all 0.2s', textDecoration: 'none',
      display: 'inline-flex', alignItems: 'center', gap: '0.35rem',
    },
  };

  return (
    <nav style={styles.nav}>
      <div style={styles.inner}>
        <Link to="/" style={styles.logo}>
          <Shield size={24} />
          <span>Nagar Mitra</span>
        </Link>

        {/* Desktop Nav */}
        <div style={styles.links} className="desktop-nav">
          {navLinks.map((l) => (
            <Link key={l.to} to={l.to} style={styles.link}>{l.label}</Link>
          ))}
          {user && (
            <Link to="/dashboard" style={styles.link}>Dashboard</Link>
          )}
          {isAdmin && (
            <Link to="/admin/dashboard" style={{ ...styles.link, color: 'var(--teal-light, #14b8a6)' }}>
              Admin
            </Link>
          )}
          {user ? (
            <button onClick={handleSignOut} style={styles.authBtn}>
              <LogOut size={14} /> Logout
            </button>
          ) : (
            <Link to="/login" style={styles.authBtn}>Login</Link>
          )}
        </div>

        {/* Mobile Hamburger */}
        <button
          style={styles.hamburger}
          className="mobile-menu-btn"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <div style={styles.mobileMenu} className="mobile-menu">
        {navLinks.map((l) => (
          <Link key={l.to} to={l.to} style={styles.link} onClick={() => setMenuOpen(false)}>
            {l.label}
          </Link>
        ))}
        {user && (
          <Link to="/dashboard" style={styles.link} onClick={() => setMenuOpen(false)}>Dashboard</Link>
        )}
        {isAdmin && (
          <Link to="/admin/dashboard" style={{ ...styles.link, color: 'var(--teal-light)' }} onClick={() => setMenuOpen(false)}>
            Admin Dashboard
          </Link>
        )}
        {user ? (
          <button onClick={handleSignOut} style={styles.authBtn}>
            <LogOut size={14} /> Logout
          </button>
        ) : (
          <Link to="/login" style={styles.authBtn} onClick={() => setMenuOpen(false)}>Login</Link>
        )}
      </div>

      <style>{`
        @media(max-width:768px){
          .desktop-nav{display:none !important}
          .mobile-menu-btn{display:block !important}
        }
        @media(min-width:769px){
          .mobile-menu{display:none !important}
        }
      `}</style>
    </nav>
  );
}

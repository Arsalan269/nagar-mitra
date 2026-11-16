import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="page-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '80vh', textAlign: 'center' }}>
      <div>
        <h1 style={{ fontSize: '6rem', fontWeight: 800, color: 'var(--navy)', lineHeight: 1, marginBottom: 'var(--space-md)' }}>
          404
        </h1>
        <h2 style={{ fontSize: 'var(--font-size-xl)', fontWeight: 600, color: 'var(--text)', marginBottom: 'var(--space-sm)' }}>
          Page Not Found
        </h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: 'var(--space-xl)', maxWidth: 400, margin: '0 auto var(--space-xl)' }}>
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link to="/" className="btn btn-primary btn-lg">
          <Home size={18} /> Go Home
        </Link>
      </div>
    </div>
  );
}

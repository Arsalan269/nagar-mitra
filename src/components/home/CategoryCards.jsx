import { useNavigate } from 'react-router-dom';
import { CATEGORIES } from '../../utils/constants';
import CategoryIcon from '../common/CategoryIcon';

export default function CategoryCards() {
  const navigate = useNavigate();

  return (
    <section className="section">
      <div className="container">
        <h2 className="section-title">What Can You Report?</h2>
        <p className="section-subtitle">
          Choose a category to report a civic issue in your area
        </p>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: 'var(--space-lg)',
        }}>
          {CATEGORIES.map((cat) => (
            <div
              key={cat.id}
              className="card card-clickable"
              style={{ borderLeft: `4px solid ${cat.color}`, textAlign: 'center', padding: 'var(--space-xl)' }}
              onClick={() => navigate(`/report?category=${cat.id}`)}
            >
              <div style={{
                width: 56, height: 56, borderRadius: '50%',
                background: cat.color + '15', display: 'flex', alignItems: 'center',
                justifyContent: 'center', margin: '0 auto var(--space-md)',
              }}>
                <CategoryIcon categoryId={cat.id} size={28} />
              </div>
              <h3 style={{ fontSize: 'var(--font-size-base)', fontWeight: 700, marginBottom: 'var(--space-sm)', color: 'var(--text)' }}>
                {cat.name}
              </h3>
              <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-muted)', lineHeight: 1.5, marginBottom: 'var(--space-md)' }}>
                {cat.description}
              </p>
              <span className="btn btn-sm btn-secondary" style={{ borderColor: cat.color, color: cat.color }}>
                Report →
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

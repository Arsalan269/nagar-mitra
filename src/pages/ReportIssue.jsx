import { useSearchParams } from 'react-router-dom';
import { useEffect } from 'react';
import ReportForm from '../components/reports/ReportForm';
import { AlertTriangle } from 'lucide-react';

export default function ReportIssue() {
  const [searchParams] = useSearchParams();
  const preselectedCategory = searchParams.get('category') || '';

  useEffect(() => {
    document.title = 'Report an Issue — Nagar Mitra';
  }, []);

  return (
    <div className="page-container">
      <div className="container" style={{ maxWidth: 800, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 'var(--space-2xl)' }}>
          <h1 style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 700, color: 'var(--navy)' }}>
            Report a Civic Issue
          </h1>
          <p style={{ color: 'var(--text-muted)', maxWidth: 500, margin: '0.5rem auto 0' }}>
            Provide details about the civic issue you've observed. Your report will be reviewed by administrators.
          </p>
        </div>
        <ReportForm preselectedCategory={preselectedCategory} />
      </div>
    </div>
  );
}

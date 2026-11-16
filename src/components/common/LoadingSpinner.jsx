export default function LoadingSpinner({ message = 'Loading...', fullPage = false }) {
  const s = {
    wrapper: {
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      gap: 'var(--space-md)', padding: 'var(--space-2xl)',
      ...(fullPage ? { minHeight: '100vh' } : {}),
    },
    spinner: {
      width: 40, height: 40, border: '3px solid var(--border)',
      borderTopColor: 'var(--secondary-blue)', borderRadius: '50%',
      animation: 'spin 0.8s linear infinite',
    },
    text: { color: 'var(--text-muted)', fontSize: 'var(--font-size-sm)' },
  };

  return (
    <div style={s.wrapper}>
      <div style={s.spinner} />
      {message && <p style={s.text}>{message}</p>}
    </div>
  );
}

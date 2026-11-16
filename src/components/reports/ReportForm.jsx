import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Send, CheckCircle, AlertTriangle } from 'lucide-react';
import useAuth from '../../hooks/useAuth';
import { CATEGORIES, SEVERITIES } from '../../utils/constants';
import { validateReportForm } from '../../utils/validators';
import { createReport, uploadReportPhoto } from '../../services/reportService';
import { isSupabaseConfigured } from '../../services/supabase';
import PhotoUpload from './PhotoUpload';
import LocationPicker from './LocationPicker';

export default function ReportForm({ preselectedCategory }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    category: preselectedCategory || '',
    issueType: '',
    title: '',
    description: '',
    severity: 'normal',
    locality: '',
    latitude: null,
    longitude: null,
  });
  const [photo, setPhoto] = useState(null);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(null);
  const [submitError, setSubmitError] = useState('');

  const selectedCategory = CATEGORIES.find(c => c.id === form.category);
  const issueTypes = selectedCategory?.issueTypes || [];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => {
      const next = { ...prev, [name]: value };
      if (name === 'category') next.issueType = '';
      return next;
    });
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleLocationSelect = (loc) => {
    setForm(prev => ({ ...prev, latitude: loc.lat, longitude: loc.lng }));
    if (errors.location) setErrors(prev => ({ ...prev, location: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError('');

    if (!isSupabaseConfigured()) {
      setSubmitError('Database not configured. Please set up Supabase environment variables.');
      return;
    }

    const validation = validateReportForm(form);
    if (!validation.valid) {
      setErrors(validation.errors);
      return;
    }

    setSubmitting(true);
    try {
      let photoPath = null;
      if (photo) {
        const { data: path, error: uploadErr } = await uploadReportPhoto(photo, user.id);
        if (uploadErr) {
          setSubmitError('Failed to upload photo: ' + uploadErr);
          setSubmitting(false);
          return;
        }
        photoPath = path;
      }

      const { data: report, error: createErr } = await createReport({
        citizenId: user.id,
        category: form.category,
        issueType: form.issueType,
        title: form.title,
        description: form.description,
        severity: form.severity,
        locality: form.locality,
        latitude: form.latitude,
        longitude: form.longitude,
        photoPath,
      });

      if (createErr) {
        setSubmitError('Failed to submit report: ' + createErr);
      } else {
        setSuccess(report);
      }
    } catch (err) {
      setSubmitError('An unexpected error occurred. Please try again.');
    }
    setSubmitting(false);
  };

  if (success) {
    return (
      <div className="card" style={{ textAlign: 'center', padding: 'var(--space-2xl)' }}>
        <CheckCircle size={56} color="var(--success)" style={{ margin: '0 auto var(--space-md)' }} />
        <h2 style={{ color: 'var(--navy)', marginBottom: 'var(--space-sm)' }}>Report Submitted Successfully!</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: 'var(--space-md)' }}>
          Your report has been recorded. Use your reference ID to track its progress.
        </p>
        <div style={{
          background: 'var(--bg)', borderRadius: 'var(--radius-md)', padding: 'var(--space-md)',
          display: 'inline-block', marginBottom: 'var(--space-lg)',
        }}>
          <span style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-muted)' }}>Reference ID</span>
          <div style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 800, color: 'var(--navy)' }}>
            {success.reference_id}
          </div>
        </div>
        <div style={{ display: 'flex', gap: 'var(--space-md)', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button className="btn btn-primary" onClick={() => navigate(`/report/${success.id}`)}>
            View Report
          </button>
          <button className="btn btn-secondary" onClick={() => { setSuccess(null); setForm({ category: '', issueType: '', title: '', description: '', severity: 'normal', locality: '', latitude: null, longitude: null }); setPhoto(null); }}>
            Submit Another
          </button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="card" style={{ maxWidth: 700, margin: '0 auto' }}>
      {submitError && (
        <div className="alert alert-error">
          <AlertTriangle size={18} /> {submitError}
        </div>
      )}

      {form.category === 'electricity' && (
        <div className="alert alert-warning">
          <AlertTriangle size={18} />
          <span><strong>Safety Note:</strong> This is a reporting platform only. Never touch electrical equipment or attempt repairs yourself.</span>
        </div>
      )}

      <div className="form-group">
        <label className="form-label">Category <span className="required">*</span></label>
        <select name="category" value={form.category} onChange={handleChange} className={`form-select ${errors.category ? 'error' : ''}`}>
          <option value="">Select a category</option>
          {CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        {errors.category && <p className="form-error">{errors.category}</p>}
      </div>

      {issueTypes.length > 0 && (
        <div className="form-group">
          <label className="form-label">Issue Type <span className="required">*</span></label>
          <select name="issueType" value={form.issueType} onChange={handleChange} className={`form-select ${errors.issueType ? 'error' : ''}`}>
            <option value="">Select issue type</option>
            {issueTypes.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
          {errors.issueType && <p className="form-error">{errors.issueType}</p>}
        </div>
      )}

      <div className="form-group">
        <label className="form-label">Title <span className="required">*</span></label>
        <input name="title" value={form.title} onChange={handleChange} className={`form-input ${errors.title ? 'error' : ''}`} placeholder="Brief title for the issue" />
        {errors.title && <p className="form-error">{errors.title}</p>}
      </div>

      <div className="form-group">
        <label className="form-label">Description <span className="required">*</span></label>
        <textarea name="description" value={form.description} onChange={handleChange} className={`form-textarea ${errors.description ? 'error' : ''}`} placeholder="Describe the issue in detail (minimum 20 characters)" rows={4} />
        {errors.description && <p className="form-error">{errors.description}</p>}
      </div>

      <div className="form-group">
        <label className="form-label">Photograph</label>
        <PhotoUpload onPhotoSelect={setPhoto} photo={photo} />
      </div>

      <div className="form-group">
        <label className="form-label">Location <span className="required">*</span></label>
        <LocationPicker onLocationSelect={handleLocationSelect} />
        {errors.location && <p className="form-error">{errors.location}</p>}
      </div>

      <div className="form-group">
        <label className="form-label">Locality / Area Name <span className="required">*</span></label>
        <input name="locality" value={form.locality} onChange={handleChange} className={`form-input ${errors.locality ? 'error' : ''}`} placeholder="e.g. Khadakpada, Kalyan West" />
        {errors.locality && <p className="form-error">{errors.locality}</p>}
      </div>

      <div className="form-group">
        <label className="form-label">Severity <span className="required">*</span></label>
        <div style={{ display: 'flex', gap: 'var(--space-md)', flexWrap: 'wrap' }}>
          {SEVERITIES.map(sev => (
            <label key={sev.id} style={{
              display: 'flex', alignItems: 'center', gap: 'var(--space-sm)',
              padding: 'var(--space-sm) var(--space-md)',
              borderRadius: 'var(--radius-md)',
              border: `2px solid ${form.severity === sev.id ? sev.color : 'var(--border)'}`,
              cursor: 'pointer', transition: 'border-color 0.2s',
              background: form.severity === sev.id ? sev.color + '10' : 'transparent',
            }}>
              <input type="radio" name="severity" value={sev.id} checked={form.severity === sev.id} onChange={handleChange} style={{ display: 'none' }} />
              <span style={{ width: 10, height: 10, borderRadius: '50%', background: sev.color }} />
              <span style={{ fontWeight: 600, fontSize: 'var(--font-size-sm)' }}>{sev.label}</span>
            </label>
          ))}
        </div>
        {errors.severity && <p className="form-error">{errors.severity}</p>}
      </div>

      <button type="submit" disabled={submitting} className="btn btn-accent btn-lg btn-block" style={{ marginTop: 'var(--space-md)' }}>
        {submitting ? 'Submitting...' : <><Send size={18} /> Submit Report</>}
      </button>
    </form>
  );
}

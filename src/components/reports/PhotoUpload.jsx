import { useState, useRef } from 'react';
import { Upload, X, Image } from 'lucide-react';
import { validateFileUpload } from '../../utils/validators';

export default function PhotoUpload({ onPhotoSelect, photo, error: externalError }) {
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState('');
  const inputRef = useRef(null);

  const handleFile = (file) => {
    if (!file) return;
    const validation = validateFileUpload(file);
    if (!validation.valid) {
      setError(validation.message);
      return;
    }
    setError('');
    setPreview(URL.createObjectURL(file));
    onPhotoSelect(file);
  };

  const handleChange = (e) => handleFile(e.target.files[0]);
  const handleDrop = (e) => { e.preventDefault(); handleFile(e.dataTransfer.files[0]); };
  const handleDragOver = (e) => e.preventDefault();

  const removePhoto = () => {
    setPreview(null);
    setError('');
    onPhotoSelect(null);
    if (inputRef.current) inputRef.current.value = '';
  };

  const displayError = error || externalError;

  return (
    <div>
      {!preview ? (
        <div
          onClick={() => inputRef.current?.click()}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          style={{
            border: `2px dashed ${displayError ? 'var(--danger)' : 'var(--border)'}`,
            borderRadius: 'var(--radius-lg)', padding: 'var(--space-2xl)',
            textAlign: 'center', cursor: 'pointer', transition: 'border-color 0.2s',
            background: 'var(--bg)',
          }}
        >
          <Upload size={32} color="var(--text-muted)" style={{ margin: '0 auto var(--space-sm)' }} />
          <p style={{ fontWeight: 600, marginBottom: 'var(--space-xs)' }}>Click to upload or drag and drop</p>
          <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-muted)' }}>
            JPG, PNG or WebP (max 5 MB)
          </p>
        </div>
      ) : (
        <div style={{ position: 'relative', borderRadius: 'var(--radius-lg)', overflow: 'hidden', border: '1px solid var(--border)' }}>
          <img src={preview} alt="Preview" style={{ width: '100%', maxHeight: 300, objectFit: 'cover' }} />
          <button
            type="button"
            onClick={removePhoto}
            style={{
              position: 'absolute', top: 8, right: 8, width: 32, height: 32,
              borderRadius: '50%', background: 'rgba(0,0,0,0.6)', color: 'var(--white)',
              border: 'none', cursor: 'pointer', display: 'flex',
              alignItems: 'center', justifyContent: 'center',
            }}
          >
            <X size={16} />
          </button>
        </div>
      )}
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/jpg,image/png,image/webp"
        onChange={handleChange}
        style={{ display: 'none' }}
      />
      {displayError && <p className="form-error">{displayError}</p>}
    </div>
  );
}

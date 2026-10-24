import { useEffect, useState } from 'react';
import { listMedia, uploadMedia, deleteMedia, type MediaFile } from './adminData';

interface Props {
  value: string;
  onChange: (url: string) => void;
  label: string;
}

/** Image field control: pick from the media library, upload, or paste a URL. */
export default function MediaPicker({ value, onChange, label }: Props) {
  const [open, setOpen] = useState(false);
  const [files, setFiles] = useState<MediaFile[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (!open) return;
    setLoading(true);
    setError('');
    listMedia()
      .then(setFiles)
      .catch((err: unknown) => setError(err instanceof Error ? err.message : 'Could not load media.'))
      .finally(() => setLoading(false));
  }, [open]);

  async function onUpload(fileList: FileList | null) {
    if (!fileList || fileList.length === 0) return;
    setUploading(true);
    setError('');
    try {
      for (const file of Array.from(fileList)) {
        const uploaded = await uploadMedia(file);
        setFiles((prev) => [uploaded, ...prev]);
        onChange(uploaded.url);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed.');
    } finally {
      setUploading(false);
    }
  }

  async function onRemove(name: string) {
    if (!window.confirm(`Delete ${name}?`)) return;
    try {
      await deleteMedia(name);
      setFiles((prev) => prev.filter((file) => file.name !== name));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Delete failed.');
    }
  }

  return (
    <div>
      <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
        <button type="button" className="abtn" onClick={() => setOpen(true)}>
          Choose image
        </button>
        {value && (
          <button
            type="button"
            className="abtn"
            onClick={() => {
              if (window.confirm('Remove this image?')) onChange('');
            }}
          >
            Remove
          </button>
        )}
      </div>
      {value && (
        <img
          src={value}
          alt=""
          style={{ marginTop: 8, maxHeight: 80, borderRadius: 6, border: '1px solid #d2d2d7' }}
        />
      )}
      <input
        className="input"
        style={{ marginTop: 8, fontSize: 13 }}
        type="url"
        placeholder={`…or paste an image URL for ${label}`}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />

      {open && (
        <div className="media-picker-overlay" onClick={() => setOpen(false)}>
          <div className="media-picker" onClick={(e) => e.stopPropagation()}>
            <div className="media-picker-head">
              <strong>Media library</strong>
              <div style={{ display: 'flex', gap: 8 }}>
                <label className="abtn abtn-primary" style={{ cursor: 'pointer' }}>
                  {uploading ? 'Uploading…' : 'Upload'}
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    hidden
                    onChange={(e) => onUpload(e.target.files)}
                    disabled={uploading}
                  />
                </label>
                <button type="button" className="abtn" onClick={() => setOpen(false)}>
                  Close
                </button>
              </div>
            </div>
            <div className="media-picker-body">
              {error && <p className="admin-error">{error}</p>}
              {loading && <p className="aform-help">Loading…</p>}
              {!loading && files.length === 0 && <p className="admin-empty">No images yet — upload one.</p>}
              <div className="media-grid">
                {files.map((file) => (
                  <div key={file.name} className="media-item">
                    <img
                      src={file.url}
                      alt=""
                      role="button"
                      tabIndex={0}
                      style={{ cursor: 'pointer' }}
                      onClick={() => {
                        onChange(file.url);
                        setOpen(false);
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          onChange(file.url);
                          setOpen(false);
                        }
                      }}
                    />
                    <div className="media-item-meta">{file.name}</div>
                    <div className="media-item-foot">
                      <button type="button" className="abtn abtn-icon" onClick={() => onChange(file.url)}>
                        Use
                      </button>
                      <button type="button" className="abtn abtn-icon abtn-danger" onClick={() => onRemove(file.name)}>
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

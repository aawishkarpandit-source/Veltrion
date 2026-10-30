import { useEffect, useState } from 'react';
import { deleteMedia, friendlyDbError, listMedia, uploadMedia, type MediaFile } from '../adminData';

export default function MediaPage() {
  const [files, setFiles] = useState<MediaFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function load() {
    setLoading(true);
    setError('');
    listMedia()
      .then(setFiles)
      .catch((err) => setError(friendlyDbError(err)))
      .finally(() => setLoading(false));
  }

  async function onUpload(fileList: FileList | null) {
    if (!fileList || fileList.length === 0) return;
    setBusy(true);
    setError('');
    try {
      for (const file of Array.from(fileList)) {
        const uploaded = await uploadMedia(file);
        setFiles((prev) => [uploaded, ...prev]);
      }
    } catch (err) {
      setError(friendlyDbError(err));
    } finally {
      setBusy(false);
    }
  }

  async function onRemove(name: string) {
    if (!window.confirm(`Delete ${name}? Images in use on the site will stop showing.`)) return;
    try {
      await deleteMedia(name);
      setFiles((prev) => prev.filter((file) => file.name !== name));
    } catch (err) {
      setError(friendlyDbError(err));
    }
  }

  async function copyUrl(url: string) {
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      window.prompt('Copy this URL:', url);
    }
  }

  return (
    <>
      <div className="admin-head">
        <div>
          <h1>Media library</h1>
          <p>Images uploaded here can be used in projects, downloads and team photos.</p>
        </div>
        <label className="abtn abtn-primary" style={{ cursor: 'pointer' }}>
          {busy ? 'Uploading…' : 'Upload images'}
          <input type="file" accept="image/*" multiple hidden onChange={(e) => onUpload(e.target.files)} disabled={busy} />
        </label>
      </div>

      {error && <p className="admin-error" style={{ marginBottom: 16 }}>{error}</p>}

      <div className="apanel apanel-pad">
        {loading ? (
          <p className="aform-help">Loading…</p>
        ) : files.length === 0 ? (
          <p className="admin-empty">No images yet. Upload screenshots, logos or app covers to get started.</p>
        ) : (
          <div className="media-grid">
            {files.map((file) => (
              <div key={file.name} className="media-item">
                <img src={file.url} alt="" loading="lazy" />
                <div className="media-item-meta">{file.name}</div>
                <div className="media-item-foot">
                  <button type="button" className="abtn abtn-icon" onClick={() => copyUrl(file.url)}>
                    Copy URL
                  </button>
                  <button type="button" className="abtn abtn-icon abtn-danger" onClick={() => onRemove(file.name)}>
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

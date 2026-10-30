import { useCallback, useEffect, useState } from 'react';
import { requireClient, friendlyDbError, touchContent, type Row } from '../adminData';
import { ArrowDownIcon, ArrowUpIcon } from '../../components/ui/icons';

const PAGES = [
  { key: 'home', label: 'Home' },
  { key: 'about', label: 'About Us' },
  { key: 'work', label: 'Our Work' },
  { key: 'download', label: 'Download' },
  { key: 'contact', label: 'Contacts' },
];

export default function PageSectionsPage() {
  const [page, setPage] = useState('home');
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [saved, setSaved] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const supabase = requireClient();
      const { data, error } = await supabase
        .from('page_sections')
        .select('*')
        .eq('page', page)
        .order('sort_order');
      if (error) throw error;
      setRows((data as Row[]) ?? []);
    } catch (err) {
      setError(friendlyDbError(err));
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    load();
  }, [load]);

  function flashSaved() {
    setSaved(true);
    window.setTimeout(() => setSaved(false), 1800);
  }

  async function toggleVisible(row: Row) {
    const next = !row.visible;
    setRows((prev) => prev.map((r) => (r.id === row.id ? { ...r, visible: next } : r)));
    try {
      const supabase = requireClient();
      const { error } = await supabase.from('page_sections').update({ visible: next }).eq('id', row.id);
      if (error) throw error;
      touchContent();
      flashSaved();
    } catch (err) {
      setError(friendlyDbError(err));
      load();
    }
  }

  async function move(index: number, direction: -1 | 1) {
    const target = index + direction;
    if (target < 0 || target >= rows.length) return;
    const next = [...rows];
    const a = next[index];
    const b = next[target];
    const aOrder = a.sort_order ?? (index + 1) * 10;
    const bOrder = b.sort_order ?? (target + 1) * 10;
    next[index] = { ...a, sort_order: bOrder };
    next[target] = { ...b, sort_order: aOrder };
    // Keep the array in visual order for immediate feedback.
    next.sort((x, y) => (x.sort_order ?? 0) - (y.sort_order ?? 0));
    setRows(next);
    setSaving(true);
    try {
      const supabase = requireClient();
      const r1 = await supabase.from('page_sections').update({ sort_order: bOrder }).eq('id', a.id);
      if (r1.error) throw r1.error;
      const r2 = await supabase.from('page_sections').update({ sort_order: aOrder }).eq('id', b.id);
      if (r2.error) throw r2.error;
      touchContent();
      flashSaved();
    } catch (err) {
      setError(friendlyDbError(err));
      load();
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <div className="admin-head">
        <div>
          <h1>Page sections</h1>
          <p>Show or hide sections on each page and drag them into order with the arrows. No code needed.</p>
        </div>
        <div className="admin-actions">
          <select className="select" style={{ maxWidth: 200 }} value={page} onChange={(e) => setPage(e.target.value)}>
            {PAGES.map((p) => (
              <option key={p.key} value={p.key}>
                {p.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {error && (
        <p className="admin-error" style={{ marginBottom: 16 }}>
          {error}
        </p>
      )}
      {saved && (
        <p style={{ color: '#30d158', fontSize: 13, marginBottom: 16 }} role="status">
          Saved — changes are live on the public site.
        </p>
      )}
      {saving && <p className="aform-help" style={{ marginBottom: 12 }}>Saving order…</p>}

      <div className="apanel">
        {loading ? (
          <p className="admin-empty">Loading…</p>
        ) : rows.length === 0 ? (
          <p className="admin-empty">
            No sections found for this page. Run the 0004 migration, or they will appear once seeded.
          </p>
        ) : (
          <table className="atable">
            <thead>
              <tr>
                <th style={{ width: 60 }}>Order</th>
                <th>Section</th>
                <th style={{ width: 140 }}>Visibility</th>
                <th style={{ width: 140 }} className="col-actions">
                  Reorder
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, index) => (
                <tr key={row.id}>
                  <td style={{ color: '#86868b', fontWeight: 600 }}>{index + 1}</td>
                  <td>
                    <div className="row-title">{String(row.label ?? row.section_key)}</div>
                    <div className="row-sub">{String(row.section_key)}</div>
                  </td>
                  <td>
                    <span className={`status-dot ${row.visible === false ? 'off' : ''}`} />
                    <button
                      type="button"
                      onClick={() => toggleVisible(row)}
                      style={{ fontSize: 12, color: '#707070' }}
                      title="Toggle visibility"
                    >
                      {row.visible === false ? 'Hidden' : 'Visible'}
                    </button>
                  </td>
                  <td className="col-actions">
                    <button
                      type="button"
                      className="abtn abtn-icon"
                      onClick={() => move(index, -1)}
                      disabled={index === 0}
                      aria-label="Move up"
                    >
                      <ArrowUpIcon />
                    </button>{' '}
                    <button
                      type="button"
                      className="abtn abtn-icon"
                      onClick={() => move(index, 1)}
                      disabled={index === rows.length - 1}
                      aria-label="Move down"
                    >
                      <ArrowDownIcon />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <p className="aform-help" style={{ marginTop: 16, maxWidth: 640 }}>
        Sections appear in the order below. Hidden sections are removed from the public page entirely. The content
        inside each section (headings, images, items) is still edited in its own menu under Content.
      </p>
    </>
  );
}

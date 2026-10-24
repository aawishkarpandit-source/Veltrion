import { useEffect, useState } from 'react';
import { requireClient, touchContent } from '../adminData';
import { DEFAULT_BLOCKS } from '../../lib/defaultContent';
import type { TextBlock } from '../../lib/types';

interface EditState {
  key: string;
  label: string;
  page: string;
  value: string;
  isNew: boolean;
}

export default function TextBlocksPage() {
  const [rows, setRows] = useState<EditState[]>([]);
  const [error, setError] = useState('');
  const [savingKey, setSavingKey] = useState('');
  const [savedKey, setSavedKey] = useState('');

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const { data, error: err } = await requireClient().from('text_blocks').select('*').order('page');
        if (!alive) return;
        if (err) {
          setError(err.message);
          return;
        }
        const existing = (data as TextBlock[]) ?? [];
        const existingKeys = new Set(existing.map((row) => row.key));
        const blocks: EditState[] = existing.map((row) => ({
          key: row.key,
          label: row.label ?? row.key,
          page: row.page ?? 'misc',
          value: row.value ?? '',
          isNew: false,
        }));
        // Blocks the seed knows about but the DB doesn't yet — offer them for insert.
        for (const block of DEFAULT_BLOCKS) {
          if (!existingKeys.has(block.key)) {
            blocks.push({ key: block.key, label: block.label, page: block.page, value: block.value, isNew: true });
          }
        }
        setRows(blocks);
      } catch (err) {
        if (alive) setError(err instanceof Error ? err.message : 'Could not load text blocks.');
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  async function save(row: EditState) {
    setSavingKey(row.key);
    setError('');
    setSavedKey('');
    try {
      const supabase = requireClient();
      if (row.isNew) {
        const { error: err } = await supabase
          .from('text_blocks')
          .insert({ key: row.key, page: row.page, label: row.label, value: row.value });
        if (err) throw err;
      } else {
        const { error: err } = await supabase.from('text_blocks').update({ value: row.value }).eq('key', row.key);
        if (err) throw err;
      }
      touchContent();
      setRows((prev) => prev.map((r) => (r.key === row.key ? { ...r, isNew: false } : r)));
      setSavedKey(row.key);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Save failed.');
    } finally {
      setSavingKey('');
    }
  }

  const pages = Array.from(new Set(rows.map((row) => row.page)));

  return (
    <>
      <div className="admin-head">
        <div>
          <h1>Text blocks</h1>
          <p>Headlines and small pieces of copy used across the pages.</p>
        </div>
      </div>

      {error && <p className="admin-error" style={{ marginBottom: 16 }}>{error}</p>}

      {pages.map((page) => (
        <section key={page} style={{ marginBottom: 32 }}>
          <h2 style={{ fontSize: 13, fontWeight: 600, color: '#707070', marginBottom: 8, textTransform: 'capitalize' }}>
            {page === 'meta' ? 'Browser tabs & share previews' : page}
          </h2>
          <div className="apanel">
            {rows
              .filter((row) => row.page === page)
              .map((row) => (
                <div key={row.key} style={{ padding: 16, borderBottom: '1px solid #f0f0f2' }}>
                  <p style={{ fontSize: 12, fontWeight: 600, marginBottom: 6 }}>
                    {row.label}
                    {row.isNew && <span style={{ color: '#707070', fontWeight: 400 }}> — not in database yet</span>}
                  </p>
                  <textarea
                    className="textarea"
                    style={{ minHeight: row.value.length > 90 ? 80 : 40, fontSize: 14 }}
                    value={row.value}
                    onChange={(e) => {
                      const value = e.target.value;
                      setRows((prev) => prev.map((r) => (r.key === row.key ? { ...r, value } : r)));
                      setSavedKey('');
                    }}
                  />
                  <div style={{ marginTop: 8, display: 'flex', gap: 8, alignItems: 'center' }}>
                    <button className="abtn" type="button" disabled={savingKey === row.key} onClick={() => save(row)}>
                      {savingKey === row.key ? 'Saving…' : row.isNew ? 'Add to database' : 'Save'}
                    </button>
                    {savedKey === row.key && <span className="aform-help">Saved.</span>}
                  </div>
                </div>
              ))}
          </div>
        </section>
      ))}
    </>
  );
}

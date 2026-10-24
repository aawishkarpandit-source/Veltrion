import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { COLLECTIONS } from '../collections';
import { deleteRow, fetchAll, updateRow, type Row } from '../adminData';
import { ArrowDownIcon, ArrowUpIcon, TrashIcon } from '../../components/ui/icons';

export default function CollectionList() {
  const { collection = '' } = useParams();
  const def = COLLECTIONS[collection];
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!def) return;
    setLoading(true);
    setError('');
    fetchAll(def.table)
      .then(setRows)
      .catch((err) => setError(err instanceof Error ? err.message : 'Could not load.'))
      .finally(() => setLoading(false));
  }, [def]);

  if (!def) return <p className="admin-error">Unknown collection.</p>;

  async function move(index: number, direction: -1 | 1) {
    const next = [...rows];
    const target = index + direction;
    if (target < 0 || target >= next.length) return;
    const a = next[index];
    const b = next[target];
    // Swap sort orders; nudge to keep them distinct.
    const aOrder = a.sort_order ?? (index + 1) * 10;
    const bOrder = b.sort_order ?? (target + 1) * 10;
    next[index] = { ...a, sort_order: bOrder };
    next[target] = { ...b, sort_order: aOrder };
    setRows(next);
    try {
      await updateRow(def.table, a.id, { sort_order: bOrder });
      await updateRow(def.table, b.id, { sort_order: aOrder });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Reorder failed.');
      setRows(rows);
    }
  }

  async function togglePublished(row: Row) {
    const nextValue = !row.published;
    setRows((prev) => prev.map((r) => (r.id === row.id ? { ...r, published: nextValue } : r)));
    try {
      await updateRow(def.table, row.id, { published: nextValue });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Update failed.');
      setRows(rows);
    }
  }

  async function remove(row: Row) {
    if (!window.confirm(`Delete this ${def.singular}? This cannot be undone.`)) return;
    try {
      await deleteRow(def.table, row.id);
      setRows((prev) => prev.filter((r) => r.id !== row.id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Delete failed.');
    }
  }

  return (
    <>
      <div className="admin-head">
        <div>
          <h1>{def.label}</h1>
          <p>{rows.length} item{rows.length === 1 ? '' : 's'} — reorder with the arrows, toggle visibility with Published.</p>
        </div>
        <div className="admin-actions">
          <Link className="abtn abtn-primary" to={`/admin/c/${collection}/new`}>
            Add {def.singular}
          </Link>
        </div>
      </div>

      {error && <p className="admin-error" style={{ marginBottom: 16 }}>{error}</p>}

      <div className="apanel">
        {loading ? (
          <p className="admin-empty">Loading…</p>
        ) : rows.length === 0 ? (
          <p className="admin-empty">Nothing here yet — add the first {def.singular}.</p>
        ) : (
          <table className="atable">
            <thead>
              <tr>
                <th>{def.singular === 'link' ? 'Label' : 'Name'}</th>
                <th style={{ width: 120 }}>Status</th>
                <th style={{ width: 240 }} className="col-actions">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, index) => (
                <tr key={row.id}>
                  <td>
                    <div className="row-title">{String(row[def.titleField] ?? '—')}</div>
                    {def.subField && row[def.subField] && <div className="row-sub">{String(row[def.subField])}</div>}
                  </td>
                  <td>
                    <span className={`status-dot ${row.published === false ? 'off' : ''}`} />
                    <button
                      type="button"
                      onClick={() => togglePublished(row)}
                      style={{ fontSize: 12, color: '#707070' }}
                      title="Toggle visibility"
                    >
                      {row.published === false ? 'Hidden' : 'Published'}
                    </button>
                  </td>
                  <td className="col-actions">
                    <button type="button" className="abtn abtn-icon" onClick={() => move(index, -1)} disabled={index === 0} aria-label="Move up">
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
                    </button>{' '}
                    <Link className="abtn abtn-icon" to={`/admin/c/${collection}/${row.id}`}>
                      Edit
                    </Link>{' '}
                    <button type="button" className="abtn abtn-icon abtn-danger" onClick={() => remove(row)} aria-label="Delete">
                      <TrashIcon />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}

import { useEffect, useState, type FormEvent } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { COLLECTIONS } from '../collections';
import { fetchOne, friendlyDbError, insertRow, updateRow, type Row } from '../adminData';
import type { FieldDef } from '../collections';
import MediaPicker from '../MediaPicker';

function toFormValues(def: (typeof COLLECTIONS)[string], row: Row | null): Row {
  const values: Row = {};
  for (const field of def.fields) {
    const raw = row?.[field.name];
    if (field.type === 'tags') {
      values[field.name] = Array.isArray(raw) ? raw.join('\n') : '';
    } else if (field.type === 'boolean') {
      values[field.name] = raw ?? (field.name === 'published' ? true : false);
    } else if (field.type === 'number') {
      values[field.name] = raw ?? '';
    } else if (raw == null) {
      values[field.name] = '';
    } else {
      values[field.name] = raw;
    }
  }
  return values;
}

function toRowValues(def: (typeof COLLECTIONS)[string], values: Row): Row {
  const row: Row = {};
  for (const field of def.fields) {
    const value = values[field.name];
    if (field.type === 'tags') {
      row[field.name] = String(value)
        .split('\n')
        .map((line) => line.trim())
        .filter(Boolean);
    } else if (field.type === 'number') {
      row[field.name] = value === '' || value == null ? 0 : Number(value);
    } else if (field.type === 'boolean') {
      row[field.name] = Boolean(value);
    } else {
      row[field.name] = value;
    }
  }
  return row;
}

function Field({ field, values, setValues }: { field: FieldDef; values: Row; setValues: (next: Row) => void }) {
  const value = values[field.name] ?? '';

  function update(next: unknown) {
    setValues({ ...values, [field.name]: next });
  }

  switch (field.type) {
    case 'textarea':
      return (
        <label className="field">
          <span className="field-label">{field.label}</span>
          <textarea className="textarea" value={value} onChange={(e) => update(e.target.value)} />
          {field.help && <span className="aform-help">{field.help}</span>}
        </label>
      );
    case 'boolean':
      return (
        <label className="aform-check">
          <input type="checkbox" checked={Boolean(value)} onChange={(e) => update(e.target.checked)} />
          {field.label}
        </label>
      );
    case 'number':
      return (
        <label className="field">
          <span className="field-label">{field.label}</span>
          <input className="input" type="number" value={value} onChange={(e) => update(e.target.value)} />
          {field.help && <span className="aform-help">{field.help}</span>}
        </label>
      );
    case 'select':
      return (
        <label className="field">
          <span className="field-label">{field.label}</span>
          <select className="select" value={value} onChange={(e) => update(e.target.value)}>
            {(field.options ?? []).map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>
      );
    case 'tags':
      return (
        <label className="field">
          <span className="field-label">{field.label}</span>
          <textarea className="textarea" style={{ minHeight: 80 }} value={value} onChange={(e) => update(e.target.value)} />
          {field.help && <span className="aform-help">{field.help}</span>}
        </label>
      );
    case 'image':
      return (
        <div className="field">
          <span className="field-label">{field.label}</span>
          <MediaPicker label={field.label} value={value} onChange={(url) => update(url)} />
        </div>
      );
    case 'url':
      return (
        <label className="field">
          <span className="field-label">{field.label}</span>
          <input className="input" type="url" value={value} onChange={(e) => update(e.target.value)} />
          {field.help && <span className="aform-help">{field.help}</span>}
        </label>
      );
    default:
      return (
        <label className="field">
          <span className="field-label">{field.label}</span>
          <input className="input" type="text" value={value} onChange={(e) => update(e.target.value)} />
          {field.help && <span className="aform-help">{field.help}</span>}
        </label>
      );
  }
}

export default function RecordForm() {
  const { collection = '', id } = useParams();
  const def = COLLECTIONS[collection];
  const navigate = useNavigate();
  const isNew = !id || id === 'new';

  const [values, setValues] = useState<Row | null>(null);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!def) return;
    if (isNew) {
      setValues(toFormValues(def, null));
      return;
    }
    fetchOne(def.table, id)
      .then((row) => setValues(toFormValues(def, row)))
      .catch((err) => setError(friendlyDbError(err)));
  }, [def, id, isNew]);

  if (!def) return <p className="admin-error">Unknown collection.</p>;
  if (!values) return <p className="aform-help">{error || 'Loading…'}</p>;

  async function save(event: FormEvent) {
    event.preventDefault();
    setSaving(true);
    setError('');
    try {
      const row = toRowValues(def!, values!);
      if (isNew) await insertRow(def!.table, row);
      else await updateRow(def!.table, id!, row);
      navigate(`/admin/c/${collection}`);
    } catch (err) {
      setError(friendlyDbError(err));
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <div className="admin-head">
        <div>
          <h1>
            {isNew ? 'Add' : 'Edit'} {def.singular}
          </h1>
          <p>Changes appear on the public site on the next page load.</p>
        </div>
        <div className="admin-actions">
          <Link className="abtn" to={`/admin/c/${collection}`}>
            Cancel
          </Link>
        </div>
      </div>

      <div className="apanel apanel-pad">
        <form className="aform" onSubmit={save}>
          {def.fields.map((field) => (
            <Field key={field.name} field={field} values={values} setValues={setValues} />
          ))}
          {error && <p className="admin-error">{error}</p>}
          <div className="aform-foot">
            <button type="submit" className="abtn abtn-primary" disabled={saving}>
              {saving ? 'Saving…' : isNew ? `Add ${def.singular}` : 'Save changes'}
            </button>
            <Link className="abtn" to={`/admin/c/${collection}`}>
              Back to list
            </Link>
          </div>
        </form>
      </div>
    </>
  );
}

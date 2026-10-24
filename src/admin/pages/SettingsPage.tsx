import { useEffect, useState, type FormEvent } from 'react';
import { requireClient, socialLinesToString, socialStringToLinks, touchContent } from '../adminData';
import type { SiteSettings } from '../../lib/types';

const FALLBACK: SiteSettings = {
  id: 1,
  brand_name: 'VELTRION',
  tagline: "Engineered for What's Next.",
  industry: 'Software & Digital Technology',
  default_theme: 'system',
  contact_email: '',
  phone: '',
  address: '',
  social_links: [],
  footer_legal: '',
};

export default function SettingsPage() {
  const [row, setRow] = useState<SiteSettings | null>(null);
  const [socialText, setSocialText] = useState('');
  const [error, setError] = useState('');
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const { data } = await requireClient()
          .from('site_settings')
          .select('*')
          .eq('id', 1)
          .maybeSingle();
        if (!alive) return;
        const settings = { ...FALLBACK, ...((data as SiteSettings) ?? {}) };
        setRow(settings);
        setSocialText(socialLinesToString(settings.social_links));
      } catch (err) {
        if (alive) setError(err instanceof Error ? err.message : 'Could not load settings.');
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  async function save(event: FormEvent) {
    event.preventDefault();
    if (!row) return;
    setSaving(true);
    setError('');
    setSaved(false);
    try {
      const { error: err } = await requireClient()
        .from('site_settings')
        .update({
          brand_name: row.brand_name,
          tagline: row.tagline,
          industry: row.industry,
          default_theme: row.default_theme,
          contact_email: row.contact_email,
          phone: row.phone,
          address: row.address,
          social_links: socialStringToLinks(socialText),
          footer_legal: row.footer_legal,
        })
        .eq('id', 1);
      if (err) throw err;
      touchContent();
      setSaved(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Save failed.');
    } finally {
      setSaving(false);
    }
  }

  if (!row) return <p className="aform-help">{error || 'Loading…'}</p>;

  const set = (patch: Partial<SiteSettings>) => {
    setRow({ ...row, ...patch });
    setSaved(false);
  };

  return (
    <>
      <div className="admin-head">
        <div>
          <h1>Site settings</h1>
          <p>Brand, contact details, social links and the default theme.</p>
        </div>
      </div>

      <div className="apanel apanel-pad">
        <form className="aform" onSubmit={save}>
          <label className="field">
            <span className="field-label">Brand name</span>
            <input className="input" value={row.brand_name} onChange={(e) => set({ brand_name: e.target.value })} />
          </label>
          <label className="field">
            <span className="field-label">Tagline</span>
            <input className="input" value={row.tagline} onChange={(e) => set({ tagline: e.target.value })} />
          </label>
          <label className="field">
            <span className="field-label">Industry line</span>
            <input className="input" value={row.industry} onChange={(e) => set({ industry: e.target.value })} />
          </label>
          <label className="field">
            <span className="field-label">Default theme (first-time visitors)</span>
            <select
              className="select"
              value={row.default_theme}
              onChange={(e) => set({ default_theme: e.target.value as SiteSettings['default_theme'] })}
            >
              <option value="system">Follow the visitor's device setting</option>
              <option value="light">Light</option>
              <option value="dark">Dark</option>
            </select>
          </label>
          <div className="aform-row">
            <label className="field">
              <span className="field-label">Contact email</span>
              <input
                className="input"
                type="email"
                value={row.contact_email}
                onChange={(e) => set({ contact_email: e.target.value })}
              />
            </label>
            <label className="field">
              <span className="field-label">Phone</span>
              <input className="input" value={row.phone} onChange={(e) => set({ phone: e.target.value })} />
            </label>
          </div>
          <label className="field">
            <span className="field-label">Address</span>
            <textarea className="textarea" style={{ minHeight: 70 }} value={row.address} onChange={(e) => set({ address: e.target.value })} />
          </label>
          <label className="field">
            <span className="field-label">Social links</span>
            <textarea
              className="textarea"
              style={{ minHeight: 90 }}
              value={socialText}
              onChange={(e) => {
                setSocialText(e.target.value);
                setSaved(false);
              }}
            />
            <span className="aform-help">One per line in the form: Label | https://url — e.g. Facebook | https://facebook.com/veltrion</span>
          </label>
          <label className="field">
            <span className="field-label">Footer legal line</span>
            <input className="input" value={row.footer_legal} onChange={(e) => set({ footer_legal: e.target.value })} />
          </label>

          {error && <p className="admin-error">{error}</p>}
          {saved && <p className="aform-help">Saved.</p>}
          <div className="aform-foot">
            <button type="submit" className="abtn abtn-primary" disabled={saving}>
              {saving ? 'Saving…' : 'Save settings'}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}

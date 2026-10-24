import { useState, type FormEvent } from 'react';
import { requireClient } from './adminData';

interface Props {
  needsConfiguration?: boolean;
}

export default function LoginPage({ needsConfiguration }: Props) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [resetSent, setResetSent] = useState(false);

  async function signIn(event: FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError('');
    try {
      const supabase = requireClient();
      const { error: err } = await supabase.auth.signInWithPassword({ email, password });
      if (err) setError(err.message);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Sign-in failed.');
    } finally {
      setBusy(false);
    }
  }

  async function sendReset() {
    if (!email) {
      setError('Enter your email above first, then request a reset link.');
      return;
    }
    setBusy(true);
    setError('');
    try {
      const supabase = requireClient();
      await supabase.auth.resetPasswordForEmail(email);
      setResetSent(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not send the reset link.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="admin-login">
      <form className="admin-login-card" onSubmit={signIn}>
        <img src="/logo/full-size-logo-no-text.png" alt="" />
        <h1>VELTRION admin</h1>
        <p>Sign in to edit the website content.</p>

        {needsConfiguration ? (
          <p className="admin-error">
            Supabase is not configured. Create a project, run the SQL migrations in <code>supabase/migrations/</code>,
            then set <code>VITE_SUPABASE_URL</code> and <code>VITE_SUPABASE_ANON_KEY</code> in your environment.
          </p>
        ) : (
          <>
            <label className="field">
              <span className="field-label">Email</span>
              <input
                className="input"
                type="email"
                autoComplete="username"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </label>
            <label className="field">
              <span className="field-label">Password</span>
              <input
                className="input"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </label>
            {error && <p className="admin-error">{error}</p>}
            {resetSent && <p className="aform-help">Reset link sent — check your email.</p>}
            <button className="abtn abtn-primary" type="submit" disabled={busy}>
              {busy ? 'Signing in…' : 'Sign in'}
            </button>
            <div className="admin-login-foot">
              <button type="button" onClick={sendReset} disabled={busy}>
                Forgot password?
              </button>
              <a href="/">Back to site</a>
            </div>
          </>
        )}
      </form>
    </div>
  );
}

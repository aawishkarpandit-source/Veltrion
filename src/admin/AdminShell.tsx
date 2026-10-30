import { useEffect, useState, type ReactNode } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { claimAdmin, checkAccess, fetchMessages, friendlyDbError, requireClient, type AccessInfo } from './adminData';
import { COLLECTIONS } from './collections';

/**
 * Banner shown when the signed-in account can't write (the classic
 * "nothing saves" RLS case). Offers the one-click self-heal from 0006 or
 * the exact SQL instead of leaving silent no-op saves.
 */
function AccessBanner({ access }: { access: AccessInfo | null }) {
  const [fixing, setFixing] = useState(false);
  const [failure, setFailure] = useState('');
  const [email, setEmail] = useState('');

  useEffect(() => {
    requireClient()
      .auth.getSession()
      .then(({ data }) => setEmail(data.session?.user?.email ?? ''))
      .catch(() => {});
  }, []);

  async function fix() {
    setFixing(true);
    setFailure('');
    try {
      const result = await claimAdmin();
      if (result === false) {
        setFailure('The claim was refused because an admin already exists — reload and sign in with that account instead.');
        setFixing(false);
        return;
      }
      window.location.reload();
    } catch (err) {
      setFailure(friendlyDbError(err));
      setFixing(false);
    }
  }

  const promoteSql = `insert into public.admin_users (id, email)\nselect id, email from auth.users\nwhere email = '${email || 'your-admin-email'}'\non conflict (id) do nothing;`;

  let title: string;
  let body: ReactNode;
  if (access === null) {
    title = 'Saves are blocked — run migration 0006';
    body = (
      <>
        Your account isn't confirmed as an admin, so every edit is a silent no-op. Run{' '}
        <code>supabase/migrations/0006_admin_access.sql</code> in the Supabase SQL editor — it promotes the
        existing account(s), adds this one-click fix and clear save errors.
      </>
    );
  } else if (access.isAdmin) {
    return null;
  } else if (access.adminCount === 0) {
    title = 'Saves are blocked — claim admin access';
    body = (
      <>
        You're signed in, but nobody on this project has admin rights yet — Supabase is rejecting every
        write. Claim it with one click:
      </>
    );
  } else {
    title = "Saves are blocked — this account isn't an admin";
    body = (
      <>
        The admin rights belong to a different account. Sign in with that one, or promote this account by
        running the SQL from Supabase &gt; SQL editor:
      </>
    );
  }

  return (
    <div className="admin-banner" role="alert">
      <div className="admin-banner-text">
        <strong>{title}</strong>
        <p>
          {body}
          {failure && <span className="admin-error"> {failure}</span>}
        </p>
        {access !== null && !access.isAdmin && access.adminCount !== 0 && (
          <details>
            <summary>Show SQL</summary>
            <pre>{promoteSql}</pre>
          </details>
        )}
      </div>
      {access !== null && access.adminCount === 0 && (
        <button className="abtn abtn-primary" type="button" onClick={fix} disabled={fixing}>
          {fixing ? 'Fixing…' : 'Fix access'}
        </button>
      )}
    </div>
  );
}

export default function AdminShell() {
  const navigate = useNavigate();
  const [unread, setUnread] = useState(0);
  const [access, setAccess] = useState<AccessInfo | null>(null);

  useEffect(() => {
    let alive = true;
    // Who can write? Drives the access banner (silent RLS no-ops otherwise).
    checkAccess()
      .then((info) => {
        if (alive) setAccess(info);
      })
      .catch(() => {});

    fetchMessages()
      .then((rows) => {
        if (alive) setUnread(rows.filter((row) => !row.read).length);
      })
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, []);

  async function signOut() {
    try {
      await requireClient().auth.signOut();
    } finally {
      navigate('/admin', { replace: true });
    }
  }

  return (
    <div className="admin-shell">
      <aside className="admin-side">
        <div className="admin-side-brand">
          <img src="/logo/brand-dark.png" alt="VELTRION" />
          <span className="admin-side-tag">admin</span>
        </div>

        <NavLink to="/admin" end className={({ isActive }) => (isActive ? 'active' : '')}>
          Dashboard
        </NavLink>
        <NavLink to="/admin/messages" className={({ isActive }) => (isActive ? 'active' : '')}>
          Messages {unread > 0 && <span className="badge">{unread}</span>}
        </NavLink>
        <NavLink to="/admin/page-sections" className={({ isActive }) => (isActive ? 'active' : '')}>
          Page sections
        </NavLink>

        <p className="admin-side-title">Content</p>
        {Object.entries(COLLECTIONS)
          .filter(([key]) => key !== 'settings')
          .map(([key, def]) => (
            <NavLink key={key} to={`/admin/c/${key}`} className={({ isActive }) => (isActive ? 'active' : '')}>
              {def.label}
            </NavLink>
          ))}

        <p className="admin-side-title">Site</p>
        <NavLink to="/admin/text-blocks" className={({ isActive }) => (isActive ? 'active' : '')}>
          Text blocks
        </NavLink>
        <NavLink to="/admin/media" className={({ isActive }) => (isActive ? 'active' : '')}>
          Media library
        </NavLink>
        <NavLink to="/admin/settings" className={({ isActive }) => (isActive ? 'active' : '')}>
          Settings
        </NavLink>

        <div className="admin-side-foot">
          <a
            href="/"
            onClick={(e) => {
              e.preventDefault();
              window.open('/', '_blank');
            }}
          >
            View site ↗
          </a>
          <a
            href="#signout"
            onClick={(e) => {
              e.preventDefault();
              signOut();
            }}
          >
            Sign out
          </a>
        </div>
      </aside>

      <main className="admin-main">
        {access === null || !access.isAdmin ? <AccessBanner access={access} /> : null}
        <Outlet />
      </main>
    </div>
  );
}

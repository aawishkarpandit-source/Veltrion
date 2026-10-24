import { useEffect, useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { requireClient } from './adminData';
import { COLLECTIONS } from './collections';
import { fetchMessages } from './adminData';

export default function AdminShell() {
  const navigate = useNavigate();
  const [unread, setUnread] = useState(0);

  useEffect(() => {
    let alive = true;
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
          <img src="/logo/full-size-logo-no-text.png" alt="" />
          <span style={{ fontSize: 12, color: '#86868b' }}>admin</span>
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

        <div style={{ marginTop: 'auto', padding: '12px 12px 0' }}>
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
        <Outlet />
      </main>
    </div>
  );
}

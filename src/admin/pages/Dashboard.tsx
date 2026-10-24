import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchAll, fetchMessages } from '../adminData';
import { isSupabaseConfigured } from '../../lib/supabase';
import type { ContactMessage } from '../../lib/types';

interface Stat {
  label: string;
  value: number | string;
}

export default function Dashboard() {
  const [stats, setStats] = useState<Stat[]>([]);
  const [latest, setLatest] = useState<ContactMessage[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isSupabaseConfigured()) return;
    let alive = true;
    Promise.all([
      fetchAll('services'),
      fetchAll('projects'),
      fetchAll('downloads'),
      fetchAll('team_members'),
      fetchMessages(),
    ])
      .then(([services, projects, downloads, team, messages]) => {
        if (!alive) return;
        setStats([
          { label: 'Messages', value: messages.length },
          { label: 'Unread', value: messages.filter((m) => !m.read).length },
          { label: 'Projects', value: projects.length },
          { label: 'Downloads', value: downloads.length },
          { label: 'Services', value: services.length },
          { label: 'Team members', value: team.length },
        ]);
        setLatest(messages.slice(0, 5));
      })
      .catch((err) => setError(err instanceof Error ? err.message : 'Could not load stats.'));
    return () => {
      alive = false;
    };
  }, []);

  return (
    <>
      <div className="admin-head">
        <div>
          <h1>Dashboard</h1>
          <p>Everything on the public site is edited from here.</p>
        </div>
        <div className="admin-actions">
          <Link className="abtn" to="/admin/c/projects/new">
            Add project
          </Link>
          <Link className="abtn abtn-primary" to="/admin/c/downloads/new">
            Add app
          </Link>
        </div>
      </div>

      {!isSupabaseConfigured() && (
        <p className="admin-note">
          Supabase is not configured — set <code>VITE_SUPABASE_URL</code> and <code>VITE_SUPABASE_ANON_KEY</code> in
          Vercel/your .env file and run the migrations in <code>supabase/migrations/</code>.
        </p>
      )}

      {error && <p className="admin-error">{error}</p>}

      <div className="stats">
        {stats.map((stat) => (
          <div key={stat.label} className="stat">
            <p className="stat-num">{stat.value}</p>
            <p className="stat-label">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="apanel">
        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '14px 16px', borderBottom: '1px solid #e2e2e5' }}>
          <strong>Latest messages</strong>
          <Link to="/admin/messages">Open inbox</Link>
        </div>
        {latest.length === 0 ? (
          <p className="admin-empty">No messages yet.</p>
        ) : (
          <table className="atable">
            <tbody>
              {latest.map((message) => (
                <tr key={message.id}>
                  <td>
                    <div className="row-title">{message.name}</div>
                    <div className="row-sub">{message.message}</div>
                  </td>
                  <td className="col-actions">
                    <Link className="abtn abtn-icon" to="/admin/messages">
                      Open
                    </Link>
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

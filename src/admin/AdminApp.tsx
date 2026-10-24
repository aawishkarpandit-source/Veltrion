import { useEffect, useState } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import type { Session } from '@supabase/supabase-js';
import { getSupabase } from '../lib/supabase';
import LoginPage from './LoginPage';
import AdminShell from './AdminShell';
import Dashboard from './pages/Dashboard';
import CollectionList from './pages/CollectionList';
import RecordForm from './pages/RecordForm';
import SettingsPage from './pages/SettingsPage';
import TextBlocksPage from './pages/TextBlocksPage';
import MediaPage from './pages/MediaPage';
import MessagesPage from './pages/MessagesPage';
import PageSectionsPage from './pages/PageSectionsPage';

export default function AdminApp() {
  const supabase = getSupabase();
  const [session, setSession] = useState<Session | null>(null);
  const [checking, setChecking] = useState(true);

  // The admin is a quiet light app with hardcoded light surfaces — force the
  // light theme context while it's mounted so a visitor's dark public theme
  // never bleeds in (white text on white cards). Restored on leave.
  useEffect(() => {
    const root = document.documentElement;
    const prev = root.getAttribute('data-theme');
    root.setAttribute('data-theme', 'light');
    return () => {
      if (prev) root.setAttribute('data-theme', prev);
      else root.removeAttribute('data-theme');
    };
  }, []);

  useEffect(() => {
    if (!supabase) {
      setChecking(false);
      return;
    }
    let alive = true;
    supabase.auth.getSession().then(({ data }) => {
      if (!alive) return;
      setSession(data.session ?? null);
      setChecking(false);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_event, next) => {
      setSession(next);
    });
    return () => {
      alive = false;
      sub.subscription.unsubscribe();
    };
  }, [supabase]);

  if (checking) {
    return (
      <div className="admin-root admin-login">
        <p className="muted">Loading…</p>
      </div>
    );
  }

  if (!supabase) {
    return <LoginPage needsConfiguration />;
  }

  if (!session) {
    return <LoginPage />;
  }

  return (
    <div className="admin-root">
      <Routes>
        <Route element={<AdminShell />}>
          <Route index element={<Dashboard />} />
          <Route path="messages" element={<MessagesPage />} />
          <Route path="page-sections" element={<PageSectionsPage />} />
          <Route path="media" element={<MediaPage />} />
          <Route path="settings" element={<SettingsPage />} />
          <Route path="text-blocks" element={<TextBlocksPage />} />
          <Route path="c/:collection" element={<CollectionList />} />
          <Route path="c/:collection/new" element={<RecordForm />} />
          <Route path="c/:collection/:id" element={<RecordForm />} />
          <Route path="*" element={<Navigate to="/admin" replace />} />
        </Route>
      </Routes>
    </div>
  );
}

import { useEffect, useState } from 'react';
import { fetchMessages, friendlyDbError, removeMessage, setMessageRead } from '../adminData';
import type { ContactMessage } from '../../lib/types';

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleString();
  } catch {
    return iso;
  }
}

export default function MessagesPage() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function load() {
    setLoading(true);
    fetchMessages()
      .then((rows) => {
        setMessages(rows);
        setSelectedId((current) => current ?? rows[0]?.id ?? null);
      })
      .catch((err) => setError(friendlyDbError(err)))
      .finally(() => setLoading(false));
  }

  const selected = messages.find((message) => message.id === selectedId) ?? null;

  async function toggleRead(message: ContactMessage) {
    const next = !message.read;
    setMessages((prev) => prev.map((m) => (m.id === message.id ? { ...m, read: next } : m)));
    try {
      await setMessageRead(message.id, next);
    } catch (err) {
      setError(friendlyDbError(err));
    }
  }

  async function remove(message: ContactMessage) {
    if (!window.confirm('Delete this message?')) return;
    try {
      await removeMessage(message.id);
      setMessages((prev) => prev.filter((m) => m.id !== message.id));
      setSelectedId(null);
    } catch (err) {
      setError(friendlyDbError(err));
    }
  }

  return (
    <>
      <div className="admin-head">
        <div>
          <h1>Messages</h1>
          <p>Enquiries sent through the contact form on the site.</p>
        </div>
      </div>

      {error && <p className="admin-error" style={{ marginBottom: 16 }}>{error}</p>}

      {loading ? (
        <p className="aform-help">Loading…</p>
      ) : messages.length === 0 ? (
        <div className="apanel">
          <p className="admin-empty">No messages yet.</p>
        </div>
      ) : (
        <div className="inbox">
          <div className="inbox-list">
            {messages.map((message) => (
              <button
                key={message.id}
                type="button"
                className={`inbox-item ${message.id === selectedId ? 'active' : ''}`}
                onClick={() => {
                  setSelectedId(message.id);
                  if (!message.read) toggleRead(message);
                }}
              >
                <span className="who">
                  <span>{message.read ? '' : '● '}{message.name}</span>
                  <span className="when">{new Date(message.created_at).toLocaleDateString()}</span>
                </span>
                <span className="snippet">{message.subject || message.message}</span>
              </button>
            ))}
          </div>

          {selected && (
            <div className="inbox-detail">
              <h2 style={{ fontSize: 18, fontWeight: 600 }}>{selected.subject || 'No subject'}</h2>
              <p className="aform-help">
                From {selected.name} ·{' '}
                <a href={`mailto:${selected.email}`}>{selected.email}</a> · {formatDate(selected.created_at)}
              </p>
              <pre>{selected.message}</pre>
              <div className="aform-foot">
                <a className="abtn abtn-primary" href={`mailto:${selected.email}?subject=Re: ${encodeURIComponent(selected.subject || 'Your enquiry')}`}>
                  Reply by email
                </a>
                <button type="button" className="abtn" onClick={() => toggleRead(selected)}>
                  Mark as {selected.read ? 'unread' : 'read'}
                </button>
                <button type="button" className="abtn abtn-danger" onClick={() => remove(selected)}>
                  Delete
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
}

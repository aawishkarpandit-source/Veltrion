import { useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { getSupabase } from '../../lib/supabase';
import { useAsync } from '../../lib/hooks';
import { getTextBlocks } from '../../lib/content';
import { CheckIcon } from '../ui/icons';

interface Errors {
  name?: string;
  email?: string;
  message?: string;
  accepted?: string;
}

export default function ContactForm() {
  const { data: blocks } = useAsync(() => getTextBlocks(), []);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [accepted, setAccepted] = useState(false);
  const [errors, setErrors] = useState<Errors>({});
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [failure, setFailure] = useState('');

  function validate(): Errors {
    const next: Errors = {};
    if (!name.trim()) next.name = 'Please tell us your name.';
    if (!email.trim()) next.email = 'Please add your email so we can reply.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) next.email = 'That email address looks incomplete.';
    if (message.trim().length < 10) next.message = 'Please describe what you need in a sentence or two.';
    if (!accepted) next.accepted = 'Please accept the Privacy Policy and Terms of Service to continue.';
    return next;
  }

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    const found = validate();
    setErrors(found);
    if (Object.keys(found).length > 0) return;

    const supabase = getSupabase();
    if (!supabase) {
      setFailure('The contact form is not connected yet. Please email us directly.');
      return;
    }

    setSending(true);
    setFailure('');
    let query = supabase.from('contact_messages').insert({
      name: name.trim(),
      email: email.trim(),
      subject: subject.trim(),
      message: message.trim(),
      // Proof of consent: the visitor accepted Privacy + Terms via the checkbox.
      accepted: accepted,
    });
    let { error } = await query;

    // Migration 0007 (consent column) not applied yet — send without it
    // rather than losing the message.
    if (error && /accepted/i.test(error.message ?? '')) {
      ({ error } = await supabase.from('contact_messages').insert({
        name: name.trim(),
        email: email.trim(),
        subject: subject.trim(),
        message: message.trim(),
      }));
    }
    setSending(false);

    if (error) {
      setFailure('Something went wrong sending your message. Please try again or email us directly.');
      return;
    }
    setSent(true);
  }

  if (sent) {
    return (
      <div className="form-success" role="status">
        <CheckIcon size={40} />
        <h2 className="heading-sm">Thank you, {name.split(' ')[0]}.</h2>
        <p className="muted" style={{ marginTop: 'var(--spacing-8)' }}>
          {blocks?.['contact.form_note'] ?? 'We usually reply within one working day.'}
        </p>
      </div>
    );
  }

  return (
    <form className="form-grid" onSubmit={onSubmit} noValidate>
      <div className="form-row">
        <label className="field">
          <span className="field-label">Your name</span>
          <input
            className="input"
            type="text"
            name="name"
            autoComplete="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            aria-invalid={Boolean(errors.name)}
          />
          {errors.name && <span className="field-error">{errors.name}</span>}
        </label>
        <label className="field">
          <span className="field-label">Email</span>
          <input
            className="input"
            type="email"
            name="email"
            autoComplete="email"
            inputMode="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            aria-invalid={Boolean(errors.email)}
          />
          {errors.email && <span className="field-error">{errors.email}</span>}
        </label>
      </div>

      <label className="field">
        <span className="field-label">Subject (optional)</span>
        <input className="input" type="text" name="subject" value={subject} onChange={(e) => setSubject(e.target.value)} />
      </label>

      <label className="field">
        <span className="field-label">What do you need?</span>
        <textarea
          className="textarea"
          name="message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          aria-invalid={Boolean(errors.message)}
        />
        {errors.message && <span className="field-error">{errors.message}</span>}
      </label>

      {failure && (
        <p className="field-error" role="alert">
          {failure}
        </p>
      )}

      <label className="form-check">
        <input
          type="checkbox"
          checked={accepted}
          onChange={(e) => {
            setAccepted(e.target.checked);
            if (errors.accepted) setErrors({ ...errors, accepted: undefined });
          }}
          aria-invalid={Boolean(errors.accepted)}
        />
        <span>
          I accept the <Link to="/privacy">Privacy Policy</Link> and{' '}
          <Link to="/terms">Terms of Service</Link>.
        </span>
      </label>
      {errors.accepted && <span className="field-error">{errors.accepted}</span>}

      <div>
        <button type="submit" className="btn btn-filled" disabled={sending}>
          {sending ? 'Sending…' : 'Send message'}
        </button>
      </div>
    </form>
  );
}

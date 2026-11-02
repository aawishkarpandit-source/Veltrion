-- ===========================================================================
-- 0007 — Record contact-form consent
-- The contact form requires accepting the Privacy Policy + Terms of Service;
-- this column stores that acceptance, as proof, with every message.
-- Older rows (sent before the checkbox existed) keep the default false.
-- Safe to re-run.
-- ===========================================================================

alter table public.contact_messages
  add column if not exists accepted boolean not null default false;

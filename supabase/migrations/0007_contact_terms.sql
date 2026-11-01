-- ===========================================================================
-- 0007 — Add accepted_terms column to contact_messages
-- Adds a boolean field to track whether the user accepted Privacy Policy
-- and Terms of Service when submitting the contact form.
-- ===========================================================================

alter table public.contact_messages
add column accepted_terms boolean not null default false;

comment on column public.contact_messages.accepted_terms is
  'Whether the user accepted Privacy Policy and Terms of Service when submitting the contact form';
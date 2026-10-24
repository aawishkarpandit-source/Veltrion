-- ===========================================================================
-- Make yourself an admin — run AFTER creating your admin account in
-- Supabase > Authentication > Users (email + password sign-up, or invite).
-- Replace the email below with the admin's email.
-- ===========================================================================

insert into public.admin_users (id, email)
select id, email from auth.users where email = 'admin@veltrion.com'
on conflict (id) do nothing;

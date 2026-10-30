-- ===========================================================================
-- 0006 — Admin access fix + safety net
--
-- SYMPTOM THIS FIXES: signed in, "Saved." shows, but nothing changes on the
-- site. CAUSE: every write policy (0001) checks public.is_admin(), which
-- returns false whenever the signed-in user has no row in admin_users.
-- Under RLS the update matches ZERO rows and silently "succeeds" — no error
-- anywhere. This migration:
--   1. promotes the existing auth accounts (only while NO admin exists),
--   2. adds one-click self-heal + diagnostics RPCs for the admin UI,
--   3. tightens the page_sections write policies to real admins.
-- Run once in the Supabase SQL editor. Safe to re-run.
-- ===========================================================================

-- ---------------------------------------------------------------------------
-- 1) Promote existing auth accounts — ONLY runs while admin_users is empty,
--    so re-running never grants admin to strangers who signed up later.
-- ---------------------------------------------------------------------------
insert into public.admin_users (id, email)
select u.id, u.email
from auth.users u
where u.email is not null
  and not exists (select 1 from public.admin_users)
on conflict (id) do nothing;

-- ---------------------------------------------------------------------------
-- 2) Diagnostics: the admin UI calls this to show "who can edit".
-- ---------------------------------------------------------------------------
create or replace function public.admin_access_check()
returns table (is_admin boolean, admin_count int)
language sql
stable
security definer
set search_path = public
as $$
  select public.is_admin(), (select count(*) from public.admin_users)::int;
$$;

revoke all on function public.admin_access_check() from public;
grant execute on function public.admin_access_check() to anon, authenticated;

-- ---------------------------------------------------------------------------
-- 3) Self-heal: a signed-in user can claim admin ONLY while no admin exists.
--    Once an admin exists this returns false for everyone else — no open door.
-- ---------------------------------------------------------------------------
create or replace function public.claim_admin()
returns boolean
language plpgsql
stable
security definer
set search_path = public
as $$
begin
  if auth.uid() is null then
    return false;
  end if;
  -- Already an admin → fine.
  if exists (select 1 from public.admin_users where id = auth.uid()) then
    return true;
  end if;
  -- Somebody else is already the admin → do nothing.
  if exists (select 1 from public.admin_users) then
    return false;
  end if;
  -- First signed-in user claims ownership.
  insert into public.admin_users (id, email)
  select id, email from auth.users where id = auth.uid()
  on conflict (id) do nothing;
  return true;
end;
$$;

revoke all on function public.claim_admin() from public;
grant execute on function public.claim_admin() to authenticated;

-- ---------------------------------------------------------------------------
-- 4) page_sections writes were open to ANY signed-in account (auth.role());
--    align them with the same admin gate used everywhere else.
-- ---------------------------------------------------------------------------
drop policy if exists "Admin insert page_sections" on public.page_sections;
create policy "Admin insert page_sections"
  on public.page_sections for insert
  with check (public.is_admin());

drop policy if exists "Admin update page_sections" on public.page_sections;
create policy "Admin update page_sections"
  on public.page_sections for update
  using (public.is_admin());

drop policy if exists "Admin delete page_sections" on public.page_sections;
create policy "Admin delete page_sections"
  on public.page_sections for delete
  using (public.is_admin());

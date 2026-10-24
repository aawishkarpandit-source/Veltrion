-- ===========================================================================
-- VELTRION website — schema, RLS and storage
-- Run this first in the Supabase SQL editor (or `supabase db push`).
-- ===========================================================================

-- ---------------------------------------------------------------------------
-- Admin authorization
-- ---------------------------------------------------------------------------

create table if not exists public.admin_users (
  id uuid primary key references auth.users (id) on delete cascade,
  email text,
  created_at timestamptz not null default now()
);

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (select 1 from public.admin_users where id = auth.uid());
$$;

revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to anon, authenticated;

-- ---------------------------------------------------------------------------
-- Content tables
-- ---------------------------------------------------------------------------

create table if not exists public.site_settings (
  id int primary key default 1 check (id = 1),
  brand_name text not null default 'VELTRION',
  tagline text not null default '',
  industry text not null default '',
  default_theme text not null default 'system' check (default_theme in ('system', 'light', 'dark')),
  contact_email text not null default '',
  phone text not null default '',
  address text not null default '',
  social_links jsonb not null default '[]'::jsonb,
  footer_legal text not null default '',
  updated_at timestamptz not null default now()
);

create table if not exists public.navigation_items (
  id uuid primary key default gen_random_uuid(),
  label text not null,
  href text not null,
  position text not null default 'nav' check (position in ('nav', 'footer')),
  "group" text not null default 'main',
  sort_order int not null default 0,
  published boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.text_blocks (
  key text primary key,
  page text not null default 'misc',
  label text not null default '',
  value text not null default '',
  updated_at timestamptz not null default now()
);

create table if not exists public.services (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null default '',
  sort_order int not null default 0,
  published boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.process_steps (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null default '',
  sort_order int not null default 0,
  published boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.why_points (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null default '',
  sort_order int not null default 0,
  published boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.content_bullets (
  id uuid primary key default gen_random_uuid(),
  group_key text not null,
  text text not null,
  sort_order int not null default 0,
  published boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.team_members (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  initials text not null default '',
  role text not null default '',
  bio text not null default '',
  photo_url text not null default '',
  sort_order int not null default 0,
  published boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  client_name text not null,
  description text not null default '',
  logo_url text not null default '',
  image_url text not null default '',
  site_url text not null default '',
  tech_tags text[] not null default '{}',
  review_quote text not null default '',
  review_author text not null default '',
  review_role text not null default '',
  sort_order int not null default 0,
  published boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.downloads (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  short_desc text not null default '',
  long_desc text not null default '',
  cover_url text not null default '',
  download_url text not null default '',
  platforms text[] not null default '{}',
  version text not null default '',
  size text not null default '',
  featured boolean not null default false,
  sort_order int not null default 0,
  published boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  subject text not null default '',
  message text not null,
  read boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists idx_projects_sort on public.projects (sort_order);
create index if not exists idx_downloads_sort on public.downloads (sort_order);
create index if not exists idx_messages_created on public.contact_messages (created_at desc);

-- ---------------------------------------------------------------------------
-- Row level security
-- ---------------------------------------------------------------------------

alter table public.site_settings enable row level security;
alter table public.navigation_items enable row level security;
alter table public.text_blocks enable row level security;
alter table public.services enable row level security;
alter table public.process_steps enable row level security;
alter table public.why_points enable row level security;
alter table public.content_bullets enable row level security;
alter table public.team_members enable row level security;
alter table public.projects enable row level security;
alter table public.downloads enable row level security;
alter table public.contact_messages enable row level security;
alter table public.admin_users enable row level security;

-- Read policies: everyone sees published content; admins see everything.
create policy "settings read" on public.site_settings for select using (true);
create policy "nav read" on public.navigation_items for select using (published or public.is_admin());
create policy "blocks read" on public.text_blocks for select using (true);
create policy "services read" on public.services for select using (published or public.is_admin());
create policy "process read" on public.process_steps for select using (published or public.is_admin());
create policy "why read" on public.why_points for select using (published or public.is_admin());
create policy "bullets read" on public.content_bullets for select using (published or public.is_admin());
create policy "team read" on public.team_members for select using (published or public.is_admin());
create policy "projects read" on public.projects for select using (published or public.is_admin());
create policy "downloads read" on public.downloads for select using (published or public.is_admin());

-- Write policies: admin only.
create policy "settings write" on public.site_settings for all using (public.is_admin()) with check (public.is_admin());
create policy "nav write" on public.navigation_items for all using (public.is_admin()) with check (public.is_admin());
create policy "blocks write" on public.text_blocks for all using (public.is_admin()) with check (public.is_admin());
create policy "services write" on public.services for all using (public.is_admin()) with check (public.is_admin());
create policy "process write" on public.process_steps for all using (public.is_admin()) with check (public.is_admin());
create policy "why write" on public.why_points for all using (public.is_admin()) with check (public.is_admin());
create policy "bullets write" on public.content_bullets for all using (public.is_admin()) with check (public.is_admin());
create policy "team write" on public.team_members for all using (public.is_admin()) with check (public.is_admin());
create policy "projects write" on public.projects for all using (public.is_admin()) with check (public.is_admin());
create policy "downloads write" on public.downloads for all using (public.is_admin()) with check (public.is_admin());

-- Contact messages: anyone can send, only admins can read/manage.
create policy "anyone can send messages" on public.contact_messages
  for insert with check (char_length(name) > 0 and char_length(email) > 0 and char_length(message) > 0);
create policy "messages read" on public.contact_messages for select using (public.is_admin());
create policy "messages update" on public.contact_messages for update using (public.is_admin()) with check (public.is_admin());
create policy "messages delete" on public.contact_messages for delete using (public.is_admin());

-- Admin users: admins can see the list; users always see themselves.
create policy "admins read admin_users" on public.admin_users for select using (public.is_admin() or id = auth.uid());

-- ---------------------------------------------------------------------------
-- Media storage (public bucket, admin-managed)
-- ---------------------------------------------------------------------------

insert into storage.buckets (id, name, public)
values ('media', 'media', true)
on conflict (id) do update set public = true;

create policy "media read" on storage.objects for select using (bucket_id = 'media');
create policy "media admin insert" on storage.objects for insert with check (bucket_id = 'media' and public.is_admin());
create policy "media admin delete" on storage.objects for delete using (bucket_id = 'media' and public.is_admin());

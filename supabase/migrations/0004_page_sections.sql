-- ===========================================================================
-- 0004 — Per-page section control (full editability)
-- Lets the admin show/hide and reorder the sections on each public page
-- without touching code. Layout stays in code; visibility + order live here.
-- ===========================================================================

create table if not exists public.page_sections (
  id text primary key,               -- stable key, e.g. 'home.services'
  page text not null,                -- 'home' | 'about' | 'work' | 'download' | 'contact'
  label text not null,               -- human name shown in the admin
  section_key text not null,         -- which code section this controls
  visible boolean not null default true,
  sort_order integer not null default 0,
  updated_at timestamptz not null default now(),
  unique (page, section_key)
);

-- RLS: public read, writes go through authenticated admin (same as other tables).
alter table public.page_sections enable row level security;

drop policy if exists "Public read page_sections" on public.page_sections;
create policy "Public read page_sections"
  on public.page_sections for select
  using (true);

drop policy if exists "Admin insert page_sections" on public.page_sections;
create policy "Admin insert page_sections"
  on public.page_sections for insert
  with check (auth.role() = 'authenticated');

drop policy if exists "Admin update page_sections" on public.page_sections;
create policy "Admin update page_sections"
  on public.page_sections for update
  using (auth.role() = 'authenticated');

drop policy if exists "Admin delete page_sections" on public.page_sections;
create policy "Admin delete page_sections"
  on public.page_sections for delete
  using (auth.role() = 'authenticated');

-- Seed the default section order for every page (idempotent).
insert into public.page_sections (id, page, label, section_key, visible, sort_order) values
  ('home.hero',        'home',     'Hero',             'hero',     true, 10),
  ('home.services',    'home',     'Services',         'services', true, 20),
  ('home.process',     'home',     'Process',          'process',  true, 30),
  ('home.why',         'home',     'Why Veltrion',     'why',      true, 40),
  ('about.intro',      'about',    'Intro',            'intro',    true, 10),
  ('about.vision',     'about',    'Vision & Mission', 'vision',   true, 20),
  ('about.team',       'about',    'Team',             'team',     true, 30),
  ('about.who',        'about',    'Who we work with','who',      true, 40),
  ('work.projects',    'work',     'Projects',         'projects', true, 10),
  ('download.list',    'download', 'Downloads',        'downloads',true, 10),
  ('contact.details',  'contact', 'Contact details',  'details',  true, 10),
  ('contact.form',     'contact', 'Contact form',     'form',     true, 20)
on conflict (id) do nothing;

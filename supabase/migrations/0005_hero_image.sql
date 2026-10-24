-- ===========================================================================
-- 0005 — Editable hero image
-- Lets the admin set a custom hero image URL from Text blocks.
-- Empty value = the default logo mark is shown.
-- ===========================================================================

insert into public.text_blocks (key, page, label, value)
values (
  'home.hero.image',
  'home',
  'Hero image URL (upload to Media and paste the public URL — leave empty to show the logo mark)',
  ''
)
on conflict (key) do nothing;

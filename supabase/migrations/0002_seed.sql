-- ===========================================================================
-- VELTRION website — seed content from the company brief.
-- Safe to re-run: existing rows and edited text blocks are preserved.
-- ===========================================================================

insert into public.site_settings (id, brand_name, tagline, industry, default_theme, contact_email, footer_legal)
values (1, 'VELTRION', 'Engineered for What''s Next.', 'Software & Digital Technology', 'system', 'hello@veltrion.com', 'Software & Digital Technology.')
on conflict (id) do nothing;

insert into public.navigation_items (label, href, position, "group", sort_order) values
  ('Home', '/', 'nav', 'main', 10),
  ('About Us', '/about', 'nav', 'main', 20),
  ('Our Work', '/our-work', 'nav', 'main', 30),
  ('Download', '/download', 'nav', 'main', 40),
  ('Contacts', '/contact', 'nav', 'main', 50);

insert into public.text_blocks (key, page, label, value) values
  ('meta.home.title', 'meta', 'Home — browser tab & share preview title', 'VELTRION — Software & Digital Technology'),
  ('meta.home.description', 'meta', 'Home — share preview description', 'Websites, software, business systems, design, marketing and support. Engineered for What''s Next.'),
  ('meta.about.title', 'meta', 'About Us — title', 'About Us — VELTRION'),
  ('meta.about.description', 'meta', 'About Us — description', 'Our vision, mission, process and the people behind VELTRION.'),
  ('meta.work.title', 'meta', 'Our Work — title', 'Our Work — VELTRION'),
  ('meta.work.description', 'meta', 'Our Work — description', 'Businesses, organizations and individuals we build digital tools for.'),
  ('meta.download.title', 'meta', 'Download — title', 'Download — VELTRION'),
  ('meta.download.description', 'meta', 'Download — description', 'Apps and digital tools built by VELTRION.'),
  ('meta.contact.title', 'meta', 'Contacts — title', 'Contact — VELTRION'),
  ('meta.contact.description', 'meta', 'Contacts — description', 'Tell us what you need. We reply with a clear scope and a clear price.'),
  ('home.hero.headline', 'home', 'Hero — headline', 'Engineered for What''s Next.'),
  ('home.hero.subline', 'home', 'Hero — supporting line', 'Websites, software, business systems, design, marketing and support.'),
  ('home.hero.cta_primary', 'home', 'Hero — primary button', 'See our work'),
  ('home.hero.cta_secondary', 'home', 'Hero — secondary button', 'Contact us'),
  ('services.title', 'home', 'Services — section heading', 'What we do.'),
  ('services.subtitle', 'home', 'Services — supporting line', 'Practical digital solutions that are easy to use and dependable.'),
  ('process.title', 'home', 'Process — section heading', 'How we work.'),
  ('process.subtitle', 'home', 'Process — supporting line', 'Four steps, from first conversation to long-term care.'),
  ('why.title', 'home', 'Why — section heading', 'Why Veltrion.'),
  ('why.statement', 'home', 'Why — big statement line', 'Precision. Reliability. Simplicity. Professionalism.'),
  ('about.intro', 'about', 'About — opening paragraph', 'VELTRION is a technology company. We provide websites, software and digital services for businesses, organizations and individuals — practical solutions that are easy to use and dependable.'),
  ('about.vision_title', 'about', 'Vision — title', 'Reliable and accessible software for every business.'),
  ('about.vision_text', 'about', 'Vision — paragraph', 'To build reliable, modern and accessible software solutions that help businesses grow and operate digitally.'),
  ('about.mission_title', 'about', 'Mission — title', 'Technology with a human touch.'),
  ('about.mission_text', 'about', 'Mission — paragraph', 'To combine technology, creativity and business understanding to develop practical digital products for modern organizations.'),
  ('about.team_title', 'about', 'Team — section heading', 'Our team.'),
  ('about.org_note', 'about', 'Team — organization note', 'The Chairman leads the company. Marketing, Design and Business teams handle daily work, while the Legal Advisor guides independently.'),
  ('about.who_title', 'about', 'Who we work with — heading', 'Who we work with.'),
  ('about.who_text', 'about', 'Who we work with — paragraph', 'Shops, offices, organizations and individuals: anyone who wants reliable, easy-to-use digital tools. We agree the scope and the price up front, keep you updated with regular progress, and deliver on time.'),
  ('work.title', 'work', 'Our Work — page heading', 'Our work.'),
  ('work.subtitle', 'work', 'Our Work — supporting line', 'Businesses, organizations and individuals we build for — and what they say about working with us.'),
  ('work.empty_title', 'work', 'Our Work — empty state heading', 'New projects are on the way.'),
  ('work.empty_text', 'work', 'Our Work — empty state text', 'We are putting together the stories of the businesses we build for. Ask us directly and we will show you relevant work.'),
  ('download.title', 'download', 'Download — page heading', 'Download.'),
  ('download.subtitle', 'download', 'Download — supporting line', 'Apps and digital tools built by VELTRION.'),
  ('download.empty_title', 'download', 'Download — empty state heading', 'Our first releases are being prepared.'),
  ('download.empty_text', 'download', 'Download — empty state text', 'New tools for everyday business work are coming. Get in touch if you need something built for your business now.'),
  ('contact.title', 'contact', 'Contacts — page heading', 'Contact us.'),
  ('contact.subtitle', 'contact', 'Contacts — supporting line', 'Tell us what you need. We reply with a clear scope and a clear price.'),
  ('contact.form_note', 'contact', 'Contacts — form note', 'We usually reply within one working day.')
on conflict (key) do nothing;

insert into public.services (title, description, sort_order) values
  ('Business Websites', 'Professional websites that build trust and bring enquiries.', 10),
  ('Custom Software', 'Software made for your exact business needs.', 20),
  ('Web Applications', 'Online booking, billing, customer portals and more.', 30),
  ('Records & Database', 'Safe, organized records and easy reports.', 40),
  ('Business Management System', 'Sales, stock, staff and accounts in one place.', 50),
  ('Marketing & Promotion', 'Get found on Google and social media.', 60),
  ('Support & Hosting', 'We look after your website and software for you.', 70);

insert into public.process_steps (title, description, sort_order) values
  ('Plan', 'We understand your needs and agree a clear scope.', 10),
  ('We design', 'See a preview and request changes until you are happy.', 20),
  ('We build & launch', 'We develop, test and launch your website or system.', 30),
  ('We support', 'Ongoing care and promotion after launch.', 40);

insert into public.content_bullets (group_key, text, sort_order) values
  ('process.get', 'Clear scope and pricing agreed up front', 10),
  ('process.get', 'On-time delivery with regular updates', 20),
  ('process.get', 'Support after launch: updates and backups', 30);

insert into public.why_points (title, description, sort_order) values
  ('Business-first approach', 'We understand shops, offices and organizations, so we suggest only what you need.', 10),
  ('On-time delivery', 'A clear timeline and regular updates throughout the project.', 20),
  ('Long-term care', 'After launch we stay with you — updates, backups and help whenever needed.', 30);

insert into public.team_members (name, initials, role, bio, sort_order) values
  ('Awishkar Pandit', 'AP', 'Chairman & Lead Developer', 'Leads the company and oversees all software development and quality.', 10),
  ('Abhinav Basnet', 'AB', 'Lead Marketing Agent', 'Looks after marketing, promotion and bringing new clients.', 20),
  ('Sakshyam Basnet', 'SB', 'Lead Creative Designer', 'Handles branding, graphics and creative design work.', 30),
  ('Pranjal Sharma', 'PS', 'Business Manager', 'Manages daily operations, clients and project delivery.', 40),
  ('Laxmi Bhandari', 'LB', 'Legal Advisor', 'Provides legal guidance and ensures proper business practice.', 50);

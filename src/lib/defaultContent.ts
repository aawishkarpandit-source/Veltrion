// Fallback content — mirrors supabase/migrations/0002_seed.sql.
// Used when Supabase is unreachable or not configured, so the site always renders.

import type {
  ContentBullet,
  DownloadItem,
  NavItem,
  PageSection,
  ProcessStep,
  Project,
  Service,
  SiteSettings,
  TeamMember,
  TextBlock,
  WhyPoint,
} from './types';

export const DEFAULT_SETTINGS: SiteSettings = {
  id: 1,
  brand_name: 'VELTRION',
  tagline: "Engineered for What's Next.",
  industry: 'Software & Digital Technology',
  default_theme: 'system',
  contact_email: 'hello@veltrion.com',
  phone: '',
  address: '',
  social_links: [],
  footer_legal: 'Software & Digital Technology.',
};

export const DEFAULT_BLOCKS: TextBlock[] = [
  {
    key: 'meta.home.title',
    page: 'meta',
    label: 'Home — browser tab & share preview title',
    value: 'VELTRION — Software & Digital Technology',
  },
  {
    key: 'meta.home.description',
    page: 'meta',
    label: 'Home — share preview description',
    value: "Websites, software, business systems, design, marketing and support. Engineered for What's Next.",
  },
  {
    key: 'meta.about.title',
    page: 'meta',
    label: 'About Us — title',
    value: 'About Us — VELTRION',
  },
  {
    key: 'meta.about.description',
    page: 'meta',
    label: 'About Us — description',
    value: 'Our vision, mission, process and the people behind VELTRION.',
  },
  {
    key: 'meta.work.title',
    page: 'meta',
    label: 'Our Work — title',
    value: 'Our Work — VELTRION',
  },
  {
    key: 'meta.work.description',
    page: 'meta',
    label: 'Our Work — description',
    value: 'Businesses, organizations and individuals we build digital tools for.',
  },
  {
    key: 'meta.download.title',
    page: 'meta',
    label: 'Download — title',
    value: 'Download — VELTRION',
  },
  {
    key: 'meta.download.description',
    page: 'meta',
    label: 'Download — description',
    value: 'Apps and digital tools built by VELTRION.',
  },
  {
    key: 'meta.contact.title',
    page: 'meta',
    label: 'Contacts — title',
    value: 'Contact — VELTRION',
  },
  {
    key: 'meta.contact.description',
    page: 'meta',
    label: 'Contacts — description',
    value: 'Tell us what you need. We reply with a clear scope and a clear price.',
  },
  {
    key: 'home.hero.headline',
    page: 'home',
    label: 'Hero — headline',
    value: "Engineered for What's Next.",
  },
  {
    key: 'home.hero.subline',
    page: 'home',
    label: 'Hero — supporting line',
    value: 'Websites, software, business systems, design, marketing and support.',
  },
  {
    key: 'home.hero.cta_primary',
    page: 'home',
    label: 'Hero — primary button',
    value: 'See our work',
  },
  {
    key: 'home.hero.cta_secondary',
    page: 'home',
    label: 'Hero — secondary button',
    value: 'Contact us',
  },
  {
    key: 'home.hero.image',
    page: 'home',
    label: 'Hero image URL (upload to Media and paste the public URL — leave empty to show the logo mark)',
    value: '',
  },
  {
    key: 'services.title',
    page: 'home',
    label: 'Services — section heading',
    value: 'What we do.',
  },
  {
    key: 'services.subtitle',
    page: 'home',
    label: 'Services — supporting line',
    value: 'Practical digital solutions that are easy to use and dependable.',
  },
  {
    key: 'process.title',
    page: 'home',
    label: 'Process — section heading',
    value: 'How we work.',
  },
  {
    key: 'process.subtitle',
    page: 'home',
    label: 'Process — supporting line',
    value: 'Four steps, from first conversation to long-term care.',
  },
  {
    key: 'why.title',
    page: 'home',
    label: 'Why — section heading',
    value: 'Why Veltrion.',
  },
  {
    key: 'why.statement',
    page: 'home',
    label: 'Why — big statement line',
    value: 'Precision. Reliability. Simplicity. Professionalism.',
  },
  {
    key: 'about.intro',
    page: 'about',
    label: 'About — opening paragraph',
    value:
      'VELTRION is a technology company. We provide websites, software and digital services for businesses, organizations and individuals — practical solutions that are easy to use and dependable.',
  },
  {
    key: 'about.vision_title',
    page: 'about',
    label: 'Vision — title',
    value: 'Reliable and accessible software for every business.',
  },
  {
    key: 'about.vision_text',
    page: 'about',
    label: 'Vision — paragraph',
    value:
      'To build reliable, modern and accessible software solutions that help businesses grow and operate digitally.',
  },
  {
    key: 'about.mission_title',
    page: 'about',
    label: 'Mission — title',
    value: 'Technology with a human touch.',
  },
  {
    key: 'about.mission_text',
    page: 'about',
    label: 'Mission — paragraph',
    value:
      'To combine technology, creativity and business understanding to develop practical digital products for modern organizations.',
  },
  {
    key: 'about.team_title',
    page: 'about',
    label: 'Team — section heading',
    value: 'Our team.',
  },
  {
    key: 'about.org_note',
    page: 'about',
    label: 'Team — organization note',
    value:
      'The Chairman leads the company. Marketing, Design and Business teams handle daily work, while the Legal Advisor guides independently.',
  },
  {
    key: 'about.who_title',
    page: 'about',
    label: 'Who we work with — heading',
    value: 'Who we work with.',
  },
  {
    key: 'about.who_text',
    page: 'about',
    label: 'Who we work with — paragraph',
    value:
      'Shops, offices, organizations and individuals: anyone who wants reliable, easy-to-use digital tools. We agree the scope and the price up front, keep you updated with regular progress, and deliver on time.',
  },
  {
    key: 'work.title',
    page: 'work',
    label: 'Our Work — page heading',
    value: 'Our work.',
  },
  {
    key: 'work.subtitle',
    page: 'work',
    label: 'Our Work — supporting line',
    value:
      'Businesses, organizations and individuals we build for — and what they say about working with us.',
  },
  {
    key: 'work.empty_title',
    page: 'work',
    label: 'Our Work — empty state heading',
    value: 'New projects are on the way.',
  },
  {
    key: 'work.empty_text',
    page: 'work',
    label: 'Our Work — empty state text',
    value:
      'We are putting together the stories of the businesses we build for. Ask us directly and we will show you relevant work.',
  },
  {
    key: 'download.title',
    page: 'download',
    label: 'Download — page heading',
    value: 'Download.',
  },
  {
    key: 'download.subtitle',
    page: 'download',
    label: 'Download — supporting line',
    value: 'Apps and digital tools built by VELTRION.',
  },
  {
    key: 'download.empty_title',
    page: 'download',
    label: 'Download — empty state heading',
    value: 'Our first releases are being prepared.',
  },
  {
    key: 'download.empty_text',
    page: 'download',
    label: 'Download — empty state text',
    value:
      'New tools for everyday business work are coming. Get in touch if you need something built for your business now.',
  },
  {
    key: 'contact.title',
    page: 'contact',
    label: 'Contacts — page heading',
    value: 'Contact us.',
  },
  {
    key: 'contact.subtitle',
    page: 'contact',
    label: 'Contacts — supporting line',
    value: 'Tell us what you need. We reply with a clear scope and a clear price.',
  },
  {
    key: 'contact.form_note',
    page: 'contact',
    label: 'Contacts — form note',
    value: 'We usually reply within one working day.',
  },
];

const nav = (label: string, href: string, order: number): NavItem => ({
  id: `nav-${href}`,
  label,
  href,
  position: 'nav',
  group: 'main',
  sort_order: order,
  published: true,
});

export const DEFAULT_NAV: NavItem[] = [
  nav('Home', '/', 10),
  nav('About Us', '/about', 20),
  nav('Our Work', '/our-work', 30),
  nav('Download', '/download', 40),
  nav('Contacts', '/contact', 50),
];

export const DEFAULT_SERVICES: Service[] = [
  { id: 's1', title: 'Business Websites', description: 'Professional websites that build trust and bring enquiries.', sort_order: 10, published: true },
  { id: 's2', title: 'Custom Software', description: 'Software made for your exact business needs.', sort_order: 20, published: true },
  { id: 's3', title: 'Web Applications', description: 'Online booking, billing, customer portals and more.', sort_order: 30, published: true },
  { id: 's4', title: 'Records & Database', description: 'Safe, organized records and easy reports.', sort_order: 40, published: true },
  { id: 's5', title: 'Business Management System', description: 'Sales, stock, staff and accounts in one place.', sort_order: 50, published: true },
  { id: 's6', title: 'Marketing & Promotion', description: 'Get found on Google and social media.', sort_order: 60, published: true },
  { id: 's7', title: 'Support & Hosting', description: 'We look after your website and software for you.', sort_order: 70, published: true },
];

export const DEFAULT_PROCESS: ProcessStep[] = [
  { id: 'p1', title: 'Plan', description: 'We understand your needs and agree a clear scope.', sort_order: 10, published: true },
  { id: 'p2', title: 'We design', description: 'See a preview and request changes until you are happy.', sort_order: 20, published: true },
  { id: 'p3', title: 'We build & launch', description: 'We develop, test and launch your website or system.', sort_order: 30, published: true },
  { id: 'p4', title: 'We support', description: 'Ongoing care and promotion after launch.', sort_order: 40, published: true },
];

export const DEFAULT_PROCESS_BULLETS: ContentBullet[] = [
  { id: 'b1', group_key: 'process.get', text: 'Clear scope and pricing agreed up front', sort_order: 10, published: true },
  { id: 'b2', group_key: 'process.get', text: 'On-time delivery with regular updates', sort_order: 20, published: true },
  { id: 'b3', group_key: 'process.get', text: 'Support after launch: updates and backups', sort_order: 30, published: true },
];

export const DEFAULT_WHY: WhyPoint[] = [
  {
    id: 'w1',
    title: 'Business-first approach',
    description: 'We understand shops, offices and organizations, so we suggest only what you need.',
    sort_order: 10,
    published: true,
  },
  {
    id: 'w2',
    title: 'On-time delivery',
    description: 'A clear timeline and regular updates throughout the project.',
    sort_order: 20,
    published: true,
  },
  {
    id: 'w3',
    title: 'Long-term care',
    description: 'After launch we stay with you — updates, backups and help whenever needed.',
    sort_order: 30,
    published: true,
  },
];

export const DEFAULT_TEAM: TeamMember[] = [
  { id: 't1', initials: 'AP', name: 'Awishkar Pandit', role: 'Chairman & Lead Developer', bio: 'Leads the company and oversees all software development and quality.', photo_url: '', sort_order: 10, published: true },
  { id: 't2', initials: 'AB', name: 'Abhinav Basnet', role: 'Lead Marketing Agent', bio: 'Looks after marketing, promotion and bringing new clients.', photo_url: '', sort_order: 20, published: true },
  { id: 't3', initials: 'SB', name: 'Sakshyam Basnet', role: 'Lead Creative Designer', bio: 'Handles branding, graphics and creative design work.', photo_url: '', sort_order: 30, published: true },
  { id: 't4', initials: 'PS', name: 'Pranjal Sharma', role: 'Business Manager', bio: 'Manages daily operations, clients and project delivery.', photo_url: '', sort_order: 40, published: true },
  { id: 't5', initials: 'LB', name: 'Laxmi Bhandari', role: 'Legal Advisor', bio: 'Provides legal guidance and ensures proper business practice.', photo_url: '', sort_order: 50, published: true },
];

export const DEFAULT_PROJECTS: Project[] = [];

export const DEFAULT_DOWNLOADS: DownloadItem[] = [];

const section = (page: string, key: string, label: string, order: number): PageSection => ({
  id: `${page}.${key}`,
  page,
  label,
  section_key: key,
  visible: true,
  sort_order: order,
});

export const DEFAULT_PAGE_SECTIONS: PageSection[] = [
  section('home', 'hero', 'Hero', 10),
  section('home', 'services', 'Services', 20),
  section('home', 'process', 'Process', 30),
  section('home', 'why', 'Why Veltrion', 40),
  section('about', 'intro', 'Intro', 10),
  section('about', 'vision', 'Vision & Mission', 20),
  section('about', 'team', 'Team', 30),
  section('about', 'who', 'Who we work with', 40),
  section('work', 'projects', 'Projects', 10),
  section('download', 'downloads', 'Downloads', 10),
  section('contact', 'details', 'Contact details', 10),
  section('contact', 'form', 'Contact form', 20),
];

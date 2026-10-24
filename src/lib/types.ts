// Shared DB row types — used by both the public site and the admin.

export type ThemeName = 'light' | 'dark';
export type ThemeDefault = ThemeName | 'system';

export interface SocialLink {
  label: string;
  url: string;
}

export interface SiteSettings {
  id: number;
  brand_name: string;
  tagline: string;
  industry: string;
  default_theme: ThemeDefault;
  contact_email: string;
  phone: string;
  address: string;
  social_links: SocialLink[];
  footer_legal: string;
}

export type NavPosition = 'nav' | 'footer';

export interface NavItem {
  id: string;
  label: string;
  href: string;
  position: NavPosition;
  group: string;
  sort_order: number;
  published: boolean;
}

export interface TextBlock {
  key: string;
  page: string;
  label: string;
  value: string;
}

export interface Service {
  id: string;
  title: string;
  description: string;
  sort_order: number;
  published: boolean;
}

export interface ProcessStep {
  id: string;
  title: string;
  description: string;
  sort_order: number;
  published: boolean;
}

export interface WhyPoint {
  id: string;
  title: string;
  description: string;
  sort_order: number;
  published: boolean;
}

export interface TeamMember {
  id: string;
  initials: string;
  name: string;
  role: string;
  bio: string;
  photo_url: string;
  sort_order: number;
  published: boolean;
}

export interface Project {
  id: string;
  client_name: string;
  logo_url: string;
  image_url: string;
  site_url: string;
  description: string;
  tech_tags: string[];
  review_quote: string;
  review_author: string;
  review_role: string;
  sort_order: number;
  published: boolean;
}

export interface DownloadItem {
  id: string;
  name: string;
  cover_url: string;
  short_desc: string;
  long_desc: string;
  platforms: string[];
  version: string;
  size: string;
  download_url: string;
  featured: boolean;
  sort_order: number;
  published: boolean;
}

export interface ContentBullet {
  id: string;
  group_key: string;
  text: string;
  sort_order: number;
  published: boolean;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  read: boolean;
  created_at: string;
}

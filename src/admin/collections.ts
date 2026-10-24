// Declarative collection definitions for the admin editors.
// Adding a table here makes it editable — no new components needed.

export type FieldType =
  | 'text'
  | 'textarea'
  | 'url'
  | 'image'
  | 'boolean'
  | 'tags'
  | 'number'
  | 'select'
  | 'social-pairs';

export interface FieldDef {
  name: string;
  label: string;
  type: FieldType;
  options?: string[];
  help?: string;
}

export interface CollectionDef {
  table: string;
  label: string;
  singular: string;
  titleField: string;
  subField?: string;
  hasPublished: boolean;
  fields: FieldDef[];
}

export const COLLECTIONS: Record<string, CollectionDef> = {
  services: {
    table: 'services',
    label: 'Services',
    singular: 'service',
    titleField: 'title',
    subField: 'description',
    hasPublished: true,
    fields: [
      { name: 'title', label: 'Title', type: 'text' },
      { name: 'description', label: 'Description', type: 'textarea' },
      { name: 'sort_order', label: 'Sort order', type: 'number', help: 'Lower numbers appear first.' },
      { name: 'published', label: 'Published', type: 'boolean' },
    ],
  },
  process: {
    table: 'process_steps',
    label: 'Process steps',
    singular: 'step',
    titleField: 'title',
    subField: 'description',
    hasPublished: true,
    fields: [
      { name: 'title', label: 'Title', type: 'text' },
      { name: 'description', label: 'Description', type: 'textarea' },
      { name: 'sort_order', label: 'Sort order', type: 'number' },
      { name: 'published', label: 'Published', type: 'boolean' },
    ],
  },
  why: {
    table: 'why_points',
    label: 'Why Veltrion points',
    singular: 'point',
    titleField: 'title',
    subField: 'description',
    hasPublished: true,
    fields: [
      { name: 'title', label: 'Title', type: 'text' },
      { name: 'description', label: 'Description', type: 'textarea' },
      { name: 'sort_order', label: 'Sort order', type: 'number' },
      { name: 'published', label: 'Published', type: 'boolean' },
    ],
  },
  bullets: {
    table: 'content_bullets',
    label: 'Bullet lists',
    singular: 'bullet',
    titleField: 'text',
    subField: 'group_key',
    hasPublished: true,
    fields: [
      { name: 'group_key', label: 'List group', type: 'text', help: 'e.g. process.get — bullets with the same group appear together.' },
      { name: 'text', label: 'Text', type: 'textarea' },
      { name: 'sort_order', label: 'Sort order', type: 'number' },
      { name: 'published', label: 'Published', type: 'boolean' },
    ],
  },
  team: {
    table: 'team_members',
    label: 'Team',
    singular: 'member',
    titleField: 'name',
    subField: 'role',
    hasPublished: true,
    fields: [
      { name: 'name', label: 'Full name', type: 'text' },
      { name: 'initials', label: 'Initials', type: 'text', help: 'Shown in the circle when no photo is set.' },
      { name: 'role', label: 'Role', type: 'text' },
      { name: 'bio', label: 'Bio', type: 'textarea' },
      { name: 'photo_url', label: 'Photo', type: 'image' },
      { name: 'sort_order', label: 'Sort order', type: 'number' },
      { name: 'published', label: 'Published', type: 'boolean' },
    ],
  },
  projects: {
    table: 'projects',
    label: 'Our Work',
    singular: 'project',
    titleField: 'client_name',
    subField: 'description',
    hasPublished: true,
    fields: [
      { name: 'client_name', label: 'Client / person name', type: 'text' },
      { name: 'description', label: 'Short description', type: 'textarea' },
      { name: 'image_url', label: 'Screenshot / main image', type: 'image' },
      { name: 'logo_url', label: 'Client logo', type: 'image' },
      { name: 'site_url', label: 'Link to their site', type: 'url' },
      { name: 'tech_tags', label: 'Tech used', type: 'tags', help: 'One per line, e.g. Website, Booking system.' },
      { name: 'review_quote', label: 'Review — quote', type: 'textarea' },
      { name: 'review_author', label: 'Review — author', type: 'text' },
      { name: 'review_role', label: 'Review — author role', type: 'text' },
      { name: 'sort_order', label: 'Sort order', type: 'number' },
      { name: 'published', label: 'Published', type: 'boolean' },
    ],
  },
  downloads: {
    table: 'downloads',
    label: 'Downloads',
    singular: 'app',
    titleField: 'name',
    subField: 'short_desc',
    hasPublished: true,
    fields: [
      { name: 'name', label: 'App / tool name', type: 'text' },
      { name: 'short_desc', label: 'Short description', type: 'textarea' },
      { name: 'long_desc', label: 'Long description', type: 'textarea' },
      { name: 'cover_url', label: 'Cover image', type: 'image' },
      { name: 'download_url', label: 'Download link', type: 'url', help: 'External link: Drive, Play Store, GitHub…' },
      { name: 'platforms', label: 'Platforms', type: 'tags', help: 'One per line: Web, Windows, Android…' },
      { name: 'version', label: 'Version', type: 'text' },
      { name: 'size', label: 'Size', type: 'text', help: 'e.g. 12 MB' },
      { name: 'featured', label: 'Featured (shown first)', type: 'boolean' },
      { name: 'sort_order', label: 'Sort order', type: 'number' },
      { name: 'published', label: 'Published', type: 'boolean' },
    ],
  },
  navigation: {
    table: 'navigation_items',
    label: 'Navigation & footer',
    singular: 'link',
    titleField: 'label',
    subField: 'href',
    hasPublished: true,
    fields: [
      { name: 'label', label: 'Label', type: 'text' },
      { name: 'href', label: 'Link', type: 'text', help: 'Internal path (/about) or full URL (https://…).' },
      {
        name: 'position',
        label: 'Show in',
        type: 'select',
        options: ['nav', 'footer'],
      },
      { name: 'group', label: 'Footer column', type: 'text', help: 'Footer links are grouped by this name.' },
      { name: 'sort_order', label: 'Sort order', type: 'number' },
      { name: 'published', label: 'Published', type: 'boolean' },
    ],
  },
  settings: {
    table: 'site_settings',
    label: 'Site settings',
    singular: 'setting',
    titleField: 'brand_name',
    hasPublished: false,
    fields: [
      { name: 'brand_name', label: 'Brand name', type: 'text' },
      { name: 'tagline', label: 'Tagline', type: 'text' },
      { name: 'industry', label: 'Industry line', type: 'text' },
      {
        name: 'default_theme',
        label: 'Default theme for first-time visitors',
        type: 'select',
        options: ['system', 'light', 'dark'],
      },
      { name: 'contact_email', label: 'Contact email', type: 'text' },
      { name: 'phone', label: 'Phone', type: 'text' },
      { name: 'address', label: 'Address', type: 'textarea' },
      { name: 'social_links', label: 'Social links', type: 'social-pairs', help: 'One per line: Label | https://url' },
      { name: 'footer_legal', label: 'Footer legal line', type: 'text' },
    ],
  },
};

export const COLLECTION_KEYS = Object.keys(COLLECTIONS);

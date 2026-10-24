// Typed content loaders. Every public page reads from here — never from
// hardcoded copy. Each loader queries Supabase when configured and falls back
// to the seeded defaults so the site renders before/without a database.

import { getSupabase } from './supabase';
import {
  DEFAULT_BLOCKS,
  DEFAULT_DOWNLOADS,
  DEFAULT_NAV,
  DEFAULT_PROCESS,
  DEFAULT_PROCESS_BULLETS,
  DEFAULT_PROJECTS,
  DEFAULT_SERVICES,
  DEFAULT_SETTINGS,
  DEFAULT_TEAM,
  DEFAULT_WHY,
} from './defaultContent';
import type {
  ContentBullet,
  DownloadItem,
  NavItem,
  ProcessStep,
  Project,
  Service,
  SiteSettings,
  TeamMember,
  TextBlock,
  WhyPoint,
} from './types';

const cache = new Map<string, unknown>();

export function invalidateContent(): void {
  cache.clear();
}

async function cached<T>(key: string, load: () => Promise<T>, fallback: T): Promise<T> {
  if (cache.has(key)) return cache.get(key) as T;
  let value = fallback;
  const supabase = getSupabase();
  if (supabase) {
    try {
      value = await load();
    } catch (err) {
      console.warn(`[content] ${key} failed, using defaults`, err);
    }
  }
  cache.set(key, value);
  return value;
}

/** Await a Supabase query, throwing on error so cached() can fall back. */
async function select<T>(query: PromiseLike<{ data: unknown; error: { message: string } | null }>, fallback: T): Promise<T> {
  const { data, error } = await query;
  if (error) throw new Error(error.message);
  return (data as T) ?? fallback;
}

const bySort = <T extends { sort_order: number }>(rows: T[]): T[] =>
  [...rows].sort((a, b) => a.sort_order - b.sort_order);

// ---------------------------------------------------------------------------
// Loaders
// ---------------------------------------------------------------------------

export function getSettings(): Promise<SiteSettings> {
  return cached(
    'settings',
    async () => {
      const supabase = getSupabase()!;
      return select(supabase.from('site_settings').select('*').eq('id', 1).maybeSingle(), DEFAULT_SETTINGS);
    },
    DEFAULT_SETTINGS,
  );
}

export function getTextBlocks(): Promise<Record<string, string>> {
  return cached(
    'blocks',
    async () => {
      const supabase = getSupabase()!;
      const rows = await select<TextBlock[]>(supabase.from('text_blocks').select('*'), []);
      return { ...blocksToMap(DEFAULT_BLOCKS), ...blocksToMap(rows) };
    },
    blocksToMap(DEFAULT_BLOCKS),
  );
}

function blocksToMap(rows: TextBlock[]): Record<string, string> {
  const map: Record<string, string> = {};
  for (const row of rows) map[row.key] = row.value;
  return map;
}

export function getNavItems(position: 'nav' | 'footer'): Promise<NavItem[]> {
  return cached(
    `nav-${position}`,
    async () => {
      const supabase = getSupabase()!;
      const rows = await select<NavItem[]>(
        supabase.from('navigation_items').select('*').eq('position', position).order('sort_order'),
        [],
      );
      return bySort(rows);
    },
    position === 'nav' ? DEFAULT_NAV : [],
  );
}

export function getServices(): Promise<Service[]> {
  return cached(
    'services',
    async () => {
      const supabase = getSupabase()!;
      return bySort(await select<Service[]>(supabase.from('services').select('*').order('sort_order'), []));
    },
    DEFAULT_SERVICES,
  );
}

export function getProcess(): Promise<ProcessStep[]> {
  return cached(
    'process',
    async () => {
      const supabase = getSupabase()!;
      return bySort(await select<ProcessStep[]>(supabase.from('process_steps').select('*').order('sort_order'), []));
    },
    DEFAULT_PROCESS,
  );
}

export function getProcessBullets(): Promise<ContentBullet[]> {
  return cached(
    'bullets-process.get',
    async () => {
      const supabase = getSupabase()!;
      return bySort(
        await select<ContentBullet[]>(
          supabase.from('content_bullets').select('*').eq('group_key', 'process.get').order('sort_order'),
          [],
        ),
      );
    },
    DEFAULT_PROCESS_BULLETS,
  );
}

export function getWhyPoints(): Promise<WhyPoint[]> {
  return cached(
    'why',
    async () => {
      const supabase = getSupabase()!;
      return bySort(await select<WhyPoint[]>(supabase.from('why_points').select('*').order('sort_order'), []));
    },
    DEFAULT_WHY,
  );
}

export function getTeam(): Promise<TeamMember[]> {
  return cached(
    'team',
    async () => {
      const supabase = getSupabase()!;
      return bySort(await select<TeamMember[]>(supabase.from('team_members').select('*').order('sort_order'), []));
    },
    DEFAULT_TEAM,
  );
}

export function getProjects(): Promise<Project[]> {
  return cached(
    'projects',
    async () => {
      const supabase = getSupabase()!;
      return bySort(await select<Project[]>(supabase.from('projects').select('*').order('sort_order'), []));
    },
    DEFAULT_PROJECTS,
  );
}

export function getDownloads(): Promise<DownloadItem[]> {
  return cached(
    'downloads',
    async () => {
      const supabase = getSupabase()!;
      return bySort(await select<DownloadItem[]>(supabase.from('downloads').select('*').order('sort_order'), []));
    },
    DEFAULT_DOWNLOADS,
  );
}

import type { SupabaseClient } from '@supabase/supabase-js';
import { getSupabase, MEDIA_BUCKET } from '../lib/supabase';
import { invalidateContent } from '../lib/content';
import type { ContactMessage } from '../lib/types';

export type Row = Record<string, any>;

export function requireClient(): SupabaseClient {
  const supabase = getSupabase();
  if (!supabase) throw new Error('Supabase is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your environment.');
  return supabase;
}

/** Clear the public content cache after any write so the site reflects it immediately. */
export function touchContent(): void {
  invalidateContent();
}

// ---------------------------------------------------------------------------
// Generic CRUD
// ---------------------------------------------------------------------------

export async function fetchAll(table: string, order = 'sort_order'): Promise<Row[]> {
  const supabase = requireClient();
  const { data, error } = await supabase.from(table).select('*').order(order);
  if (error) throw error;
  return (data as Row[]) ?? [];
}

export async function fetchOne(table: string, id: string): Promise<Row | null> {
  const supabase = requireClient();
  const { data, error } = await supabase.from(table).select('*').eq('id', id).maybeSingle();
  if (error) throw error;
  return data as Row | null;
}

export async function insertRow(table: string, values: Row): Promise<void> {
  const supabase = requireClient();
  const { error } = await supabase.from(table).insert(values);
  if (error) throw error;
  touchContent();
}

export async function updateRow(table: string, id: string, values: Row): Promise<void> {
  const supabase = requireClient();
  const { error } = await supabase.from(table).update(values).eq('id', id);
  if (error) throw error;
  touchContent();
}

export async function deleteRow(table: string, id: string): Promise<void> {
  const supabase = requireClient();
  const { error } = await supabase.from(table).delete().eq('id', id);
  if (error) throw error;
  touchContent();
}

// ---------------------------------------------------------------------------
// Messages inbox
// ---------------------------------------------------------------------------

export async function fetchMessages(): Promise<ContactMessage[]> {
  const supabase = requireClient();
  const { data, error } = await supabase
    .from('contact_messages')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return (data as ContactMessage[]) ?? [];
}

export async function setMessageRead(id: string, read: boolean): Promise<void> {
  const supabase = requireClient();
  const { error } = await supabase.from('contact_messages').update({ read }).eq('id', id);
  if (error) throw error;
}

export async function removeMessage(id: string): Promise<void> {
  const supabase = requireClient();
  const { error } = await supabase.from('contact_messages').delete().eq('id', id);
  if (error) throw error;
}

// ---------------------------------------------------------------------------
// Media (Supabase Storage, public "media" bucket)
// ---------------------------------------------------------------------------

export interface MediaFile {
  name: string;
  url: string;
  created_at?: string;
}

export function publicUrlFor(name: string): string {
  return requireClient().storage.from(MEDIA_BUCKET).getPublicUrl(name).data.publicUrl;
}

export async function listMedia(): Promise<MediaFile[]> {
  const supabase = requireClient();
  const { data, error } = await supabase.storage.from(MEDIA_BUCKET).list('', { limit: 200, sortBy: { column: 'created_at', order: 'desc' } });
  if (error) throw error;
  return (data ?? [])
    .filter((entry) => entry.id) // skip folder markers
    .map((entry) => ({
      name: entry.name,
      url: publicUrlFor(entry.name),
      created_at: entry.created_at ?? undefined,
    }));
}

export async function uploadMedia(file: File): Promise<MediaFile> {
  const supabase = requireClient();
  const ext = file.name.split('.').pop()?.toLowerCase() ?? 'png';
  const path = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, '-')}.${ext}`;
  const { error } = await supabase.storage.from(MEDIA_BUCKET).upload(path, file, {
    cacheControl: '31536000',
    upsert: false,
  });
  if (error) throw error;
  return { name: path, url: publicUrlFor(path) };
}

export async function deleteMedia(name: string): Promise<void> {
  const supabase = requireClient();
  const { error } = await supabase.storage.from(MEDIA_BUCKET).remove([name]);
  if (error) throw error;
}

// ---------------------------------------------------------------------------
// Settings helpers (jsonb social links <-> textarea lines)
// ---------------------------------------------------------------------------

export function socialLinesToString(links: { label: string; url: string }[] | null | undefined): string {
  return (links ?? []).map((link) => `${link.label} | ${link.url}`).join('\n');
}

export function socialStringToLinks(text: string): { label: string; url: string }[] {
  return text
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [label, url] = line.split('|').map((part) => part.trim());
      return { label: label ?? '', url: url ?? '' };
    })
    .filter((link) => link.label && link.url);
}

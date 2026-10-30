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
// Access (who is allowed to write) + error translation
// ---------------------------------------------------------------------------

export interface AccessInfo {
  /** The signed-in user is on the admin_users list. */
  isAdmin: boolean;
  /** Total admins, or null when unknown. */
  adminCount: number | null;
}

/**
 * Ask the database who can edit. Calls the `admin_access_check` RPC from
 * 0006_admin_access.sql — returns null if that migration wasn't run yet.
 */
export async function checkAccess(): Promise<AccessInfo | null> {
  const supabase = requireClient();
  const { data, error } = await supabase.rpc('admin_access_check');
  if (error) {
    // Missing RPC = migration 0006 not applied yet; callers treat null as "unknown".
    if (isMissingRpc(error)) return null;
    throw error;
  }
  const row = (Array.isArray(data) ? data[0] : data) as
    | { is_admin?: boolean | string; admin_count?: number | string }
    | undefined;
  if (!row) return null;
  return {
    isAdmin: row.is_admin === true || row.is_admin === 'true',
    adminCount: row.admin_count == null ? null : Number(row.admin_count),
  };
}

/**
 * One-click fix for "signed in but nothing saves": claims admin ownership
 * with the `claim_admin` RPC (0006). Only works while NO admin exists —
 * the first signed-in account claims it, later accounts must be promoted
 * from SQL (the Dashboard shows the snippet). Returns:
 *   true  → claimed / was already admin
 *   false → claimed blocked because an admin already exists
 *   null  → RPC missing (0006 not run)
 */
export async function claimAdmin(): Promise<boolean | null> {
  const supabase = requireClient();
  const { data, error } = await supabase.rpc('claim_admin');
  if (error) {
    if (isMissingRpc(error)) return null;
    throw error;
  }
  return Boolean(data);
}

function isMissingRpc(err: { code?: string; message?: string }): boolean {
  return err.code === 'PGRST202' || /function .* is not defined|Could not find the function/i.test(err.message ?? '');
}

/**
 * Translate scary PostgREST/RLS errors into what they actually mean for
 * this admin. RLS blocks are the classic "nothing saves" case: Supabase
 * returns success with 0 rows for updates the policy filters out.
 */
export function friendlyDbError(err: unknown): string {
  const e = err as { code?: string; message?: string } | undefined;
  const code = e?.code ?? '';
  const msg = e?.message ?? String(err ?? 'Something went wrong.');

  if (code === '42501' || /row-level security/i.test(msg)) {
    return "Blocked — this account doesn't have write access. Use Fix access above, or sign in with the admin account.";
  }
  if (code === '401' || code === 'PGRST301' || /jwt|session expired/i.test(msg)) {
    return 'Your session expired — sign out and back in.';
  }
  if (code === 'PGRST205' || /does not exist in the schema cache|Could not find the table/i.test(msg)) {
    return 'A table is missing from the database — run the pending migration file(s) in supabase/migrations/ in the Supabase SQL editor.';
  }
  if (code.startsWith('23')) {
    return 'The database rejected these values — check required fields and formats.';
  }
  return msg;
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

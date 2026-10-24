import type { ReactNode } from 'react';
import { useAsync } from '../../lib/hooks';
import { getPageSections } from '../../lib/content';

interface PageSectionsProps {
  /** Which page's section config to load ('home' | 'about' | ...). */
  page: string;
  /** Map of section_key -> rendered content. Only visible+configured ones show. */
  sections: Record<string, ReactNode>;
}

/**
 * Renders a page's sections in the admin-defined order, skipping any that are
 * hidden. If a section exists in code but has no config row yet, it still
 * renders (appended in its default position) so nothing disappears by accident.
 */
export default function PageSections({ page, sections }: PageSectionsProps) {
  const { data: config } = useAsync(() => getPageSections(page), [page]);

  // No config loaded yet (or empty): render everything in the given order.
  const rows = config ?? [];

  const ordered: ReactNode[] = [];
  const seen = new Set<string>();

  for (const row of rows) {
    if (!row.visible) {
      seen.add(row.section_key);
      continue;
    }
    const node = sections[row.section_key];
    if (node) {
      ordered.push(<div key={row.id}>{node}</div>);
      seen.add(row.section_key);
    }
  }

  // Append any unconfigured sections (defensive — keeps code sections visible).
  for (const [key, node] of Object.entries(sections)) {
    if (!seen.has(key)) ordered.push(<div key={`auto-${key}`}>{node}</div>);
  }

  return <>{ordered}</>;
}

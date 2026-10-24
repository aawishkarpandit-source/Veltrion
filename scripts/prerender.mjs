// Build-time prerender: writes one static index.html per route with
// DB-derived title/meta/OG tags, plus sitemap.xml and robots.txt.
// Runs after `vite build`. Falls back to defaults if Supabase is unreachable.

import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const dist = join(root, 'dist');

const SITE_URL = (process.env.SITE_URL || 'https://veltrion.vercel.app').replace(/\/$/, '');

const ROUTES = [
  { path: '/', block: 'meta.home' },
  { path: '/about', block: 'meta.about' },
  { path: '/our-work', block: 'meta.work' },
  { path: '/download', block: 'meta.download' },
  { path: '/contact', block: 'meta.contact' },
];

const FALLBACK_TITLES = {
  'meta.home': {
    title: 'VELTRION — Software & Digital Technology',
    description:
      "Websites, software, business systems, design, marketing and support. Engineered for What's Next.",
  },
  'meta.about': {
    title: 'About Us — VELTRION',
    description: 'Our vision, mission, process and the people behind VELTRION.',
  },
  'meta.work': {
    title: 'Our Work — VELTRION',
    description: 'Businesses, organizations and individuals we build digital tools for.',
  },
  'meta.download': {
    title: 'Download — VELTRION',
    description: 'Apps and digital tools built by VELTRION.',
  },
  'meta.contact': {
    title: 'Contact — VELTRION',
    description: 'Tell us what you need. We reply with a clear scope and a clear price.',
  },
};

async function fetchTextBlocks() {
  const url = process.env.VITE_SUPABASE_URL;
  const key = process.env.VITE_SUPABASE_ANON_KEY;
  if (!url || !key) return {};
  try {
    const res = await fetch(`${url}/rest/v1/text_blocks?select=key,value`, {
      headers: { apikey: key, Authorization: `Bearer ${key}` },
    });
    if (!res.ok) throw new Error(`Supabase responded ${res.status}`);
    const rows = await res.json();
    const map = {};
    for (const row of rows) map[row.key] = row.value;
    return map;
  } catch (err) {
    console.warn(`[prerender] text_blocks unavailable (${err.message}) — using default meta.`);
    return {};
  }
}

async function fetchLatestUpdated() {
  const url = process.env.VITE_SUPABASE_URL;
  const key = process.env.VITE_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  try {
    const res = await fetch(`${url}/rest/v1/text_blocks?select=updated_at&order=updated_at.desc&limit=1`, {
      headers: { apikey: key, Authorization: `Bearer ${key}` },
    });
    if (!res.ok) return null;
    const rows = await res.json();
    return rows[0]?.updated_at ?? null;
  } catch {
    return null;
  }
}

function escapeHtml(text) {
  return text
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
}

function replaceTag(html, tag, attr, name, content) {
  const pattern = new RegExp(`<${tag}[^>]*${attr}=["']${name}["'][^>]*>`, 'i');
  const replacement = `<${tag} ${attr}="${name}" content="${escapeHtml(content)}" />`;
  if (pattern.test(html)) return html.replace(pattern, replacement);
  // Not present — inject before </head>.
  return html.replace('</head>', `  ${replacement}\n  </head>`);
}

function replaceTitle(html, title) {
  if (/<title>[\s\S]*?<\/title>/i.test(html)) return html.replace(/<title>[\s\S]*?<\/title>/i, `<title>${escapeHtml(title)}</title>`);
  return html.replace('</head>', `  <title>${escapeHtml(title)}</title>\n  </head>`);
}

async function main() {
  const shellPath = join(dist, 'index.html');
  if (!existsSync(shellPath)) {
    console.error('[prerender] dist/index.html not found — run vite build first.');
    process.exit(1);
  }

  const shell = readFileSync(shellPath, 'utf8');
  const blocks = await fetchTextBlocks();

  for (const route of ROUTES) {
    const meta = {
      title: blocks[`${route.block}.title`] || FALLBACK_TITLES[route.block].title,
      description: blocks[`${route.block}.description`] || FALLBACK_TITLES[route.block].description,
    };
    const absUrl = route.path === '/' ? SITE_URL : `${SITE_URL}${route.path}`;
    const ogImage = `${SITE_URL}/og.png`;

    let html = replaceTitle(shell, meta.title);
    html = replaceTag(html, 'meta', 'name', 'description', meta.description);
    html = replaceTag(html, 'meta', 'property', 'og:title', meta.title);
    html = replaceTag(html, 'meta', 'property', 'og:description', meta.description);
    html = replaceTag(html, 'meta', 'property', 'og:image', ogImage);
    html = replaceTag(html, 'meta', 'name', 'twitter:title', meta.title);
    html = replaceTag(html, 'meta', 'name', 'twitter:description', meta.description);
    html = replaceTag(html, 'meta', 'name', 'twitter:image', ogImage);
    // Canonical link
    if (!/<link[^>]*rel=["']canonical["']/i.test(html)) {
      html = html.replace('</head>', `  <link rel="canonical" href="${absUrl}" />\n  </head>`);
    } else {
      html = html.replace(/<link[^>]*rel=["']canonical["'][^>]*>/i, `<link rel="canonical" href="${absUrl}" />`);
    }

    const outDir = route.path === '/' ? dist : join(dist, route.path.slice(1));
    mkdirSync(outDir, { recursive: true });
    writeFileSync(join(outDir, 'index.html'), html, 'utf8');
    console.log(`[prerender] ${route.path} -> ${outDir}/index.html`);
  }

  // Sitemap
  const lastmod = (await fetchLatestUpdated()) || new Date().toISOString();
  const urls = ROUTES.map(
    (route) => `  <url>\n    <loc>${SITE_URL}${route.path === '/' ? '' : route.path}</loc>\n    <lastmod>${lastmod.slice(0, 10)}</lastmod>\n    <changefreq>monthly</changefreq>\n  </url>`,
  ).join('\n');
  writeFileSync(
    join(dist, 'sitemap.xml'),
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`,
    'utf8',
  );
  console.log('[prerender] sitemap.xml written');

  // Robots
  writeFileSync(
    join(dist, 'robots.txt'),
    `User-agent: *\nDisallow: /admin\n\nSitemap: ${SITE_URL}/sitemap.xml\n`,
    'utf8',
  );
  console.log('[prerender] robots.txt written');
}

main().catch((err) => {
  console.error('[prerender] failed:', err);
  process.exit(1);
});

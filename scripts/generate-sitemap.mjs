import { readdir, readFile, writeFile } from 'node:fs/promises';
import { join, relative, sep } from 'node:path';

const site = 'https://aroundthehouseapp.com';
const dist = new URL('../dist/', import.meta.url);

async function filesUnder(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const nested = await Promise.all(entries.map((entry) => {
    const path = join(directory, entry.name);
    return entry.isDirectory() ? filesUnder(path) : [path];
  }));
  return nested.flat();
}

function routeFor(file) {
  const path = relative(dist.pathname, file).split(sep).join('/');
  if (path === 'index.html') return '/';
  return `/${path.replace(/index\.html$/, '')}`;
}

const routes = (await filesUnder(dist.pathname))
  .filter((file) => file.endsWith('.html'))
  .map(routeFor)
  .sort((a, b) => a === '/' ? -1 : b === '/' ? 1 : a.localeCompare(b));

// lastmod dates are maintained per page in src/data/site.ts.
const siteData = await readFile(new URL('../src/data/site.ts', import.meta.url), 'utf8');
const lastmods = new Map();
for (const entry of siteData.matchAll(/\{[^{}]*?path:\s*['"]([^'"]+)['"][^{}]*?lastmod:\s*['"](\d{4}-\d{2}-\d{2})['"][^{}]*?\}/g)) {
  lastmods.set(entry[1], entry[2]);
}

// Blog dates come from the built, published pages, so drafts cannot contribute.
for (const route of routes.filter(route => route.startsWith('/blog/') && route !== '/blog/')) {
  const html = await readFile(new URL(`.${route}index.html`, dist), 'utf8');
  const updated = html.match(/property="article:modified_time" content="(\d{4}-\d{2}-\d{2})/);
  const published = html.match(/property="article:published_time" content="(\d{4}-\d{2}-\d{2})/);
  const date = updated?.[1] ?? published?.[1];
  if (date) lastmods.set(route, date);
}

const urls = routes.map((route) => {
  const lastmod = lastmods.get(route);
  return `  <url>\n    <loc>${new URL(route, site)}</loc>${lastmod ? `\n    <lastmod>${lastmod}</lastmod>` : ''}\n  </url>`;
}).join('\n');
const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;

await writeFile(new URL('sitemap.xml', dist), xml);
console.log(`Generated sitemap.xml with ${routes.length} routes.`);

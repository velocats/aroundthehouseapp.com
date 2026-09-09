import { readdir, writeFile } from 'node:fs/promises';
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

const urls = routes.map((route) => `  <url>\n    <loc>${new URL(route, site)}</loc>\n  </url>`).join('\n');
const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;

await writeFile(new URL('sitemap.xml', dist), xml);
console.log(`Generated sitemap.xml with ${routes.length} routes.`);

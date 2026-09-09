import { readdir, readFile } from 'node:fs/promises';
import { join, relative, sep } from 'node:path';

const root = new URL('../', import.meta.url);
const dist = new URL('dist/', root);

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

const files = await filesUnder(dist.pathname);
const htmlFiles = files.filter((file) => file.endsWith('.html'));
const routes = new Set(htmlFiles.map(routeFor));
const publicFiles = new Set(files.map((file) => `/${relative(dist.pathname, file).split(sep).join('/')}`));
const errors = [];

for (const file of htmlFiles) {
  const route = routeFor(file);
  const html = await readFile(file, 'utf8');
  const h1Count = (html.match(/<h1(?:\s|>)/g) ?? []).length;
  const canonicalCount = (html.match(/<link rel="canonical"/g) ?? []).length;

  if (h1Count !== 1) errors.push(`${route}: expected one h1, found ${h1Count}`);
  if (canonicalCount !== 1) errors.push(`${route}: expected one canonical, found ${canonicalCount}`);

  for (const match of html.matchAll(/<a\b[^>]*href="(\/[^"]*)"/g)) {
    const href = match[1];
    const target = href.split(/[?#]/)[0];
    if (!target || target.startsWith('/assets/')) continue;
    const normalized = target.endsWith('/') ? target : `${target}/`;
    if (!routes.has(normalized) && !publicFiles.has(target)) errors.push(`${route}: broken internal link ${href}`);
  }
}

const sitemap = await readFile(new URL('sitemap.xml', dist), 'utf8').catch(() => null);

if (!sitemap) {
  errors.push('No generated sitemap was found.');
} else {
  for (const route of routes) {
    const expected = new URL(route, 'https://aroundthehouseapp.com').toString();
    if (!sitemap.includes(`<loc>${expected}</loc>`)) errors.push(`Sitemap is missing ${route}`);
  }
}

if (errors.length) {
  console.error(`Site validation failed with ${errors.length} issue(s):`);
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log(`Validated ${routes.size} routes, their internal links, metadata, and sitemap coverage.`);

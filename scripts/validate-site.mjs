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
const documents = new Map(await Promise.all(htmlFiles.map(async file => [routeFor(file), await readFile(file, 'utf8')])));
const titles = new Set();
const descriptions = new Set();
const attr = (tag, name) => tag.match(new RegExp(`\\b${name}="([^"]*)"`))?.[1];
const decode = value => value?.replace(/&amp;|&#38;/g, '&').replace(/&quot;|&#34;/g, '"').replace(/&#39;|&apos;/g, "'");

for (const file of htmlFiles) {
  const route = routeFor(file);
  const html = await readFile(file, 'utf8');
  const h1Count = (html.match(/<h1(?:\s|>)/g) ?? []).length;
  const canonicalCount = (html.match(/<link rel="canonical"/g) ?? []).length;

  if (h1Count !== 1) errors.push(`${route}: expected one h1, found ${h1Count}`);
  if (canonicalCount !== 1) errors.push(`${route}: expected one canonical, found ${canonicalCount}`);

  const title = html.match(/<title>([^<]+)<\/title>/)?.[1];
  const description = attr(html.match(/<meta\b[^>]*name="description"[^>]*>/)?.[0] ?? '', 'content');
  if (!title || titles.has(title)) errors.push(`${route}: missing or duplicate title`);
  if (!description || descriptions.has(description)) errors.push(`${route}: missing or duplicate description`);
  titles.add(title);
  descriptions.add(description);
  const canonical = attr(html.match(/<link\b[^>]*rel="canonical"[^>]*>/)?.[0] ?? '', 'href');
  if (canonical !== new URL(route, 'https://aroundthehouseapp.com').toString()) errors.push(`${route}: incorrect canonical ${canonical}`);
  const ogTitle = attr(html.match(/<meta\b[^>]*property="og:title"[^>]*>/)?.[0] ?? '', 'content');
  if (decode(ogTitle) !== decode(title)) errors.push(`${route}: social title differs from page title`);
  if ((html.match(/<main(?:\s|>)/g) ?? []).length !== 1) errors.push(`${route}: expected one main landmark`);
  const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(match => match[1]);
  if (ids.length !== new Set(ids).size) errors.push(`${route}: duplicate IDs`);
  for (const match of html.matchAll(/<img\b[^>]*>/g)) {
    const tag = match[0];
    const src = attr(tag, 'src');
    if (!src || !publicFiles.has(src)) errors.push(`${route}: missing image ${src}`);
    if (attr(tag, 'alt') === undefined) errors.push(`${route}: image is missing alt text: ${src}`);
    if (!(Number(attr(tag, 'width')) > 0 && Number(attr(tag, 'height')) > 0)) errors.push(`${route}: image is missing intrinsic dimensions: ${src}`);
  }
  for (const match of html.matchAll(/<script\b[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)) {
    try {
      const schema = JSON.parse(match[1]);
      if (schema['@context'] !== 'https://schema.org' || !schema['@graph']?.length) errors.push(`${route}: incomplete schema graph`);
    } catch { errors.push(`${route}: invalid JSON-LD`); }
  }
  for (const match of html.matchAll(/<a\b[^>]*href="(https:\/\/apps\.apple\.com[^\"]+)"/g)) {
    if (!match[1].includes('/id6789646793')) errors.push(`${route}: incorrect App Store destination`);
  }
  for (const match of html.matchAll(/<a\b[^>]*href="((?:\/|#)[^"]*)"/g)) {
    const [target, fragment] = match[1].split('#');
    if (!fragment) continue;
    const targetRoute = target.split('?')[0] || route;
    const targetHtml = documents.get(targetRoute);
    if (targetHtml && !targetHtml.includes(`id="${decodeURIComponent(fragment)}"`)) errors.push(`${route}: broken fragment ${match[1]}`);
  }

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

console.log(`Validated ${routes.size} routes: unique metadata, canonicals, social titles, landmarks, images, JSON-LD, internal links, fragments, App Store destinations, and sitemap coverage.`);

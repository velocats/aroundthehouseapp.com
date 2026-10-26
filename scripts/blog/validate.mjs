import { readdir, readFile, lstat } from 'node:fs/promises';
import { resolve, join } from 'node:path';
import { pathToFileURL, fileURLToPath } from 'node:url';
import { parseDocument } from 'yaml';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import { imageSize } from 'image-size';
import { postSchema, isPublished } from './schema.mjs';

export const imageName = value => value.slice('/blog/images/'.length);
const imagePattern = /^\/blog\/images\/[a-z0-9]+(?:-[a-z0-9]+)*\.(?:webp|png|jpg|jpeg)$/;
const fail = message => { throw new Error(message); };
async function regular(path) {
  const info = await lstat(path);
  if (!info.isFile() || info.isSymbolicLink()) fail(`Expected regular file: ${path}`);
  return info;
}
export async function validateContent(directory, today) {
  const root = resolve(directory);
  for (const name of ['blog', 'blog-images']) {
    const info = await lstat(join(root, name));
    if (!info.isDirectory() || info.isSymbolicLink()) fail(`Expected real directory: ${name}`);
  }
  const entries = await readdir(join(root, 'blog'));
  if (entries.length > 500) fail('Maximum 500 posts');
  const posts = [];
  const allImages = new Map();
  async function validateImage(src) {
    if (!imagePattern.test(src)) fail(`Use a flat /blog/images/kebab-case.webp (or png/jpg) image: ${src}`);
    if (allImages.has(src)) return;
    const path = join(root, 'blog-images', imageName(src));
    const info = await regular(path);
    if (info.size > 2_000_000) fail(`Optimize image below 2 MB: ${src}`);
    const bytes = await readFile(path);
    const dimensions = imageSize(bytes);
    const expected = src.endsWith('.webp') ? 'webp' : src.endsWith('.png') ? 'png' : 'jpg';
    if (dimensions.type !== expected || !dimensions.width || !dimensions.height || dimensions.width > 6000 || dimensions.height > 6000) fail(`Invalid or oversized raster image: ${src}`);
    allImages.set(src, dimensions);
  }
  for (const filename of entries.sort()) {
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*\.md$/.test(filename)) fail(`Invalid post filename (Markdown only): ${filename}`);
    const path = join(root, 'blog', filename);
    const info = await regular(path);
    if (info.size > 100_000) fail(`${filename}: maximum 100 KB`);
    const source = await readFile(path, 'utf8');
    try {
      const match = source.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
      if (!match) fail('Missing YAML frontmatter');
      const yaml = parseDocument(match[1], { uniqueKeys: true });
      if (yaml.errors.length) fail(yaml.errors.map(error => error.message).join('; '));
      const data = postSchema.parse(yaml.toJS({ maxAliasCount: 0 }));
      const body = match[2];
      if (body.trim().length < 100) fail('Article needs at least 100 characters of body text');
      const tree = unified().use(remarkParse).parse(body);
      const images = new Set(data.featuredImage ? [data.featuredImage.src] : []);
      let heading = 1;
      const definitions = new Map();
      const nodes = [];
      function walk(node) { nodes.push(node); node.children?.forEach(walk); }
      walk(tree);
      for (const node of nodes) if (node.type === 'definition') definitions.set(node.identifier, node.url);
      function validateLink(url) {
        if (/^(?:https:\/\/[^\s<>]+|mailto:[^\s<>]+|\/(?!\/)[^\s<>\\]*|#[^\s<>]*)$/.test(url) && !/[\u0000-\u0020\u007f]/.test(url)) return;
        fail(`Unsafe or relative link: ${url}`);
      }
      for (const node of nodes) {
        if (node.type === 'html') fail('Raw HTML is not allowed; use Markdown');
        if (node.type === 'heading') {
          if (node.depth === 1 || node.depth > heading + 1) fail('Start at ## and do not skip heading levels; the title supplies h1');
          heading = node.depth;
        }
        if (node.type === 'imageReference') fail('Use inline Markdown images with descriptive alt text');
        if (node.type === 'image') {
          if (!node.alt?.trim()) fail('Images require descriptive alt text');
          images.add(node.url);
        }
        if (['link', 'definition'].includes(node.type)) validateLink(node.url);
        if (node.type === 'linkReference') {
          if (!definitions.has(node.identifier)) fail(`Missing link definition: ${node.identifier}`);
          validateLink(definitions.get(node.identifier));
        }
      }
      for (const src of images) await validateImage(src);
      posts.push({ filename, slug: filename.slice(0, -3), source, body, data, images: [...images], published: isPublished(data, today) });
    } catch (error) { fail(`${filename}: ${error.message}`); }
  }
  return { posts, images: allImages };
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  const { posts } = await validateContent(process.argv[2] || fileURLToPath(new URL('../../src/content/', import.meta.url)));
  console.log(`Validated ${posts.length} articles (${posts.filter(post => post.published).length} publishable).`);
}

import { mkdir, rm, copyFile } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { validateContent, imageName } from './blog/validate.mjs';
const root = fileURLToPath(new URL('../', import.meta.url));
const source = join(root, 'src/content');
// Validate all articles, including drafts, before preparing any public assets.
const { posts } = await validateContent(source);
const live = posts.filter(post => post.published);
const assets = join(root, 'public/blog/images');
await rm(assets, { recursive: true, force: true });
await mkdir(assets, { recursive: true });
for (const post of live) {
  for (const src of post.images) await copyFile(join(source, 'blog-images', imageName(src)), join(assets, imageName(src)));
}
console.log(`Blog: ${live.length} published, ${posts.length - live.length} held back.`);

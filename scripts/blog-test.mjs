import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, readFile, writeFile, rm, symlink, readdir, cp } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';
import { execFileSync } from 'node:child_process';
import { validateContent } from './blog/validate.mjs';
import { isPublished } from './blog/schema.mjs';
import { parse } from 'yaml';
const root = new URL('../', import.meta.url);
const original = await readFile(new URL('../src/content/blog/hidden-features.md', import.meta.url), 'utf8');
const png = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+jRZkAAAAASUVORK5CYII=', 'base64');
async function fixture(run) {
  const dir = await mkdtemp(join(tmpdir(), 'ath-blog-'));
  await mkdir(join(dir, 'blog'));
  await mkdir(join(dir, 'blog-images'));
  await writeFile(join(dir, 'blog/hidden-features.md'), original);
  try { await run(dir); } finally { await rm(dir, { recursive: true, force: true }); }
}
const replace = async (dir, source) => writeFile(join(dir, 'blog/hidden-features.md'), source);

test('first article validates; draft and future dates are held back', async () => {
  await fixture(async dir => {
    const { posts } = await validateContent(dir, '2026-10-26');
    assert.equal(posts[0].published, true);
    assert.equal(isPublished({ ...posts[0].data, draft: true }), false);
    assert.equal(isPublished({ ...posts[0].data, published: '2999-01-01' }), false);
    assert.equal(isPublished({ ...posts[0].data, published: '2026-10-27' }, '2026-10-26'), false);
  });
});
for (const [name, transform] of [
  ['invalid date', text => text.replace('2026-10-26', '2026-02-30')],
  ['missing explicit draft', text => text.replace('draft: false\n', '')],
  ['invalid draft type', text => text.replace('draft: false', 'draft: "false"')],
  ['unknown frontmatter', text => text.replace('draft: false', 'draft: false\nlayout: evil')],
  ['duplicate YAML keys', text => text.replace('draft: false', 'draft: false\ndraft: true')],
  ['update before publication', text => text.replace('draft: false', 'draft: false\nupdated: "2025-01-01"')],
  ['raw script', text => text + '\n<script>alert(1)</script>'],
  ['raw HTML in a draft', text => text.replace('draft: false', 'draft: true') + '\n<iframe src="https://example.com"></iframe>'],
  ['unsafe URL', text => text + '\n[go](javascript:alert%281%29)'],
  ['unsafe reference URL', text => text + '\n[go][x]\n\n[x]: data:text/html,evil'],
  ['protocol relative URL', text => text + '\n[go](//example.com)'],
  ['h1 in body', text => text + '\n# Extra title'],
  ['skipped heading', text => text.replace('## Do you', '#### Do you')],
  ['remote image', text => text + '\n![wall](https://example.com/wall.png)'],
  ['missing image', text => text + '\n![wall](/blog/images/missing.png)'],
  ['image without alt', text => text + '\n![](/blog/images/wall.png)'],
  ['asset path traversal', text => text + '\n![wall](/blog/images/../../wall.png)']
]) {
  test(`rejects ${name}`, async () => fixture(async dir => {
    await replace(dir, transform(original));
    await assert.rejects(validateContent(dir));
  }));
}
test('rejects symlinks and MDX files', async () => fixture(async dir => {
  await symlink(join(dir, 'blog/hidden-features.md'), join(dir, 'blog/symlink.md'));
  await assert.rejects(validateContent(dir));
  await rm(join(dir, 'blog/symlink.md'));
  await writeFile(join(dir, 'blog/unsafe.mdx'), original);
  await assert.rejects(validateContent(dir));
}));
test('existing deployment builds and validates blog before publishing', async () => {
  const deploy = parse(await readFile(new URL('.github/workflows/deploy.yml', root), 'utf8'));
  assert.ok(Object.hasOwn(deploy.on, 'workflow_dispatch'));
  assert.deepEqual(deploy.on.push.branches, ['main']);
  assert.equal(deploy.permissions.contents, 'read');
  assert.equal(deploy.jobs.deploy.needs, 'build');
  const commands = deploy.jobs.build.steps.map(step => step.run).filter(Boolean);
  for (const command of ['npm run check', 'npm run test:blog', 'npm run test:quiz', 'npm run test:a11y']) assert.ok(commands.includes(command));
  assert.ok(!JSON.stringify(deploy).includes('BLOG_REPOSITORY'));
});
test('production build: image-free article, images, drafts, RSS, sitemap, cleanup, and failed validation', async () => {
  await fixture(async dir => {
    const project = join(dir, 'website');
    await mkdir(project);
    // A disposable copy keeps regression fixtures away from the author's working files.
    for (const name of ['src', 'public', 'scripts', 'package.json', 'package-lock.json', 'astro.config.mjs']) {
      await cp(new URL(name, root), join(project, name), { recursive: true });
    }
    await symlink(fileURLToPath(new URL('node_modules', root)), join(project, 'node_modules'), 'dir');
    const content = join(project, 'src/content');
    await rm(join(content, 'blog'), { recursive: true, force: true });
    await mkdir(join(content, 'blog'));
    await writeFile(join(content, 'blog/hidden-features.md'), original);
    await writeFile(join(content, 'blog-images/wall.png'), png);
    await writeFile(join(content, 'blog-images/private-draft.png'), png);
    const extra = original.replace('2 Powerful Around the House Features You Might Not Know About', 'A record with a photo & useful details')
      .replace("Get to know Documentation Readiness and paint color tracking: two useful ways to keep your home's important details ready when you need them.", 'A separate photograph example to verify optional featured images and inline Markdown images in the blog.')
      .replace('draft: false', 'draft: false\nfeaturedImage:\n  src: /blog/images/wall.png\n  alt: A painted wall');
    await writeFile(join(content, 'blog/with-photo.md'), extra + '\n![A painted wall](/blog/images/wall.png)\n');
    await writeFile(join(content, 'blog/private-draft.md'), original.replace('draft: false', 'draft: true') + '\nDRAFT-ONLY-SECRET-8675309\n![Private draft photo](/blog/images/private-draft.png)');
    await writeFile(join(content, 'blog/future-post.md'), original.replace('2026-10-26', '2999-01-01'));
    const build = () => execFileSync('npm', ['run', 'check'], { cwd: project, stdio: 'pipe' });
    const output = path => readFile(join(project, 'dist', path), 'utf8');
    build();
    const html = await output('blog/hidden-features/index.html');
    assert.ok(html.includes('BlogPosting'));
    assert.ok(!html.includes('class="blog-featured"'));
    const photo = await output('blog/with-photo/index.html');
    assert.match(photo, /class="blog-featured"/);
    assert.match(photo, /width="1" height="1" loading="lazy"/);
    assert.match(photo, /property="og:image" content="https:\/\/aroundthehouseapp.com\/blog\/images\/wall.png"/);
    const feed = await output('blog/rss.xml');
    assert.ok(feed.includes('A record with a photo &amp; useful details'));
    for (const name of ['private-draft', 'future-post']) {
      assert.ok(!feed.includes(`/blog/${name}/`));
      assert.ok(!(await readdir(join(project, 'dist/blog'))).includes(name));
      assert.ok(!(await output('sitemap.xml')).includes(`/blog/${name}/`));
      assert.ok(!(await output('blog/index.html')).includes(`/blog/${name}/`));
    }
    assert.ok(!(await readdir(join(project, 'dist/blog/images'))).includes('private-draft.png'));
    async function assertNoDraftContent(directory) {
      for (const entry of await readdir(directory, { withFileTypes: true })) {
        const file = join(directory, entry.name);
        if (entry.isDirectory()) await assertNoDraftContent(file);
        else assert.ok(!(await readFile(file, 'utf8')).includes('DRAFT-ONLY-SECRET-8675309'), `Draft content leaked to ${file}`);
      }
    }
    await assertNoDraftContent(join(project, 'dist'));
    assert.match(await output('sitemap.xml'), /<lastmod>2026-10-26<\/lastmod>/);
    await writeFile(join(content, 'blog/with-photo.md'), extra.replace('draft: false', 'draft: true'));
    build();
    assert.ok(!(await readdir(join(project, 'dist/blog'))).includes('with-photo'));
    assert.ok(!(await readdir(join(project, 'public/blog/images'))).includes('wall.png'));
    await writeFile(join(content, 'blog/hidden-features.md'), original + '\n<script>bad()</script>');
    assert.throws(build);
    await rm(join(content, 'blog'), { recursive: true });
    await mkdir(join(content, 'blog'));
    build();
    assert.ok((await output('blog/index.html')).includes('New articles are on their way'));
    assert.ok(!(await output('blog/rss.xml')).includes('<item>'));
    assert.ok(!(await output('sitemap.xml')).includes('/blog/hidden-features/'));
  });
});

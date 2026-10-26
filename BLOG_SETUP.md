# Operating the Around the House blog

Articles live in `src/content/blog/` in this website repository. Astro Content Collections generate `/blog/`, `/blog/<filename>/`, and `/blog/rss.xml`. The navigation and footer link to the blog; every page advertises the RSS feed. Articles include canonical and social metadata, BlogPosting JSON-LD, reading time, author, category, publication date, optional update date, and optional images. The generated sitemap includes published articles and their dates.

## Access and publication

The existing repository is `velocats/aroundthehouseapp.com` (public). Its default/deployment branch is `main`; GitHub Pages uses GitHub Actions. These settings were inspected read-only on October 26, 2026. No remote settings were changed.

Invite your wife's GitHub account under repository **Settings → Collaborators → Add people** (or grant Write if this becomes an organization repository). She accepts the invitation and clones this same repository. Collaborator access also permits website code changes. Optional pull requests let you review content before it reaches `main`.

No additional repository, webhook, token, secret, GitHub App, CMS, or hosting setup is needed. Pushes to `main` use `.github/workflows/deploy.yml`: install dependencies, validate and build the entire website, run blog/quiz/accessibility regression suites, then deploy the artifact to GitHub Pages. A failed build or test prevents deployment; the last successfully deployed website stays live. Manual **Actions → Deploy Astro site to GitHub Pages → Run workflow** remains available.

A valid post with `draft: false` and `published` on or before the build's UTC date is published. Drafts and future-dated posts are excluded from article routes, the index, RSS, and sitemap. Future dates do not schedule a build; push or manually run the workflow on the desired date. Use the actual release date when publishing the first article; its current date, `2026-10-26`, is the local review date.

This repository is public: draft Markdown remains visible on GitHub even though it is excluded from the deployed website. Never put private household information or credentials in articles or images.

## Author an article

Read `docs/BLOG_AUTHORING.md`. Copy `docs/BLOG_POST_TEMPLATE.md` to `src/content/blog/your-article-slug.md`, then replace its fields and body. Use plain Markdown, a unique title and description, and one of the categories specified in `scripts/blog/schema.mjs`. No MDX or raw HTML. The filename becomes the URL; keep it stable after release.

Images are optional. Store optimized JPG, PNG, or WebP files in `src/content/blog-images/`; reference them as `/blog/images/filename.webp`. Each must be below 2 MB and at most 6000 pixels on either side. Use kebab-case filenames and descriptive alt text. Only images referenced by published articles are copied into generated `public/blog/images/`. Draft-only and unused source images are not deployed. Shared images referenced by any published article are public. Do not add blog images directly to `public/`.

For a featured image, add:

```yaml
featuredImage:
  src: /blog/images/paint-label.webp
  alt: "Paint can label showing the saved color code"
```

Inline images use `![Description](/blog/images/paint-label.webp)`. Dimensions are derived automatically. Articles without a featured image have a text-led layout and use the site's branded social card; they have no placeholder image.

## Review and publish commands

From the website checkout:

```bash
npm ci
npm run blog:validate
npm run check
npm run test:blog
npm run test:quiz
npm run test:a11y
npm run preview -- --host 127.0.0.1 --port 4321
```

Review `/blog/` and `/blog/hidden-features/` in the preview. `npm run check` produces the production build and validates all existing routes, metadata, images, structured data, internal links, and sitemap. `test:blog` builds disposable fixture copies and never edits the author's working content. There is no separate TypeScript checker configured; Astro's build generates collection types and compiles the site. Passing accessibility regression tests does not establish WCAG conformance; see `docs/ACCESSIBILITY_AUDIT.md` for manual checks.

When authorized and ready, from `main` (pushing publishes the site):

```bash
git diff --check
git status --short
git add src/content/blog/ src/content/blog-images/
git commit -m "Publish homeowner blog article"
git push origin main
```

For this initial implementation, also review and stage the infrastructure files shown by `git status`, including `BLOG_SETUP.md`, the template, layouts, routes, scripts, styles, navigation, workflow, and package files. `git diff --stat` and `git diff` show tracked-file changes; open the new files too. No commit, push, or deployment was performed during implementation.

## Troubleshooting

- **Validation fails:** read the named filename and error. Fix invalid YAML, dates, unknown fields, missing alt text, bad image paths, raw HTML, heading skips, or unsafe links. Drafts must also validate. Do not bypass the validator or weaken accessibility tests.
- **An article is missing:** check `draft`, publication date (UTC), and the latest successful deployment. There is no draft-preview override. To review a draft visually, temporarily set `draft: false` and a current date locally, run the checks/preview, then restore the draft before committing if it should stay unpublished.
- **An image changed or was added during development:** restart `npm run dev` to prepare public assets. Production builds always prepare fresh assets. `public/blog/`, `dist/`, and `.astro/` are generated; do not commit them.
- **Build fails on an internal link:** use the exact existing root-relative route with its trailing slash, and a real heading fragment. The full build catches missing routes/fragments.
- **A push did not publish:** check Actions for the deployment run, failures, Pages environment approval, and that the push reached `main`. GitHub Pages should remain set to GitHub Actions. No custom publishing credential is required.
- **Unpublish:** set `draft: true` (or delete the article), validate and push to `main`. The next successful deployment removes its route and any now-unreferenced images. Search engines and external caches may retain old copies.

## Product evidence and limits

The first article was checked against the local Around the House application source at `personal/apps/Tendory/Tendory`, commit `2aa6efd`, with project version `2026.10.23`. `Views/Binder/BinderView.swift` implements the Documentation Readiness percentage from replacement values, photos, receipts, and model/serial numbers. `Models/PaintRecord.swift`, `Views/Paint/PaintEditorView.swift`, and `Views/Paint/PaintCatalogViews.swift` implement paint details, locations, photographs, and catalog lookup. No app source was modified. Local source verification does not confirm which binary is currently available to every App Store customer; confirm release availability before publishing.

Remote collaboration, Actions, and deployment have not been exercised. Local validation covers the build and prepared workflow, not successful remote publication. The existing Astro 4 dependency tree reports npm audit advisories; a framework upgrade is separate from this blog change.

## Local verification (October 26, 2026)

- `npm run check`: production build and site validation pass for 48 pages (46 existing pages plus blog index and first article); RSS is generated separately.
- `npm run blog:validate`: first article passes frontmatter/content validation.
- `npm run test:blog`: 21 tests pass, covering invalid content, workflow gates, image-free and featured-image layouts, inline image dimensions, draft/future exclusion, no draft content in built files, asset cleanup, empty blog, RSS escaping, and sitemap dates. Builds run in disposable copies.
- `npm run test:quiz`: all 4,096 answer combinations pass.
- `npm run test:a11y`: passes for all 48 pages, including six viewport sizes, 312 axe scans, 144 keyboard walks, existing menu/form/checklist/carousel/quiz journeys, and reflow/text-spacing checks. The suite was not weakened or excluded.
- Desktop blog index and phone article screenshots inspected. RSS and sitemap parsed as XML. `git diff --check` passes.
- `npm audit`: 14 advisories (2 moderate, 11 high, 1 critical), the same counts as the original committed dependency tree; framework/dependency remediation remains separate work.

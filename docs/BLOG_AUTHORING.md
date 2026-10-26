# Writing Around the House blog articles

Follow the root AGENTS.md, README.md, docs/PROJECT.md, and BLOG_SETUP.md. This is the website repository; articles publish through its existing main-branch GitHub Pages workflow.

## Create content

- Create one plain Markdown file directly in `src/content/blog/`: `short-descriptive-slug.md`. Use lowercase letters, numbers, and single hyphens. The filename becomes `/blog/short-descriptive-slug/`; do not rename published files casually.
- Copy `docs/BLOG_POST_TEMPLATE.md` as a starting point. Required frontmatter: `title`, `description`, `author`, `category`, `published`, and explicit boolean `draft`. Optional: `updated`, `featuredImage: { src, alt }`. Unknown fields are rejected.
- Quote dates and text containing YAML punctuation. Dates must be real `YYYY-MM-DD` dates; `updated` cannot precede `published`. Choose the actual release date, not the date an assistant happened to draft the piece.
- Titles must be useful, unique, and at most 100 characters. Write a specific SEO description of 50–180 characters. Use keywords naturally; do not repeat phrases for rankings. The website supplies canonical, social, and structured metadata.
- Categories: `App tips`, `Home records`, `Maintenance`, `New homeowners`. Use the closest existing category; changing the list requires editing the schema and reviewing the website change.
- Do not add an h1 in the body: the page supplies it from the title. Start sections with `##`, use `###` beneath them, and do not skip heading levels. Use descriptive link text.
- Plain Markdown only: no raw HTML, MDX, scripts, embeds, frontmatter layout overrides, or new dependencies for an article.

## Images and links

- Images are optional. Never create a placeholder or add stock photography just to fill space.
- Put images in `src/content/blog-images/`, using kebab-case WebP, PNG, or JPG filenames. Keep each under 2 MB and 6000 pixels per side; optimize for mobile. Reference `/blog/images/name.webp`, not a filesystem path or a remote image. Add descriptive alt text to every image. The build supplies dimensions.
- Use root-relative internal links with trailing slashes, for example `/home-records-app/`, `/home-inventory-app/`, `/home-document-organizer/`, `/paint-color-tracker/`, `/resources/`, `/pricing/`, or `/blog/hidden-features/`. Check that every target exists; do not invent routes or link to unpublished articles.
- Use HTTPS for external sources. Cite authoritative sources when offering specialized advice. Avoid generic “click here” anchors.

## Voice and product verification

- Write friendly, practical advice for homeowners. Explain why a detail helps, with believable household examples. Prefer plain language, specific benefits, and a subtle relevant call to action. Avoid exaggerated promises, keyword stuffing, and generic AI marketing language.
- Verify product claims against the shipping app, owner-confirmed release information, and existing verified website content. Local app source, if available, is supporting evidence; it does not alone prove App Store availability. Record any uncertainty for the owner before publication.
- Do not invent integrations, manufacturers, features, automation, insurance calculations, or guarantees. Documentation Readiness measures completeness of entered item details; it does not establish adequate insurance coverage or guarantee approval of a claim. Paint swatches are previews, not guaranteed physical matches.
- Do not include private homeowner information, personal documents, passwords, or credentials. The GitHub repository is public, including draft source files.

## Validate and publish

1. Keep `draft: true` while writing. Drafts must validate and are absent from the website, RSS, sitemap, and article routes. Future-dated posts also stay out until a build on/after their date; dates do not schedule builds.
2. Run `npm run blog:validate`, `npm run check`, `npm run test:blog`, `npm run test:quiz`, and `npm run test:a11y` from the repository root. Fix failures. Do not weaken or exclude tests.
3. Review the production preview at phone, tablet, and desktop widths. For local draft rendering, temporarily set it to published, build and preview, then restore its intended status. Never claim remote publication was tested from a local preview.
4. When asked to publish, set `draft: false` and the actual publication date. Review `git diff` and `git status`. Commit and push only when the user's authorization and tool configuration permit it. A push to `main` publishes automatically after checks pass. A branch alone does not publish; a PR must reach `main`.
5. Report changed article paths, checks, and whether anything was actually pushed. Do not modify unrelated website code for an article.

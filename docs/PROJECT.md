# Project guide

## Purpose

This repository is the public marketing, discovery, legal, and support surface for Around The House. Its jobs are to:

1. Explain the product clearly to prospective customers.
2. Earn relevant non-brand search traffic.
3. Show the real app through screenshots and precise feature descriptions.
4. Send qualified visitors to the App Store.
5. Host stable privacy, terms, and support URLs.

The website is not the product itself. There is no web account, authenticated dashboard, or customer-data backend in this repository.

## Product positioning

Around The House is a private home-memory app for recording appliances and home systems, repairs, completed and recurring maintenance, service providers, costs, manuals, warranties, receipts, photos, notes, and home reports.

Its primary differentiation is a focused native Apple experience with no Around The House account. Records remain on the customer's devices and, when enabled, in the customer's private iCloud.

## Technical architecture

Astro maps files in `src/pages/` to static routes. Pages compose shared components and one of three layouts:

- `BaseLayout.astro` owns the document shell, canonical URL, social metadata, robots directive, icons, and base JSON-LD graph.
- `LandingLayout.astro` provides shared structure and schema for product and use-case landing pages.
- `ArticleLayout.astro` provides editorial metadata, article schema, dates, breadcrumbs, and related content structure.

`src/data/site.ts` is the content registry for internal links and page metadata. Registry entries should correspond to implemented route files so related-link modules cannot introduce a broken path.

The site has no client-side framework runtime and should remain predominantly static. Add JavaScript only where it provides a clear user benefit.

## Design system

The visual direction is calm, editorial, screenshot-led, and consistent with the Quiet Tools family. Shared colors, typography, spacing, device frames, responsive behavior, and component styles live in `src/styles/global.css`.

When adding content:

- Reuse existing layout and component patterns first.
- Prefer real product screenshots to generic stock imagery.
- Keep prose practical and specific.
- Preserve heading order, keyboard navigation, focus states, and meaningful alt text.
- Do not place essential meaning only inside an image.

## Metadata and structured data

`BaseLayout` creates an `Organization`, `WebSite`, and `WebPage` schema graph. Individual pages may extend it with `SoftwareApplication`, `FAQPage`, `Article`, or breadcrumb data.

Schema is supporting metadata, not a substitute for visible content. Every structured claim must also appear on the page and describe the current product accurately.

## Assets

Product assets live under `public/assets/` and are served without transformation by GitHub Pages. Large source images must therefore be optimized before commit.

The homepage's `ipad-front-page.png` is approximately 1.8 MB and loaded at high priority. Replacing it with responsive AVIF/WebP variants is the highest-value current performance improvement.

Image-generation scripts under `scripts/` produce App Store or social assets. Generated files should be visually inspected before replacing production images.

## Deployment and operations

The production build is deployed from `main` through GitHub Actions. GitHub Pages provides static hosting and the custom domain is declared by `public/CNAME`.

After deployment, verify:

- Homepage and changed routes return `200`.
- Canonicals use `https://aroundthehouseapp.com`.
- `robots.txt` permits crawling.
- The sitemap contains all intended indexable URLs and no missing ones.
- The App Store badge resolves to the live listing.
- Legal and support URLs remain stable.

## Known technical debt

1. Pricing and promotional details are not yet centralized with the shared URLs.
2. Comparison facts and promotional prices need scheduled review because they are time-sensitive.
3. Additional task-level content from the SEO roadmap still needs implementation.

Recommended follow-up work:

- Keep generated sitemap and build-time link checks in the deployment gate.
- Separate planned content from implemented route metadata.
- Centralize product URLs, support details, pricing, and promotion dates.
- Generate responsive image variants during the asset workflow.

## Definition of done

A website change is complete when:

- The production build succeeds.
- The change works at mobile and desktop widths.
- Links, keyboard behavior, and headings are correct.
- Metadata and structured data reflect visible content.
- Images are optimized and do not introduce avoidable layout shift.
- New indexable content is internally linked and included in the sitemap.
- Time-sensitive product details have been verified.

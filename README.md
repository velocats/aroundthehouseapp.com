# Around The House website

Marketing and support website for [Around The House](https://aroundthehouseapp.com), a private home-maintenance and home-record app for iPhone, iPad, and Mac. The site is built with Astro, generated as static HTML, and deployed to GitHub Pages.

## Quick start

Requires Node.js 20 or newer.

```bash
npm ci
npm run dev
```

Production checks use:

```bash
npm run build
npm run preview
```

The generated site is written to `dist/`.

## Project map

```text
.
├── .github/workflows/     # GitHub Pages build and deployment
├── docs/                  # Project and SEO documentation
├── public/
│   ├── assets/            # App icons, product screenshots, and social image
│   ├── CNAME              # GitHub Pages custom domain
│   └── robots.txt         # Points crawlers to the generated sitemap
├── scripts/               # App Store and social-image generation utilities
├── src/
│   ├── components/        # Shared navigation, CTAs, content blocks, and footer
│   ├── data/site.ts       # URLs and metadata for the planned content system
│   ├── layouts/           # Metadata, schema, landing-page, and article shells
│   ├── pages/             # File-based Astro routes
│   └── styles/global.css  # Site-wide design system and responsive styles
├── astro.config.mjs
└── package.json
```

## Current routes

| Route | Purpose |
|---|---|
| `/` | Product homepage |
| `/home-maintenance-app/` | Primary product-intent landing page |
| `/home-maintenance-tracker/` | Maintenance tracking landing page |
| `/home-maintenance-records/` | Maintenance and repair history landing page |
| `/home-maintenance-reminders/` | Recurring reminder landing page |
| `/digital-home-binder/` | Home document and recordkeeping landing page |
| `/home-inventory-app/` | Home inventory landing page |
| `/new-homeowner-app/` | New-homeowner use-case page |
| `/home-warranty-tracker/` | Warranty tracking landing page |
| `/appliance-maintenance-records/` | Appliance recordkeeping landing page |
| `/home-handoff-report/` | Home handoff reporting landing page |
| `/private-home-maintenance-app/` | Privacy-focused landing page |
| `/homezada-alternative/` | Dated HomeZada comparison page |
| `/resources/` | Editorial guide index |
| `/resources/*/` | Home maintenance and recordkeeping guides |
| `/screenshots/` | iPhone and iPad product gallery |
| `/pricing/` | Monthly and lifetime pricing |
| `/support/` | Customer support and common troubleshooting |
| `/privacy/` | Privacy policy |
| `/terms/` | Terms of use |

`src/data/site.ts` is the registry used for labels, descriptions, and related-link modules. Add an entry only when its route is implemented in the same change.

## Content and SEO conventions

- Every indexable page must provide a unique title, description, canonical path, and one visible `h1`.
- Use `BaseLayout` for metadata, `LandingLayout` for search landing pages, and `ArticleLayout` for editorial resources.
- Keep one primary search intent per URL; avoid near-duplicate pages for keyword variations.
- The production build generates the sitemap from the routes present in `dist/`.
- Link new pages from at least one existing crawlable page.
- Emit FAQ or HowTo structured data only when the complete content is visible.
- Product claims, prices, and promotional dates must match the shipping app.
- Preserve the privacy positioning. Search Console can measure search performance without behavioral tracking scripts.

See [docs/PROJECT.md](docs/PROJECT.md) for architecture and operating notes and [docs/SEO_STRATEGY.md](docs/SEO_STRATEGY.md) for the competitor audit and search roadmap.

## Adding a page

1. Create the route under `src/pages/`.
2. Use the appropriate layout and set unique metadata.
3. Add accurate visible content and relevant product screenshots.
4. Add it to `src/data/site.ts` if it participates in related-link modules.
5. Link it from the appropriate parent page and related resources.
6. Run `npm run check` and inspect the generated HTML in `dist/`.
7. After deployment, verify a `200` response, the canonical, and sitemap inclusion.

## Deployment

Pushes to `main` trigger `.github/workflows/deploy.yml`. The workflow installs dependencies on Node 20, builds and validates the site, uploads `dist/`, and deploys it to GitHub Pages.

Both `CNAME` and `public/CNAME` identify `aroundthehouseapp.com`; `public/CNAME` is copied into the build output.

## Pre-deployment checklist

- `npm run build` succeeds.
- Navigation and related links do not point to missing routes.
- New pages appear in the sitemap.
- Titles, descriptions, canonicals, and structured data are correct.
- Prices, dates, platform support, and privacy claims match the app.
- Images have useful alt text, explicit dimensions, and appropriate lazy loading.
- Large screenshots have responsive WebP or AVIF variants.
- Production and App Store links are tested after deployment.

## Product configuration

Shared values currently live in `src/data/site.ts`, while some components contain their own App Store URL constants. Search for every occurrence before changing product details:

```bash
rg "apps.apple.com|support@|0.99|14.99|24.99|2026" src public
```

Centralizing all mutable product information in `src/data/site.ts` is recommended.

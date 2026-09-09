# SEO strategy and HomeZada competitor audit

Audit date: September 9, 2026

## Summary

Around The House should compete as the private, native Apple home-record app for maintenance history, reminders, warranties, receipts, and home handoffs. It should not imitate HomeZada's broader financial, professional, project-management, and AI platform positioning.

HomeZada has a large content footprint but limited top-ten penetration. The opportunity is to publish fewer, more complete resources around homeowner recordkeeping and recurring maintenance, then connect each informational page to a relevant product workflow.

Search rankings cannot be guaranteed. This plan prioritizes technical accessibility, intent coverage, content quality, internal linking, and relevant authority—the inputs the project can control.

## Competitor baseline

The supplied Ubersuggest report describes HomeZada as follows:

| Metric | Reported value |
|---|---:|
| SEO score | 79 |
| Estimated monthly organic traffic | 203 |
| Organic keywords | 294 |
| Backlinks | 31,700 |
| Discovered SEO issues | 75 |
| Keywords in positions 1–3 | 4 |
| Keywords in positions 4–10 | 26 |
| Keywords in positions 11–50 | 189 |
| Keywords in positions 51–100 | 75 |

These figures are third-party estimates, not analytics data. Use them for prioritization rather than as exact traffic or link counts.

Visible opportunities in the report include `household admin`, `home inventory app`, `home services app`, `how to clean bathroom fan`, `how to wash a ceiling`, and several carbon-monoxide-detector battery queries.

## Content-footprint comparison

At audit time, HomeZada's sitemap exposed approximately 305 URLs, including 157 individual home-maintenance tasks, 44 remodeling templates, 36 press pages, and dedicated pages for inventory, maintenance, documents, finances, multiple properties, new homeowners, and professionals.

Around The House had eight built routes, while its live sitemap exposed only five. Two live search landing pages were missing from that sitemap. Several routes referenced by `src/data/site.ts` returned `404` because their page files did not exist.

This is the most urgent competitive gap. Search engines cannot rank a planned content architecture.

## Competitive strengths

Around The House can credibly differentiate on:

- No Around The House account
- Customer-controlled storage on Apple devices and private iCloud
- Native support for iPhone, iPad, and Mac
- No advertising or behavioral tracking
- Focused home records instead of a broad financial platform
- Maintenance history connected to each item
- Monthly and lifetime purchase options
- Home reports and home-handoff records

Demonstrate these advantages with exact screenshots and workflows rather than unsupported superlatives.

## Target site architecture

### Commercial and product pages

| Priority | Target route | Primary intent |
|---:|---|---|
| 1 | `/home-maintenance-app/` | Home maintenance app |
| 1 | `/home-maintenance-tracker/` | Home maintenance tracker |
| 1 | `/digital-home-binder/` | Digital home binder |
| 1 | `/home-maintenance-records/` | Maintenance log and repair history |
| 1 | `/home-maintenance-reminders/` | Recurring home reminders |
| 2 | `/home-inventory-app/` | Home inventory app |
| 2 | `/new-homeowner-app/` | New-homeowner organization |
| 2 | `/home-warranty-tracker/` | Warranty and receipt tracking |
| 2 | `/appliance-maintenance-records/` | Appliance records |
| 2 | `/home-handoff-report/` | Home handoff and seller records |
| 3 | `/private-home-maintenance-app/` | Privacy-focused alternative |
| 3 | `/homezada-alternative/` | Product comparison |

Each URL must satisfy a distinct search need. Keyword variations with the same intent belong on one comprehensive page.

### Editorial clusters

1. Maintenance schedules and reminders
2. Repair, service-provider, and cost records
3. Warranties, receipts, manuals, and appliance information
4. Home inventory and insurance documentation
5. New-homeowner setup and home handoff

Initial high-fit resources:

- How to keep track of home maintenance
- What home maintenance records to keep
- How to create a digital home binder
- How to change a carbon monoxide detector battery
- How to clean a bathroom exhaust fan
- How often to replace a furnace filter
- How to clean refrigerator coils
- How to flush a water heater
- How to clean a dryer vent
- How to test a sump pump
- How to record appliance model and serial numbers
- What to document after a contractor visit

Maintenance guides should include frequency, steps, safety limits, tools, expected time or cost when supportable, and what to record after completion. Safety-critical content needs authoritative sources and clear professional-help boundaries.

## Internal linking

Every editorial page should link to its parent topic page, one relevant Around The House workflow, and two related guides. Every commercial page should link to supporting guides.

The homepage should expose the major product categories and a resources entry point in crawlable HTML. Breadcrumbs should mirror the actual hierarchy and be visible whenever breadcrumb schema is emitted.

## Technical priorities

### Critical

- Generate an accurate sitemap from actual routes.
- Remove or implement internal links to missing pages.
- Add every live indexable page to the sitemap.
- Submit the corrected sitemap in Google Search Console.
- Request indexing for new cornerstone pages.

### High

- Convert the 1.8 MB homepage PNG to responsive AVIF/WebP sources.
- Prioritize only the true largest-contentful-paint image.
- Add a build-time broken-link test.
- Centralize mutable product facts to prevent inconsistent pricing or URLs.

### Supporting metadata

- Retain unique titles, descriptions, canonicals, and one visible `h1`.
- Add organization logo and verified profiles to organization schema when available.
- Represent current monthly and lifetime offers accurately.
- Add publication and modification dates to editorial content.
- Use FAQ and HowTo schema only for complete visible content.

## Authority strategy

Do not try to match HomeZada's raw backlink count. Focus on relevant referring domains and useful assets:

- Annual home-maintenance checklist
- Home handoff checklist
- Appliance information worksheet
- Warranty and receipt organizer
- Contractor-visit record checklist
- Maintenance-cost calculator

Likely outreach audiences include home inspectors, real-estate agents, insurance educators, homeowner associations, repair professionals, Apple-app publications, and privacy-focused software reviewers.

Comparison content must be factual, dated, and explicit about who should choose either product.

## 90-day execution order

### Days 1–14

- Correct the sitemap and broken routes.
- Add crawlable navigation to existing landing pages.
- Optimize the homepage hero image.
- Verify production status codes, canonicals, and metadata.
- Establish Search Console baselines.

### Days 15–45

- Publish digital binder, maintenance records, reminders, inventory, and new-homeowner pages.
- Launch a real resources index.
- Add visible breadcrumbs and contextual related links.

### Days 30–75

- Publish two high-quality resources per week across the core clusters.
- Start with low-difficulty topics identified in the competitor report.
- Build one downloadable or interactive flagship resource.

### Days 45–90

- Publish a fair HomeZada comparison page.
- Conduct targeted outreach for the flagship resource.
- Improve pages earning impressions in positions 8–30 before expanding into unrelated topics.

## Measurement

Track valid indexed pages, non-brand impressions and clicks, queries in positions 4–20, click-through rate by page and query, App Store outbound clicks, relevant referring domains, pages with impressions but no clicks, and cannibalization between app, tracker, records, and reminders pages.

An appropriate first milestone is 25–35 strong indexable pages and page-one visibility for a portfolio of specific high-intent terms. The broad term `home maintenance app` is a longer-term outcome.

## Maintenance cadence

Monthly:

- Review Search Console indexing, queries, and page performance.
- Fix broken links and sitemap discrepancies.
- Refresh pages with impressions but weak click-through rates.

Quarterly:

- Verify product features, prices, platforms, screenshots, and competitor comparisons.
- Consolidate pages that compete for the same intent.
- Update cornerstone resources and link them from newer content.

Annually:

- Revalidate time-sensitive comparisons and external sources.
- Review the content inventory for outdated, thin, or orphaned pages.

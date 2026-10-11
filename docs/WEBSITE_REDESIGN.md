# Home records website redesign

Implemented October 10, 2026. Website changes only; no deployment or app changes.

## Direction and source

The authoritative strategy, `Around_The_House_Product_Website_Direction.docx`, was found in `/Users/ecross/Downloads/` and read in full. The pasted assignment supplied the implementation and verification requirements.

Positioning: one place for everything you need to remember about your home, with reminders built in. Homepage headline: “Everything about your home. Without the spreadsheets.” Framework: “Capture it. Find it. Remember it.” Brand tagline: “Your home has a history. Keep it.”

## Audit

The original site is a static Astro 4 website deployed by GitHub Pages. It had 42 public routes: the homepage, 18 feature/use-case pages, an interactive annual maintenance checklist, 14 resource articles, the resource index, screenshots, pricing, support, about, editorial standards, privacy, and terms. Shared navigation, footer, landing and article layouts already protected useful search URLs and content. The working tree was clean at the start.

The homepage repeated broad benefit columns and featured a maintenance report and schedule before showing concrete recordkeeping. The existing paint page already explained real template fields precisely. The existing assets include genuine simulator and app captures, with production WebP versions. Support uses FormSubmit and email. The checklist stores progress locally and provides print and CSV actions.

The product registry supplies crawlable related links. Canonicals, Organization/WebSite/WebPage/Article/BreadcrumbList schema, robots.txt, and a build-generated sitemap were already present. A metadata bug gave several pages the generic Open Graph title. Existing validation checked route links and heading counts but not image existence, social titles, fragments, or structured-data syntax.

Prices and feature claims were scattered. The free tier was absent from pricing, future pricing had an unverified November date, and the privacy/comparison pages understated shipping household sharing.

## Implemented experience

The hero immediately identifies a home information organizer, names concrete records, presents the App Store action, explains the free entry point and Apple platforms, and shows actual paint and furnace screens.

A concise explanation establishes property → area → item as the organizing structure. Three section links lead into distinct compositions:

1. Capture: paint fields, a decorative paint-swatch composition, and a concrete trim example. The swatches are decoration, not app output or a color-matching feature.
2. Find: a large, readable furnace specifications screen makes filter size tangible; item-connected documents and a genuine Binder screen explain receipts, warranties, and manuals.
3. Remember: item history and schedule screens accompany replacement dates, contractor context, and recurring work. Maintenance supports the lasting record.

Demo Mode has a dedicated entry point, followed by private-storage copy, visible FAQs matching FAQ schema, and a final download action. No new stock photos, generated screenshots, or invented interface elements were used.

The shared design uses warm paper, forest green, readable editorial headings, systematic spacing, restrained device frames, visible keyboard focus, and mobile layouts. App Store buttons are consistent. Mobile navigation closes after anchor selection and Escape. Reduced-motion support remains in place. There is no decorative animation or new tracking.

## Pages changed

Direct page content changes:

- `/`: complete homepage rebuild.
- `/home-records-app/`: new broad records overview with practical categories and a Notes/spreadsheet/Reminders/binder comparison.
- `/pricing/`: free first-five-items tier and centralized current monthly/lifetime Pro prices.
- `/screenshots/`: paint, history, and documents first; added genuine paint captures and device section links.
- `/resources/`: added a recordkeeping starting point alongside the preserved checklist and articles.
- `/support/`: records positioning and first-record/demo guidance; form and email retained.
- `/privacy/`: corrected sharing description to match the current listing.
- `/home-maintenance-app/`: retained maintenance search intent, linked current pricing.
- `/home-maintenance-tracker/`: removed overbroad claims about competing reminder apps and spreadsheets.
- `/household-management-app/`: clearer homeowner-centered heading.
- `/homezada-alternative/`: corrected our product's sharing, prices, and an account-name typo; competitor pricing, maintenance, privacy, and security claims rechecked against its official pages on October 10, 2026.
- `/terms/`: title punctuation only, with terms retained.

All 43 current pages receive refreshed navigation, footer, typography, spacing, accessibility, and responsive behavior through shared components and styles. Existing article substance, sources, review dates, legal URLs, checklist, and support submission flow remain available.

## SEO

- Preserved every existing route, canonical, article source, and sitemap/robots behavior.
- Added `/home-records-app/` for home records and home information organizer intent, linked from homepage, navigation, and footer.
- Kept dedicated maintenance, tracker, software-related use cases, paint, repair-history, and appliance pages.
- Homepage title, description, and software schema now describe broader home records.
- Default social titles follow each page's title, including pricing and screenshots.
- Visible FAQs match FAQ schema. One SoftwareApplication node on the homepage contains visible free and Pro offers; other pages reference it.
- Expanded build validation checks metadata uniqueness, canonical correctness, Open Graph titles, main landmarks, duplicate IDs, image assets/alt text/dimensions, JSON-LD syntax, fragments, App Store destinations, and sitemap coverage.
- No redirects, no URL removals, no keyword-stuffed pages, no new behavioral analytics.

## Authentic screenshots

All reused production captures live in `public/assets/screenshots/new/`. New homepage usage:

| File | Purpose |
| --- | --- |
| `ipad-item-record.webp` | Hero: furnace photos, history, reminders, and attached documents |
| `iphone-paint-details.webp` | Hero and Capture: actual Paint & Finishes entry fields |
| `ipad-qr-item-details.webp` | Find: furnace specifications including filter size |
| `iphone-binder.webp` | Find: document categories |
| `iphone-item-history.webp` | Remember: work dates, provider, and cost |
| `iphone-schedule.webp` | Remember: recurring maintenance |

The new records overview also uses `iphone-items.webp`. The screenshot gallery adds `iphone-paint-details.webp` and `iphone-paint-templates.webp`, retaining its existing iPhone/iPad inventory, warranty, coverage, reporting, and history images. Existing feature pages keep their genuine images. A pre-existing intrinsic dimension mismatch on `ipad-front-page.webp` was corrected.

The paint screenshot shows template fields before entry, not a saved populated paint record; alt text and captions say so. No image pixels were changed. Existing captures show sample data and an earlier navigation design. They illustrate verified capabilities, but current release captures are still desirable.

Missing: a completed paint record, Demo Mode entry/exit, Global Search, Home Essentials, provider detail, and project detail screens. The homepage does not fabricate these. New verified features lacking suitable screenshots are explained in text.

## Claims and evidence

[Official App Store listing and version history](https://apps.apple.com/us/app/around-the-house-home-tracker/id6789646793), checked October 10, 2026, confirms the following marketing claims:

| Claim | Status |
| --- | --- |
| Items with photos, specifications, documents, location, repairs, and reminders | Verified in listing and existing captures |
| Paint templates/fields | Verified in genuine September repository captures and existing precise paint page |
| Filter size, model/serial number, purchase date, notes | Verified in specifications capture |
| Installation date | Verified in version history |
| Global Search and Home Essentials | Verified in version history; new screenshots needed |
| Service-provider contacts and work association; projects | Verified in description/version history |
| Example-home Demo Mode | Verified in version history and strategy |
| 14-day duration and complete preloaded contents | Strategy describes these; shipping behavior not independently verified, so website does not advertise duration or specific demo contents |
| Demo nudges, contextual conversion prompts, monthly engagement notifications | Proposed; kept only in separate app backlog |
| Free first five items; Pro unlimited items, attachments, PDF exports | Verified in listing |
| US $0.99 monthly and $14.99 lifetime Pro | Verified in listing; regional/current purchase screen governs |
| $24.99 November 1 price or promotional expiry | Not corroborated by current listing; removed from website |
| iPhone, iPad, Mac; private iCloud; no company login or advertising trackers | Verified in listing and website product/privacy documentation |
| Property invitations and Apple Calendar sharing | Verified in listing; privacy and comparison descriptions corrected |

The app source repository was not found among available project paths. No app source was modified. The strategy is not used as proof that proposed app behavior ships.

## Validation

See `docs/design/home-records/browser-qa.json` for the final browser result and the adjacent PNGs for captured production layouts. Browser checks use the production preview and bundled Playwright with installed Chrome; no dependencies were added to the project.

Run `npm run check` for production compilation and route/metadata/image/schema/link validation. Run `scripts/browser-qa.mjs` with a resolvable Playwright module and production preview to repeat visual and interaction checks. No separate lint command or unit-test suite is configured in this repository.

The support form is tested for labels, required fields, and success-state rendering; no real message is submitted. The App Store destination was opened successfully and redirects to the current product-name URL while preserving the app ID. No deployment was performed.

Final results:

- `npm run check`: successful production build; 43 routes pass the expanded site validator.
- Browser QA: 172 route/viewport checks, zero reported errors at 1440×1000, 390×844, 834×1194, and 320×740.
- All loaded images decode successfully; no horizontal page overflow at tested widths.
- Keyboard skip link, mobile anchor navigation, Escape, FAQ expansion, checklist storage/progress/reset/print/CSV, and support required fields/success state pass.
- Representative production layouts saved for homepage, home records, pricing, paint, resources, digital-binder guide, and support on desktop/iPhone/iPad. Visually reviewed hero, narrative sections, responsive screenshots, pricing, form, guide layout, and footer.
- A narrow-width decorative paint swatch overflow and a hidden-line-break spacing issue were found and fixed before the final passing run.
- `node --check` passes for both validation scripts; `git diff --check` passes.
- No lint script or unit test suite is configured. Chromium checks cover responsive layouts; physical Apple-device and Safari checks were not run.

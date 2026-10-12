# Around the House website redesign: Phase 1 audit and implementation plan

Prepared October 11, 2026. **Status: planning only; await approval before Phase 2.** No website source, image, dependency, app source, or deployment configuration was changed. The only intended repository addition is this document. ZIPs were extracted under `/tmp/ath-redesign-audit/`; these temporary paths are audit working files, not future production dependencies.

## 1. Executive summary and creative authority

Implement the supplied marketing professional's photography-led consumer experience: real homeowner situations, a phone in hand, and the headline **“Your home has a lot of moving parts. Keep them at your fingertips.”** The supplied prototype repeats this headline; no later headline was found in the supplied reference directory. Keep its cream/forest/mint/clay personality, conversational copy, three scenes, changing captions, and prominent Home Health Check invitation. This direction supersedes the older “Everything about your home. Without the spreadsheets.” homepage and previous redesign proposals where they conflict.

Retain Astro static generation, GitHub Pages, existing content routes and shared SEO infrastructure. Integrate the mandatory six-question quiz at `/home-health-check/` with small client-side JavaScript and no server, accounts, database, email collection, AI API, tracking installation, or paid service.

The supplied homepage is **a complete runnable hero-and-teaser prototype, not a complete full-site replacement**. The quiz's actual HTML/CSS/JavaScript is present and recoverable from a saved Claude document. Neither is production-ready: prototype phone interfaces are fabricated HTML; photography is preview resolution; trial promises lack release evidence; the quiz shares a Claude URL and needs factual and accessibility corrections. Existing captures prove genuine furnace details, but **no suitable genuine iPhone captures for all three scenes were found**. Asset preparation and product/copy review are prerequisites to finishing Phase 2.

## 2. Inspection scope, repository instructions, and evidence

No `CLAUDE.md` or `AGENTS.md` was found in the website repository (including hidden files outside ignored dependencies/Git internals), nor `AGENTS.md` in its ancestor directories through `/`. `.claude/settings.local.json` contains local tool permissions, not creative instructions. Read `README.md`, `docs/PROJECT.md`, `docs/WEBSITE_REDESIGN.md`, `docs/CONVERSION_IMPLEMENTATION.md`, relevant conversion proposal/app recommendations, SEO strategy and historical design audit context. Historical findings are not treated as current defects without source evidence. In particular, the current site already has mobile navigation and 43 valid routes.

Reviewed layouts, shared components, homepage, pricing, support, privacy, legal links, route/asset inventories, style system, build/validation/browser scripts and deployment workflow. Recursively inspected both supplied ZIPs, their nested ZIP and all substantive contained files; `__MACOSX` entries are AppleDouble metadata. Visually reviewed supplied photos and contact sheets of all 28 production WebPs and 62 local source/ASO images under ignored `images/`; examined the relevant furnace and iPhone captures at larger size. Local image files are authentic app evidence according to capture filenames and repository documentation; pixel identity with the current released app remains unverified.

Prior documentation revealed an available app checkout, so focused read-only checks also covered:

- `/Users/ecross/Documents/personal/apps/Tendory/Tendory/MARKETING_FEATURE_GUIDE.md`
- `/Users/ecross/Documents/personal/apps/Tendory/Tendory/Tendory/Utilities/ProStore.swift`
- `/Users/ecross/Documents/personal/apps/Tendory/Tendory/Tendory/Tendory.storekit`

These files do not establish private App Store Connect configuration or released behavior. No purchases, support submissions, app device tests, or deployment were performed.

## 3. Exact supplied-file inventory

Notation: `archive.zip :: member/path` is the exact archive member path, not a committed extracted file. Both top-level archives currently appear as existing untracked reference material; preserve them.

| Exact path / archive member | Purpose and findings |
|---|---|
| `docs/design-reference/website images-20261011T222919Z-1-001.zip` | Four members containing photography and nested homepage package |
| Above ZIP :: `website images/airfilter.jpeg` | Filter aisle: shelves of filters, hand/phone on right; blank white phone screen; 1680×944, 362,958 bytes |
| Above ZIP :: `website images/AaEs3BYGNuYswCyvfw5kYg-AaEs3BYG5DelzTn1_CtDmQ.jpg` | Smoke alarm near ceiling, bright domestic room, hand/phone on right; blank screen; 1680×944, 102,630 bytes |
| Above ZIP :: `website images/AaEssReI4e7mQ2pZx2mxHQ-AaEssReIEWjDJzknMPkx5Q.jpg` | Water heater in utility/laundry room, washer left, hand/phone to right of center; blank screen; 1680×944, 128,961 bytes |
| Above ZIP :: `website images/ath-hero.zip` | Nested working prototype package; 304,953 bytes |
| Nested ZIP :: `ath-hero/index.html` | Actual standalone homepage hero, header, carousel and quiz teaser; 20,602 bytes; not an artifact viewer |
| Nested ZIP :: `ath-hero/README.txt` | Creative copy rules, image export instructions, Canva links, carousel behavior and trial claims; 3,577 bytes |
| Nested ZIP :: `ath-hero/images/scene-1-filter-aisle.jpg` | Filter scene preview; 1600×900, 129,213 bytes |
| Nested ZIP :: `ath-hero/images/scene-2-smoke-alarm.jpg` | Smoke scene preview; 1600×900, 71,265 bytes |
| Nested ZIP :: `ath-hero/images/scene-3-water-heater.jpg` | Water-heater preview; 1600×900, 103,057 bytes |
| Nested ZIP :: `ath-hero/images/app-store-badge.svg` | Custom **placeholder** 168×56 badge, explicitly marked for replacement |
| `docs/design-reference/Home Health Check_files.zip` | Saved quiz bundle; actual implementation is embedded in its HTML |
| Above ZIP :: `Home Health Check_files/saved_resource.html` | 62,181 bytes; Claude frame preamble/runtime followed by genuine quiz markup, styles and an independent IIFE |
| Above ZIP :: `Home Health Check_files/frame-shell-DC3RxCAJ.js` | 150,556 bytes; Claude infrastructure, not quiz business logic; exclude from production |
| Above ZIP :: `Home Health Check_files/css2` | 8,054 bytes; saved Google Fonts CSS for Fraunces and Instrument Sans, still referencing remote WOFF2s; font binaries absent |
| Above ZIP :: `__MACOSX/._Home Health Check_files`, `__MACOSX/Home Health Check_files/._frame-shell-DC3RxCAJ.js`, `__MACOSX/Home Health Check_files/._css2`, `__MACOSX/Home Health Check_files/._saved_resource.html` | Metadata only; do not ship |

Extracted actual homepage: `/tmp/ath-redesign-audit/hero/ath-hero/index.html`. Actual quiz source: `/tmp/ath-redesign-audit/quiz/Home Health Check_files/saved_resource.html`, substantive app starts after `<!-- /frame-runtime -->`; quiz script starts at line 154, `QUESTIONS` at approximately line 175, rendering through line 329. A runtime-free audit copy at `/tmp/ath-redesign-audit/quiz-clean.html` demonstrates separability; do not commit the Claude runtime or frame capability imports.

README points to full-size Canva originals: [filter](https://www.canva.com/M/MAHXvJSUlAc), [smoke alarm](https://www.canva.com/M/MAHXvRw9kLM), [water heater](https://www.canva.com/M/MAHXvPaQPBI). These links were discovered in the supplied README, but access, full-size exports and licenses were not verified. The supplied standalone photos are only 80 pixels wider than the previews, not the requested ≥2400-pixel masters. No other nested application or ZIP was found.

## 4. Current architecture and retained infrastructure

| Area | Actual implementation / plan |
|---|---|
| Framework | `package.json`: only production dependency `astro: ^4.16.18`; installed version 4.16.19. No React/Vue runtime, server adapter or application backend. Retain. |
| Development | Node ≥20 documented; `npm ci`, `npm run dev` or `npm start`; `npm run preview` serves built output. |
| Build | `npm run build` executes `astro build && node scripts/generate-sitemap.mjs`; `npm run check` builds then runs `scripts/validate-site.mjs`. Static output in ignored `dist/`; `.astro/` and `node_modules/` ignored. |
| Routes | `src/pages/*.astro` and `src/pages/resources/*.astro`, file-based static routing with slash canonicals. No dynamic routes or redirects needed for quiz. |
| Configuration | `astro.config.mjs` sets `site: https://aroundthehouseapp.com`; `public/CNAME` copied into build, root `CNAME` duplicates domain; `.nojekyll` exists at root. |
| Deployment | `.github/workflows/deploy.yml`: push to `main` or manual dispatch → Node 20, `npm ci`, `npm run check`, upload `dist/`, GitHub Pages deployment. Do not push main or dispatch without explicit production authorization. |
| Metadata | `src/layouts/BaseLayout.astro`: title, description, canonical from `canonicalPath`, index/follow robots, Open Graph/Twitter, icons, manifest, JSON-LD. Preserve this shell. |
| Schema | Base Organization (Quiet Tools), support-team Organization, WebSite, WebPage; optional visible BreadcrumbList. Homepage SoftwareApplication `#app` plus visible FAQPage; landing/pricing pages reference `#app`; `ArticleLayout.astro` adds Article and published/modified dates; checklist ItemList. |
| Sitemap | `scripts/generate-sitemap.mjs` discovers actual `dist/**/*.html`, not planned registry entries. Current sitemap has 43 routes. `public/robots.txt`: allow all, production sitemap URL. Quiz makes 44 if no routes removed. |
| Shared UI | `Header.astro`, `Footer.astro`, `AppStoreLink.astro`, `ProductScreenshot.astro`, `ProductBlock.astro`, `PageCta.astro`, `Breadcrumbs.astro`, `RelatedLinks.astro`, `LegalArticle.astro`. `LandingLayout.astro` and `ArticleLayout.astro` protect existing content structure. |
| Registry | `src/data/site.ts`: production origin, App Store URL, support email, pricing, 19 landing pages, 14 articles, 10 core pages. Add quiz metadata only when route exists. |
| Navigation | Header: What you can save → `/home-records-app/`, How it works → `/#how-it-works`, Guides, Screenshots, Pricing, Support; direct App Store badge desktop/mobile, native `<details>` mobile menu with link-close/Escape behavior. Footer groups records, maintenance/guides, app/support and legal. Preserve crawlable access. |
| Styles | `src/styles/global.css`: tokens `--bg #f8f3ea`, `--ink #183a33`, `--muted #59655f`, `--accent #4d8a73`, `--accent-dark #244c42`, sage/amber/red, radius/shadow tokens; later editorial styles use Georgia and system sans. Layered legacy and new rules, media queries at 1100, 980, 860, 800, 760, 560, 480, 380; reduced motion and print rules. Avoid appending unscoped prototype `body`, `h1`, `.brand`, `.card` or `:root` overrides. |
| Brand/media | `public/assets/icons/` app icon and favicons; `public/assets/app-store-badge.svg` existing official artwork per prior QA; `public/assets/og/around-the-house-og-v2.png` 1200×630; manifest in `public/site.webmanifest`; 28 WebPs plus `ipad-front-page.png` in `public/assets/screenshots/new/`. Keep icon and badge; review social image against new direction. |
| App Store | Shared URL `https://apps.apple.com/us/app/around-the-house-binder/id6789646793`; reference sources use same ID. Keep ID, centralize reference hardcoded URLs during extraction. This audit did not retest live listing availability. |
| Support/legal | `/support/` POSTs explicitly supplied support data to FormSubmit, email `support@quiettoolsapps.com`, `_next` success URL; privacy describes GitHub hosting and this processor; `/terms/` links Apple standard EULA. Keep routes and support behavior. No submission during audit. |
| Tracking | No marketing analytics/ad pixels found in website source. Checklist uses localStorage for its own progress. Reference quiz business logic has no storage/network submission. Existing support processor and hosting mean the entire website cannot be described as making no third-party requests. |

Do not run `git-submit.sh` (stages all and pushes) or `fix-github-pages-astro.sh` (rewrites configuration, commits and pushes); neither is a harmless build command. Image/ASO/OG scripts are authoring utilities, not required build steps. `images/` is ignored, so any required source/master used by another agent must be placed in an approved tracked asset location in Phase 2.

## 5. Faithful homepage composition and behavior

Implement prototype sections in this order:

1. Retained app identity and shared navigation, official download badge; integrate a visible quiz entry. Keep existing destinations; preserve `#how-it-works` as a meaningful section so all shared header links continue to resolve. Prototype has no such target.
2. Three-scene hero: filter aisle first, smoke alarm second, water heater third. Headline above, second clause emphasized in green serif; retain subhead “The details you need, the work you’ve done, and what’s coming next. All in one place, right on your phone.” Retain reminder line about paint at the counter, filter size in the aisle and smoke-alarm reminders.
3. Primary official App Store badge and qualified privacy/platform copy. Replace “Two weeks free”, “Try it free”, “Free for two weeks” and “Cancel anytime” with neutral download wording pending verification. “No address” needs onboarding verification; do not turn it into an unsupported absolute claim.
4. Scene captions exactly follow source direction: “Need your filter size at the store? It’s right on your phone.” / “Can’t remember when you tested the smoke alarms? Get a reminder.” / “Need the age and model of your water heater? One tap.” Review “One tap” against the released entry path; change only that literal speed claim if untrue.
5. Immediately following hero, deep forest quiz teaser: cream question card on left and mint CTA/heading on right at wide sizes, one-column mobile stack. Preserve “How well do you really know your house?”, “Six quick questions. One honest score. A little healthy panic. No account, no email.” and “Free · About 2 minutes”. Update Q1 teaser to match approved sealed-battery correction.
6. Below teaser, retain a concise, situation-based `#how-it-works` explanation and crawlable links to useful existing records/guides; retain accurate trust and a modest closing download invitation. **This lower portion is a proposed reuse of current site material, not supplied approved full-page artwork.** Seek review of its composition before filling it with extensive old feature sections. Do not carry over the current homepage's exhaustive capability lists, repeated grids or subscription mechanics as the primary narrative. Existing SEO pages carry the depth.
7. Retained footer with legal/support/editorial links and quiz link.

Prototype carousel: 6-second interval, 0.9-second opacity fade; dots select a scene and pause; play/pause switches state; reduced-motion starts paused. Existing homepage has no carousel to preserve. **Recommend retaining the supplied carousel concept**, refining it for access and art direction rather than deleting scenes for convenience. Pause on hover, keyboard focus and hidden document; manual selection remains paused until explicit play. Listen for reduced-motion changes; use no fade/automatic progression for that preference. Expose one active slide to assistive technology, keep automatic captions out of repetitive live announcements, announce manual changes politely, label dots by scenario and current state. Without JavaScript show the first scene plus crawlable descriptions of the others; all three remain available with enhancement. Enlarge dot hit areas to ≥44×44 (prototype dots are narrow despite 44px height). Explicitly style `[hidden]` SVGs: extracted standalone hero displayed both play/pause icons in audit renders.

Follow supplied `ath-hero/README.txt` copy rules in new marketing copy: no em dashes; no “we” (use the app or homeowner as subject); avoid “everything in it,” “beyond home inventory,” “belongings,” “important details about your home,” “in your head,” “like a pro,” and “zero guesswork.” The quiz has its own approved original voice (including “We’ve all been there.”); do not mechanically rewrite that supplied reaction without marketing review. These homepage rules do not authorize editing existing legal disclosures.

Do not port `.ath-screen` invented markup. Source invented filter buttons/specifications, fake smoke notification/actions and fabricated heater age/warranty/provider are visual placeholders only; they neither prove actual UI nor product functionality. Composite genuine captures into photo masters before responsive exports. Perspective-transform to the actual screen quadrilateral, preserve hand/bezel occlusion and notch, retain capture proportions, apply only scene-consistent lighting/reflection treatment. Never stretch iPad UI into an iPhone, recreate its rows or change visible screenshot text. Have a human review all composites at desktop and mobile render sizes.

## 6. Genuine screenshot mapping and asset gaps

| Required scene | Found authentic evidence | Fit / required capture |
|---|---|---|
| Filter aisle | `public/assets/screenshots/new/ipad-qr-item-details.webp` (2048×2732) shows Furnace & Air Filter → Specifications → Filter Size **16x25x4**, plus brand/model; `ipad-item-record.webp` shows its history/reminders/docs. Raw original: `images/old/ipad/Simulator Screenshot - iPad Air 13-inch (M3) - 2026-07-19 at 13.57.23.png`. | Genuine relevant content exists, but tablet layout unsuitable for the depicted phone. Capture shipping iPhone furnace detail with saved filter size visible, using fictional/sanitized sample records entered in the real app; scroll appropriately. Do not use prototype's invented 16×25×1 data as product evidence. |
| Smoke alarm | `iphone-schedule.webp` shows a **range-hood degrease reminder**, not smoke-alarm maintenance. `iphone-items.webp` visibly includes a **CO detector**, not a smoke alarm. `images/old/iphone/Simulator Screenshot - iPhone 17 - 2026-07-19 at 13.40.46.png` shows generic maintenance-history entries including abbreviated Safety Device Test & Battery entries, not a clearly identified smoke-alarm detail. | No adequate scenario-specific iPhone capture found. Capture actual smoke alarm item/reminder with last test and next due date; optionally a real app-generated iOS notification only if shipping behavior is demonstrated. Never substitute CO equipment, range hood or a fabricated lock screen. |
| Water heater | `iphone-personal-property-documentation.webp` / original `images/iphone/Simulator Screenshot - iPhone 17 - 2026-07-22 at 09.48.53.png` lists **Water Heater** among records needing documentation; iPad item-list capture also lists a heater. These are lists/report evidence, not heater details. | No suitable iPhone heater detail capture with age/model/service found. Capture saved equipment model and installation/date evidence plus actual maintenance history if available. If app has no age calculation, show its real saved date and phrase caption accordingly; do not invent calculated age, warranty or Call Plumbing control. |

Additional genuine files available for retained deeper pages: `iphone-binder.webp`, `iphone-item-history.webp` (Garage Deep Freezer), `iphone-paint-details.webp`, `iphone-paint-templates.webp`, `iphone-paint-new-item.webp`, `iphone-today.webp` (explicit Demo Mode), `iphone-cost-tracking.webp`, `iphone-coverage-comparison.webp`, `iphone-insurance-coverage-overview.webp`, `iphone-home-handoff.webp`, `iphone-health-report.webp`, `iphone-reports.webp`, `iphone-warranty-countdown.webp`; iPad versions cover binder, reports, schedule, Today, insurance, costs, items and handoff. The existing app's “health report” capture is not this website quiz; keep them clearly distinct.

Missing/inadequate deliverables: three ≥2400px scene masters, crop alternatives that retain phone and contextual equipment/shelves, three current iPhone scenario captures, completed realistic composites and responsive AVIF/WebP/JPEG variants, font binaries/licenses if matching custom typography, final lower-page composition approval, new social preview if required, documented commercial rights for photos/people/editing. No proof of rights is included. Reuse existing official badge, not supplied placeholder. No image replacement or compositing performed in this phase.

## 7. Quiz audit: current logic and interaction

Actual app is vanilla DOM JavaScript inside an IIFE. No framework/library is required. Six questions with four choices each; exact copy, points, shared feedback, tips and deterministic per-answer reactions are transcribed in Appendix A. Core UI uses Fraunces + Instrument Sans; homepage uses Newsreader + Instrument Sans. Preserve that source distinction unless marketing approves consolidation.

- Green `g` = **Pro move**, 2 points; yellow `y` = **Getting there**, 1; red `r` = **Uh oh**, 0. Maximum **12**, minimum 0. Q1 has two green and two red answers (no yellow).
- Bands tested highest minimum first: **11–12 House whisperer**, **6–10 Mostly on it**, **0–5 Your house is keeping secrets**. Exact band descriptions appear in Appendix A.
- `state = {i: 0, picks: []}` in memory only. A click stores answer index and rerenders that question, disables **all four** choices, shows tone labels on all choices, reveals reaction, Rule of thumb and Why it matters/source label, then focuses Next. Q-specific rule/why is identical for every answer; only tone and reaction vary. Reaction uses `(questionIndex + answerIndex) % REACT[tone].length`, not randomness.
- No back button, edit answer, skip or native history integration. Browser Back navigates away; refresh resets all answers. Next increments question; last says See my score. Question transition scrolls to page top but does **not** focus new question heading. Results similarly lack explicit focus. This loses the focused Next element and is an accessibility gap.
- Progress is Question N of 6 plus topic; six visual segments show answered tones and current blank question. Track is aria-hidden, text remains readable. Results show score, category, tone counts and all six recommendations.
- Recommendation sorting: red first, then yellow, then green; ties by original question index. This is severity-first plus fixed order, **not independent safety-risk weighting**. Example: red contractor record precedes yellow smoke alarm. All six rules appear; tips only for yellow/red. Source says “Start with the reds, top to bottom. The smoke alarms first,” but code does not always put smoke first. Add a clearly labeled smoke-alarm attention message when applicable, and review dryer/safety ordering rather than implying score certifies safety.
- Restart (“Take it again”) resets index/picks and renders Q1, smooth-scrolls top; does not focus Q1. No persistence or backend.
- Sharing: readonly link and Copy my score to share. Text is `I scored N/12 on the Home Health Check (“CATEGORY”). Bet you can’t beat it: URL`. `navigator.clipboard.writeText` with rejection/unsupported fallback selecting URL input and status “Select the link above and copy it.” Successful branch status is “Copied. Paste it anywhere to challenge a friend.” Fallback exposes only the URL, not the full score text. No image sharing, Web Share API, result permalink encoding, or recipient-specific results. **SHARE_URL currently points to `https://claude.ai/artifact/Hmojei4atcQ2HhNWGPUuub`**; production must use canonical quiz URL with no answers or score in it.
- Results CTA “Around The House remembers all of this for you.” + filter/battery/install/pro details; App Store action **“Try it free for two weeks”** must become neutral download. Checklist link `https://aroundthehouseapp.com/annual-home-maintenance-checklist/` opens new tab; preserve accessible availability for all visitors, not only non-Apple visitors. App link same verified repository app ID.
- Dependencies: native DOM, matchable CSS, Clipboard API, browser scrolling; Google Fonts stylesheet/remote font binaries. Claude frame scripts and capabilities are wrapper infrastructure, not quiz dependencies. Saved HTML carries stale prerendered Q1, which script replaces; remove that duplicate implementation during extraction.
- Responsive: centered 620px max column, body 16px horizontal padding, card 22px padding, vertically stacked ≥52px answers, wrapping action/share rows, clamp headings, light/system-dark and explicit data-theme CSS. Narrow cards wrap question count/topic. Broad selectors would collide with BaseLayout/footer. Scope all quiz styles and map theme intentionally.
- Existing accessibility strengths: real buttons, answer group label, question aria-labelledby, traffic tones paired with text, focus outlines, copy status, text progress. Issues: broad whole-stage live region, disabled answer focus transition, new-question/results/restart focus missing, result title is paragraph while CTA is h3, aggregate dots accessible name may lack useful role, no selected-answer state until disabled, tiny source/footer text, unverified light/dark contrast, JS-required experience without useful no-script explanation, forced smooth scroll despite CSS reduced-motion rule (JS explicitly requests smooth). Correct these without flattening the personality.

## 8. Maintenance accuracy and copy corrections requiring review

Exact original copy is preserved in Appendix A for traceability; corrections below are proposals for approval, not implemented changes. Sources were researched October 11, 2026. Use linked primary sources and model manuals rather than unsourced universal intervals.

| Topic / current concern | Required production correction |
|---|---|
| Smoke batteries question penalizes sealed-battery owners and never asks about testing | Keep six-question flow; revise Q1 to cover testing/model-aware care or add a clearly worded sealed-battery answer with appropriate scoring. Include monthly testing, manufacturer-directed replaceable-battery care and whole-unit replacement at end of life. A disconnected/removed alarm needs immediate restoration of working protection, not only a yearly birthday reminder. Do not award safety assurance for a recent battery change alone. [USFA testing](https://www.usfa.fema.gov/gallery/pictographs/pictograph04.html), [USFA alarm replacement](https://www.usfa.fema.gov/gallery/pictographs/pictograph28.html); USFA smoke-alarm search result confirmed model distinction, but full main page fetch returned 503. |
| “Nearly 3 in 5” fire statistic | Broad claim is corroborated by [NFPA smoke-alarm guidance](https://www.nfpa.org/education-and-research/home-fire-safety/smoke-alarms); link source with period/context if retaining statistic. Do not apply it as an individual quiz prediction. |
| Universal furnace “at least every 90 days”, good answer “last 3 months” | Replace rule with “Check it monthly. Replace or clean it on your filter and system's schedule, sooner if it is dirty.” Consider thicker/reusable filters, pets/dust/heavy use and manufacturer limits. A blanket 90-day score cannot certify compliance; revised answers should ask whether visitor follows their equipment schedule. Existing `/resources/how-often-to-change-furnace-filter/` already uses this model-aware approach. [ENERGY STAR maintenance checklist](https://www.energystar.gov/saveathome/heating-cooling/maintenance-checklist), opened during this audit, supports a monthly filter inspection/clean/change routine; the final interval still needs the relevant model instructions. |
| Dirty-filter “raise energy use by 5% to 15%” | Do not treat a reported reduction from replacement as an identical increase, or guarantee household savings. Prefer qualitative airflow/efficiency wording. DOE maintenance pages returned 404 during research; exact percentage remains unverified and should be omitted unless an accessible primary source establishes wording/context. [DOE cooling infographic](https://www.energy.gov/downloads/energy-saver-101-home-cooling-infographic) is a candidate supporting resource, not proof of all current quiz phrasing. |
| Dryer once-a-year rule / “likely clogged” | Keep yearly check/clean as general planning cue, follow model instructions and respond sooner to reduced airflow/long drying; long drying has other causes. Preserve lint-screen-per-load distinction. Do not add unsafe gas/electrical disconnection instructions. Current [USFA appliance guidance](https://www.usfa.fema.gov/prevention/home-fires/prevent-fires/appliance-and-electrical/) supports failure-to-clean significance with 2018–2020 context; old footer cites 2012 report without link. Link preserved existing dryer guide for detailed safe workflow. |
| Dishwasher every month/two and “twist it out” for everyone | Some models have self-cleaning systems; removable type, frequency, removal and reinstall depend on model/use. Say “Check your manual. If yours has a removable filter, clean it on its schedule and lock it back in place.” Preserve playful “Spoiler” line conditionally. [Whirlpool filter guidance](https://producthelp.whirlpool.com/Dishwashers/Product_Info/Dishwasher_Cleaning_and_Care/How_to_Clean_the_Dishwasher_Filters) supports frequency variation and correct installation; do not generalize its mechanism to all models. |
| Heater “Most last 10 to 15 years” / label “date” | Qualify **storage** heaters; tankless differs. Manufactured date may be encoded in serial number and differ from installation date. Record verified installation/manufacture evidence and check model instructions; age is planning information, not a leak prediction or guarantee. [DOE Energy Saver guide](https://www.energy.gov/sites/default/files/2022-08/energy-saver-guide-2022.pdf?lv=true) distinguishes storage and tankless lifetimes. |
| “33% of homeowners say finding a reliable contractor is stressful” | [HomeServe 2025 announcement](https://www.homeserve.com/en-us/media/homeserve-survey-reveals-alarming-gap-between-homeowner-preparedness-and-reality-of-home-repair-emergencies/?gm-vt=1) places 33% among cited impacts when repairs are delayed; existing text broadens population/context. Prefer “A good contractor is worth remembering. Save the name before the invoice disappears.” Retain exact statistic only with faithful context. |
| Score as health/safety certification | Keep playful bands, show “A quick reminder check, not a home inspection or safety certification. Follow your equipment instructions.” Existing general-advice footer is a start. Never say a high score means a safe home; give safety actions independently of total. |

Human review must approve revised Q1/answer scoring, furnace/dishwasher applicability and safety recommendation treatment; Appendix A records original rules so changes can be compared. Do not silently add a seventh question, change thresholds or substitute a different quiz concept.

## 9. Integration architecture (proposed files, not created)

- `src/pages/home-health-check.astro`: BaseLayout with unique title/description, `canonicalPath="/home-health-check/"`, single `main id="main-content"`, visible h1/intro, a quiz component, disclaimer/sources and useful no-script guide/checklist links. Do not iframe the saved artifact.
- `src/components/HomeHealthCheck.astro`: scoped widget markup, stable status region, state-specific question/results headings; controller imported in Astro `<script>` for bundling. Keep header/footer and main supplied only once by layouts/page.
- `src/data/homeHealthCheck.ts`: typed approved question/choice/tone/feedback/tip/band data, stable IDs, source URLs, explicit point values. Record approved corrections alongside tests, not runtime Claude exports.
- `src/scripts/home-health-check.ts`: memory-only state, render/transition/focus, results ordering, restart/share. Extract scoring/category/order into pure functions for meaningful tests. Retain six questions and 12-point maximum unless review expressly changes them. Prevent next before answer and double-advance.
- `src/styles/home-health-check.css`: widget-scoped selectors and component variables for original palette, answer touch targets, dark theme if approved, reduced motion. No global `body`, `footer`, `.brand`, `.btn` collisions.
- `src/components/HomeStoryHero.astro`, `HomeHealthCheckTeaser.astro`, `src/scripts/home-story-hero.ts`, `src/styles/home-story.css`: faithful hero/teaser extraction with real composites. Keep all scenes in data/markup and avoid extra UI framework.
- `public/assets/home-story/`: final responsive composites/crops only; source master provenance in `docs/design-reference/` or another agreed tracked source location. `public/assets/fonts/` only if licensed font files obtained. Do not commit temporary audit paths as dependencies.
- Update `src/pages/index.astro` to compose new hero/teaser and approved lower sections; `Header.astro`/`Footer.astro` link quiz; `src/data/site.ts` register route and approved product values; `/resources/` adds quiz entry while retaining guides/checklist.

Sharing uses static `new URL('/home-health-check/', siteUrl)`; never take a tracking query/current arbitrary fragment into shared URL. Await clipboard result, provide full share text in fallback selectable field, keep role=status, optionally add native sharing only after feature detection and a user gesture. No automatic clipboard operations. Back/edit is a **proposed usability improvement**, not an existing feature: permit previous question and answer correction without point accumulation; recalculate total from picks. Keep forward feedback pause rather than auto-advance. Native browser back remains navigation unless deliberately reviewed otherwise. No localStorage for quiz by default, no answers in query strings, no calls to support processor. Fonts served locally or use the deliberate serif/system fallback; never carry frame-runtime network machinery.

## 10. Responsive and image-delivery plan

Audit renders used offline font fallbacks; final font metrics must be rechecked. Prototype has no horizontal overflow at 1440, 1024, 834, 390 and 320 pixels, but **absence of overflow is not visual adequacy**: at 1024 the overlay text exceeds the 576px-high banner and controls/caption overlap teaser/header; at 390 the photo starts around y=907 and heater screen is only ~57px wide; at 320 photo starts around y=1044 with screen ~47px wide. This buries mandatory photography and makes screenshot text unreadable. Filter/smoke screens are smaller still. These defects justify refining the supplied responsive composition.

| Viewport | Proposed behavior / review gate |
|---|---|
| Large desktop ≥1440 (also 1920/2560) | Cream left text fade over scene as supplied; keep people/phone right unobscured. Cap readable content width and hero height, use a bounded composition instead of stretching a low-res scene full screen. Text may determine minimum height; no clipping/overlap. All three captions and phone regions inspected. |
| Laptop 1024–1439 | Overlay only if copy, badge and controls fit. Use content-driven min-height/aspect treatment or stack before the supplied 900px switch when composition fails. No caption underneath teaser. Test 900/980/1024 transition and final font sizes. |
| Tablet portrait 768–1023 | Prefer text above photograph, hero story immediately visible, art-directed crop; teaser stacks when cards cannot fit comfortably. Preserve shared tablet navigation. Test 768×1024 and 834×1194. |
| Tablet landscape 1024–1366 | Overlay when it passes fit/legibility, otherwise two-zone stack; verify short height 1024×768 and 1194×834. Orientation changes retain slide and quiz state. |
| iPhone 375–430 | Keep headline/subhead/download concise above a taller scene crop; place trust/control details after photo if needed to avoid 900px of pre-photo copy. Preserve wording/direction while grouping more economically. Show meaningful photo in first/early scroll. Manual scene selection available, reduced motion still respected. |
| Small mobile 320–374 | Single column, ≥16px body text, ≥44px controls, no compressed multi-column options; shared brand may use icon with full accessible name. Tall crop and literal text caption communicate scene; no min-width overflow or image clipping. |

Create per-scene `<picture>` art direction: desktop 16:9 master plus mobile roughly 4:5/3:4 crop as composition permits. Crop filter aisle around phone+shelves; smoke photo must retain alarm above/left and phone, heater photo must retain tank+phone. Do not crop away the homeowner context or enlarge the blank-screen placeholder. If a simple crop cannot keep both anchors, obtain a suitable alternate composition from the same approved scene, subject to review.

A truthful full app screen will not have all text readable at 47–57px. Aim for a visibly genuine key field in the larger crop, and provide a separately displayed **unaltered genuine screenshot detail** near its caption when necessary; this is supporting product evidence, not replacing required phone photography. Do not fake larger field labels inside the composited screen. Approve this mobile treatment against real capture/composite before coding final breakpoints.

Generate width variants around 480/768/1200/1600/2400 as master permits, AVIF/WebP with JPEG fallback; correct `sizes`, explicit width/height/aspect ratios. Eager/high priority for first active hero only; defer remaining slides without blank first switch, lazy-load below-fold imagery. Preload only the selected first art-directed resource if justified. Keep photo captions as real text, meaningful alt per active scene, decorative fades ignored. Review phone visibility for each crop at device pixel ratio 1/2/3.

## 11. Existing URLs and SEO to preserve

Every existing page stays available at its current slash path. Source path is `src/pages` + route slug + `.astro`, or `src/pages/resources` + article slug + `.astro`; `/` and `/resources/` use their respective `index.astro`. No redirect or deletion is recommended.

| Group | Exact routes | Treatment |
|---|---|---|
| Main/utility (10) | `/`, `/annual-home-maintenance-checklist/`, `/screenshots/`, `/pricing/`, `/resources/`, `/support/`, `/about/`, `/editorial-standards/`, `/privacy/`, `/terms/` | Homepage presentation replaced; pricing claims aligned after confirmation; resources/gallery/navigation get quiz/story links and visual consistency. Checklist behavior/CSV/print, support form, legal substance and editorial identity retained. Legal disclosures change only for verified data-flow/product changes. |
| Records/use cases (19) | `/home-records-app/`, `/home-maintenance-app/`, `/home-maintenance-tracker/`, `/home-maintenance-records/`, `/digital-home-binder/`, `/home-maintenance-reminders/`, `/new-homeowner-app/`, `/home-inventory-app/`, `/home-warranty-tracker/`, `/appliance-maintenance-records/`, `/paint-color-tracker/`, `/home-handoff-report/`, `/private-home-maintenance-app/`, `/homezada-alternative/`, `/household-management-app/`, `/home-repair-cost-tracker/`, `/home-contractor-records/`, `/home-document-organizer/`, `/home-maintenance-calendar/` | Preserve search intent, substantive explanations and genuine screenshots. Harmonize shared chrome; correct stale price/entitlement copy only where verified. Comparison's dated competitor claims need fresh source review if edited. |
| Resource guides (14) | `/resources/water-heater-maintenance-checklist/`, `/resources/how-to-test-sump-pump/`, `/resources/annual-hvac-maintenance-checklist/`, `/resources/how-to-clean-gutters-safely/`, `/resources/how-often-to-test-smoke-alarms/`, `/resources/seasonal-home-maintenance-checklist/`, `/resources/how-to-change-carbon-monoxide-detector-battery/`, `/resources/how-to-clean-bathroom-exhaust-fan/`, `/resources/how-often-to-change-furnace-filter/`, `/resources/how-to-clean-refrigerator-coils/`, `/resources/how-to-clean-dryer-vent/`, `/resources/how-to-keep-track-of-home-maintenance/`, `/resources/home-maintenance-records-to-keep/`, `/resources/how-to-create-a-digital-home-binder/` | Keep article text/source links, dates, headings, breadcrumbs and related links. Optional contextually appropriate quiz links; do not replace educational content with teasers. |

Preserve unique titles/descriptions except intentional homepage/price updates; canonical production origin and trailing-slash URLs; social titles matching page titles; indexability; one h1/main; `#app` identity/references; Article/publisher schema; robots and sitemap. Do not copy prototype metadata claiming free two weeks. Update SoftwareApplication description to visible new story; remove unsupported offers rather than asserting proposed annual/Professional entitlements. Only emit visible FAQ questions retained on homepage, or relocate corresponding FAQ schema with content. No Quiz/HowTo/safety-rating rich-result claim is required. Retain home fragment `#how-it-works`, inventory `#insurance-records` campaign target and other externally useful fragments where feasible.

No Search Console, traffic or ranking data was available for this audit; “valuable SEO content” is based on the existing focused content architecture, not measured traffic attribution. Sitemap inclusion is verified locally, not proof of indexing.

## 12. Pricing and claim-verification inventory

User's planned direction is **$29.99/year annual subscription and $69.99 Professional version**. This supersedes old marketing targets but is **not proof of live availability, cadence for Professional, or entitlements**. Do not label $69.99 lifetime, annual, per property, team access, business license or “same features” without confirmation. No current `$9.99` was found in `src/` or served public assets; actual current source uses `$14.99` lifetime, which also conflicts with planned direction.

| File/location | Existing claim needing review |
|---|---|
| `src/data/site.ts` pricing array | Monthly Pro 0.99 and Lifetime Pro 14.99; monthly/lifetime descriptions. `corePages` pricing blurb advertises those options. |
| `src/pages/index.astro` FAQ, JSON-LD, hero/demo/trust/closing | FAQ interpolates monthly/lifetime amounts and same-feature claim, mirrored FAQPage; SoftwareApplication free Offer + both paid Offers; closing hardcodes $0.99/month and $14.99 lifetime. Several five-free-items and Pro entitlement statements throughout. |
| `src/pages/pricing.astro` | Title/description mention Free/Monthly/Lifetime and amounts; free tier card, generated plan cards, Pro feature list, identical-entitlement assertion, renewal/cancellation and lifetime terms, dated price note. Download badges themselves neutral. |
| `src/pages/homezada-alternative.astro` | Comparison row hardcodes our $0.99/$14.99; competitor $99/year, $15.95/month, $189/year are separate dated claims, not our proposed prices. |
| `src/pages/home-maintenance-app.astro` | Closing link says Compare monthly and lifetime pricing. |
| `src/components/Footer.astro`, `PageCta.astro`, `src/layouts/LandingLayout.astro` | Free & Pro pricing label; global five-owned-items-free/Pro-document-report microcopy. These propagate claims across many pages. |
| `home-records-app.astro`, `support.astro`, `appliance-maintenance-records.astro`, `home-maintenance-reminders.astro`, `home-inventory-app.astro`, `home-warranty-tracker.astro`, `home-handoff-report.astro`, `digital-home-binder.astro` | Five-item/free/basic-recurrence or contextual Pro attachments/reports claims; recheck against planned tiers, preserve factually accurate behavior. Other landing pages inherit shared claims. |
| Reference `ath-hero/index.html` / `README.txt` | Title-area/meta description, eyebrow, nav Try it free, hero free/cancel copy, README direction to add trial to pricing/App Store. No numeric price. These trial instructions conflict with explicit user verification requirement. |
| Reference quiz script | Results button Try it free for two weeks; no numeric price. |
| `README.md`, `docs/PROJECT.md`, historical redesign/conversion/SEO documents | Old product/pricing descriptions are historical context; update current operational docs during approved implementation and label old audits historical rather than rewriting evidence. |
| `public/` and generated output | No paid offers in robots/manifest/OG metadata source; built HTML inherits source offers/copy. Visual social image should be reviewed separately. Never manually edit `dist/`. |

Focused app source requests `com.quiettools.aroundthehouse.pro.monthly.v2` and `com.quiettools.aroundthehouse.pro.lifetime`; `.storekit` lists recurring P1M monthly and non-consumable lifetime, `introductoryOffer: null`. Guide warns fixtures are not live catalog proof. No annual/Professional purchase implementation found in these focused files. The guide describes a demo-data window separately; it is not evidence of a subscription free trial. Required review: App Store Connect product IDs/types/prices/regions/effective date, actual released purchase screen, annual/Professional feature boundaries, free tier continuation, upgrade/restore/grandfathering treatment and any introductory eligibility/renewal terms.

For implementation before confirmation, use neutral **Download on the App Store**, omit trial/cancel promises and unverified paid Offer nodes, and avoid retaining old purchase options as active marketing. If business owner confirms prices but availability is future, mark as planned only in review material, not a live purchase promise. Do not alter shipping app configuration in this website task.

## 13. Accessibility, performance and maintainability requirements

Keep BaseLayout skip link, language, main landmark and legal navigation. New quiz uses labeled semantic controls, stable feedback role/status and explicit focus on new question/results/restart heading; preserve user choice visibility and offer reviewed Back/edit behavior. Avoid announcing every answer/button on each rerender. Use text labels alongside traffic lights; all informative text ≥4.5:1 and large text/control boundaries ≥3:1 as applicable, in both approved themes. Support keyboard-only flow, 200% zoom, reflow at 320 CSS px, screen readers and accessible share fallback. Honor reduced motion in **JavaScript** scroll and carousel; no forced animation.

Self-host licensed/subset WOFF2 fonts or use deliberate fallbacks: homepage serif Newsreader, quiz Fraunces and common Instrument Sans need exact metrics review. External Google Fonts complicates “nothing sent” privacy language even though answers are not transmitted. Remove frame runtime, unnecessary preconnects and all Claude assets. Do not make quiz dependent on the Font service. Keep answers memory-only and disclose clipboard sharing as user initiated.

Performance targets for final production review: LCP ≤2.5s, CLS ≤0.1, INP ≤200ms where measurable; lab data is not field certification. Target first mobile hero variant ≤200KB where visual quality allows and quiz JS ≤15KB gzip (budgets, not measurements). No framework addition. Measure high-DPR phone compositing quality before overly aggressive compression; avoid loading three full-size photos eagerly. Cache static assets via host behavior; fingerprint bundled CSS/JS. Validate screenshot/image dimensions and `<picture>` variants, and expand validator as needed: existing validator assumes `img src` corresponds to a public file, which may not suit Astro-generated assets without an adjustment.

Keep copy/data separate from controller; stable question IDs and one score calculation prevent double-counting after edits. Centralize product links/prices. Component-scoped styles reduce collisions with existing article/legal pages. Do not remove unrelated CSS wholesale; share shell typography/palette intentionally and limit visual regression scope. Existing `scripts/browser-qa.mjs` asserts old homepage `.hero-actions`, `.question-list` count and `.demo-section`; revise those assertions to the approved new composition rather than keeping obsolete UI to satisfy tests.

## 14. Staged implementation and acceptance gates

### Phase 2: homepage and approved asset preparation

On approval, create/reuse a development branch such as `codex/website-marketing-redesign`; do not develop on or push `main`. Preserve untracked references explicitly; commits should name intended files, not stage everything with helper scripts.

1. Resolve image masters/rights and three capture/composite tasks in Section 6; review final desktop/mobile scene proofs with marketing/product owner. Confirm neutral CTA fallback and claim removal plan; confirm lower-page reuse composition.
2. Extract hero/teaser into proposed Astro components and scoped CSS/controller. Reuse BaseLayout, icon, badge and shared links. Replace old homepage hero/story presentation with selected concept; preserve meaningful `#how-it-works` and routes.
3. Implement responsive images/crops and content-fit breakpoints. Fix clipping/phone visibility, touch targets, carousel pause semantics and no-script fallback. Teaser's answers are currently **navigation links**, not selections; preserve that clear preview behavior initially, without promising that a clicked answer is retained. Do not introduce query-string answers.
4. Align pricing/metadata/shared copy on approved truth; if configuration unresolved, neutralize claims instead of publishing planned product entitlements. Audit all tabled occurrences and schema.
5. In this development-only intermediate stage, the teaser may point at the planned quiz route; **do not release a broken quiz destination**. Combined release requires Phase 3. A temporary broken-route check exception should not enter release CI.

**Acceptance:** all three real scenes present and manually selectable; each composited screen is a current genuine relevant iPhone capture with provenance; no invented HTML screens/placeholder badge; approved headline/subhead/personality/teaser reproduced; all copy fits 320–2560 widths and tablet orientations; no motion for reduced-motion; photography visible promptly on mobile; scenario information available as text; official neutral download CTA and no unsupported prices/trial promises; preserved route/fragment/schema inventory. Marketing approves visual fidelity before proceeding to final polish.

### Phase 3: mandatory native quiz integration

1. Extract original question data/controller independently of frame scaffolding; apply approved accuracy corrections with original-to-new copy/scoring record. Implement `/home-health-check/`, component/data/styles/controller files as Section 9.
2. Preserve six-step feedback, original reaction voice, 12-point score and categories; add approved Back/edit and safety attention treatment without unintended score changes. Improve heading/focus/status behavior, no-script guidance, restart and sharing.
3. Replace Claude share target and trial CTA, reuse AppStoreLink/central URL, link checklist and primary sources locally. Link quiz from hero, navigation/footer/resources and register it in `site.ts`.
4. Add meaningful tests for category boundaries 0/5/6/10/11/12, score range, all choices and recommendation order, correction/back recalculation, restart, duplicate-click protection and clipboard success/rejection/unavailable paths. Check all-green versus all-red and high-total/safety-red cases. Reevaluate expected matrix if answer count changes for applicability.

**Acceptance:** quiz works entirely on site with no Claude/runtime/backend requests; no answers saved/sent; all six questions and feedback accurate and reviewed; corrected model-specific safety copy; score/bands/order deterministic; no false safety certificate; keyboard/screen-reader focus predictable; answer controls meet size/contrast/reflow requirements; share text/canonical/fallback correct; App Store/checklist/source links correct; new route linked and included in 44-route sitemap. No unresolved UI/schema trial claim remains.

### Phase 4: polish, full regression, release-readiness report

1. Run `npm run check`, revised browser QA and new quiz tests against production preview. Retain all 43 baseline routes and add quiz. Test 320/375/390/430/768/834/900/980/1024/1280/1440/1920 widths, portrait/landscape tablets, keyboard, reduced motion, dark theme if kept and 200% zoom. Validate each carousel scene and orientation/state changes.
2. Inspect representative landing/article/gallery/pricing/support/legal/checklist pages for shared-style regression. Exercise checklist persistence/reset/CSV/print and support validation/success state without sending mail. Confirm known fragments, badge ID, images/fonts, canonicals, sitemap/robots, JSON-LD-visible copy and no invented offers.
3. Run Chromium plus Safari/iOS Safari and physical Apple-device checks when available; report unavailable coverage honestly. Audit HTTP/network requests on production-like origin, HTTPS clipboard success/fallback, image decoding and no frame hosts; measure performance and contrast. Confirm rights and capture/release version before approval.
4. Write release-readiness report with screenshots, asset provenance, checks, remaining risks and pricing configuration evidence; review development branch diff. **No production deployment without explicit authorization.** Only after authorization merge/push main or dispatch deployment; then verify live status/canonicals/links/sitemap. Do not treat approval for Phase 2 as production permission.

**Acceptance:** baseline and quiz validations pass; no visual clipping/overflow at target sizes; genuine phone captures legible enough to communicate key detail with honest supplemental view as needed; no broken scene/caption or hidden-control issue; SEO routes retained; all claim/asset/copy blockers resolved or unsupported claim omitted; release report distinguishes actual tests from pending coverage; owner explicitly approves production.

## 15. Risks, blockers, and human decisions

| Priority / issue | Owner decision / resolution |
|---|---|
| Blocking final Phase 2 imagery | Obtain full-size originals and rights; capture all three real iPhone screens. Relevant iPad furnace data exists but is not a phone-screen substitute. No fictional screenshot fabrication. |
| Blocking faithful mobile proof | Approve art-directed crop/supporting unaltered screenshot detail so phone UI and homeowner context remain meaningful. Current 16:9-only treatment is inadequate. |
| Blocking published paid/trial claims | Release/business owner confirms annual $29.99 availability and $69.99 Professional meaning/entitlements; verify trial terms or omit them. Current focused app source only supports monthly/lifetime IDs. Neutral CTAs permit website work while unresolved. |
| Quiz factual review | Approve sealed-battery/testing answer, equipment applicability and corrected statistics/rules; keep tone and six questions. Decide safety-first attention treatment independently of points. |
| Quiz Back/edit | Approve usability improvement; original has none. No need for server/history/URL persistence. |
| Full-page scope | Reference supplies header/hero/teaser only; review restrained reuse below rather than assuming a full creative layout was supplied. |
| Typography/theme | Approve keeping Newsreader homepage and Fraunces quiz with common Instrument Sans, or deliberate fallbacks; obtain licensed self-hosted fonts. Decide quiz dark-mode continuity with shared shell. |
| Release automation | main push publishes automatically. Keep implementation development-only, avoid helper push scripts, explicit production approval required. |
| Current-release truth | Screenshot dates/version and local app checkout do not prove exact shipped UI/entitlements. Release owner must review captures and purchase configuration. |
| Verification limits | No Search Console/field CWV, private Store Connect access, live price/trial verification, source photo rights, full-size Canva retrieval, Safari/physical-device testing or app capture performed. Do not represent these as complete. |

Recommended order: approve plan → prepare real captures/masters and resolve copy/product decisions → Phase 2 homepage → Phase 3 quiz (required for combined release) → Phase 4 regression and release review → explicit deployment approval. Stop here until Phase 2 approval.

## 16. Checks actually performed in this audit

- `npm run check` passed: Astro static build, 43 routes, unique metadata, canonicals/social titles, main/h1, image existence/dimensions, JSON-LD syntax, internal links/fragments, App Store IDs and sitemap coverage. This rebuilds ignored generated output only; no website source implementation.
- Isolated headless Chrome tests of **extracted original quiz logic** with all external requests blocked: 30 complete journeys (six score patterns at 1440/1024/834/390/320), expected scores/categories, four-choice locking, next/results and restart; no page exceptions. Tested 0,5,6,8,11,12 through rendered flow. Exhaustive original-data scoring check covered all **4,096 answer combinations**, valid 0–12 scores/category selection. This is not a test of future corrected data or production integration.
- Standalone original hero rendered at same five widths with reduced motion; manual third-scene selection exercised. Screenshots reviewed at 1024 and 390; original quiz 320 reviewed. No horizontal overflow observed for those hero views. Identified content overlap and inadequate mobile screen size. Autoplay timing, actual font loading, all-scene final crops, Safari and screen-reader interaction were not tested.
- Copy button was invoked in local-file audit environment; link value verified as Claude. Captured status remained empty at observation, so neither real clipboard success nor rejection fallback was confirmed. Production HTTPS clipboard tests remain required.
- Temporary evidence: `/tmp/ath-redesign-audit/browser-report.json`, `audit.mjs`, `hero-{width}.png`, `quiz-{width}.png`, image contact sheets and extracted files. These are ephemeral diagnostics, not a maintained repository test suite. Existing older QA artifacts in `docs/design/conversion/` were context, not newly rerun full-site browser QA.

## Appendix A. Exact original quiz content and answer-specific feedback

This appendix transcribes the supplied implementation, including claims that need correction. It is audit evidence, not approved maintenance guidance. Table reactions are computed from the original deterministic formula; each answer additionally receives its question's identical Rule of thumb and Why it matters below. Tips appear in results only for non-green answers.

### Q1: Smoke alarm batteries

**Question:** When did you last change your smoke alarm batteries?

| Exact answer choice | Tone / points | Exact reaction for this answer |
|---|---|---|
| Within the last 3 months | Pro move / 2 | Look at you. |
| Within the last year | Pro move / 2 | Gold star. |
| No idea | Uh oh / 0 | No judgment. Some judgment. |
| I took it down when it chirped | Uh oh / 0 | Oof. You’re not alone. |

**Rule of thumb:** Once a year. Replace the whole alarm every 10 years.

**Why it matters:** Nearly 3 in 5 home fire deaths happen in homes where smoke alarms are missing or not working. Have 10-year sealed alarms? No batteries to change, just watch the date.

**Displayed source:** NFPA

**Result tip (yellow/red only):** Pick one date a year, like your birthday, and change them all at once.

### Q2: Furnace filter

**Question:** When did you last change your furnace filter?

| Exact answer choice | Tone / points | Exact reaction for this answer |
|---|---|---|
| In the last 3 months | Pro move / 2 | Gold star. |
| Sometime this year | Getting there / 1 | We’ve all been there. |
| Can’t remember | Uh oh / 0 | Oof. You’re not alone. |
| Totally forgot I needed to do this | Uh oh / 0 | Your house noticed. |

**Rule of thumb:** At least every 90 days. More often if you have pets, heavy use, or a lot of dust.

**Why it matters:** A dirty, clogged filter can raise your AC’s energy use by 5% to 15%.

**Displayed source:** U.S. Department of Energy

**Result tip (yellow/red only):** Write the filter size down so the next store run takes two minutes.

### Q3: Dryer vent

**Question:** When was your dryer vent last cleaned out?

| Exact answer choice | Tone / points | Exact reaction for this answer |
|---|---|---|
| This year | Pro move / 2 | Your house thanks you. |
| A while ago | Getting there / 1 | Not bad. Not great. |
| Never | Uh oh / 0 | Your house noticed. |
| I thought the lint screen was the vent | Uh oh / 0 | No judgment. Some judgment. |

**Rule of thumb:** Clean the vent once a year. Clear the lint screen every load.

**Why it matters:** Failure to clean is the leading cause of clothes dryer fires.

**Displayed source:** U.S. Fire Administration

**Result tip (yellow/red only):** If drying takes longer than it used to, the vent is likely clogged.

### Q4: Dishwasher filter

**Question:** Have you ever cleaned your dishwasher filter?

| Exact answer choice | Tone / points | Exact reaction for this answer |
|---|---|---|
| In the last month or two | Pro move / 2 | Okay, show-off. |
| Once, maybe | Getting there / 1 | Close enough... almost. |
| Never | Uh oh / 0 | No judgment. Some judgment. |
| Wait, there’s a filter? | Uh oh / 0 | Oof. You’re not alone. |

**Rule of thumb:** Every month or two. More often if you skip rinsing.

**Why it matters:** Spoiler: it’s probably gross. A clogged filter is a common reason “clean” dishes come out gritty or smelly.

**Displayed source:** (none)

**Result tip (yellow/red only):** Twist it out from the bottom of the dishwasher and rinse it in warm, soapy water.

### Q5: Water heater age

**Question:** How old is your water heater?

| Exact answer choice | Tone / points | Exact reaction for this answer |
|---|---|---|
| I know exactly | Pro move / 2 | Look at you. |
| Roughly | Getting there / 1 | We’ve all been there. |
| No idea | Uh oh / 0 | Oof. You’re not alone. |
| It came with the house. | Uh oh / 0 | Your house noticed. |

**Rule of thumb:** Know its age. Most last 10 to 15 years.

**Why it matters:** Knowing the age lets you replace it on your schedule, not after a leak floods the basement.

**Displayed source:** U.S. Department of Energy

**Result tip (yellow/red only):** Check the label on the tank for the date, then save it somewhere you’ll find it.

### Q6: Your last pro

**Question:** Could you find the last pro who fixed something in your house?

| Exact answer choice | Tone / points | Exact reaction for this answer |
|---|---|---|
| Yes, in under a minute | Pro move / 2 | Gold star. |
| With some digging | Getting there / 1 | Not bad. Not great. |
| No idea | Uh oh / 0 | Your house noticed. |
| I just Google a new one every time | Uh oh / 0 | No judgment. Some judgment. |

**Rule of thumb:** Save the invoice, name, and number the day of the job.

**Why it matters:** 33% of homeowners say finding a reliable contractor is stressful. The good one is easy to lose.

**Displayed source:** HomeServe 2025

**Result tip (yellow/red only):** Snap the invoice before it disappears into a drawer.

### Exact category descriptions

| Score | Category | Description |
|---|---|---|
| 11–12 | House whisperer | You’re on top of it. Now make sure someone else in your home could be too. |
| 6–10 | Mostly on it | A few things are slipping. Totally normal, and totally fixable. |
| 0–5 | Your house is keeping secrets | No shame. Start with the reds, top to bottom. The smoke alarms first. |

### Exact reaction pools

- Pro move: “Look at you.”; “Gold star.”; “Your house thanks you.”; “Okay, show-off.”
- Getting there: “Not bad. Not great.”; “Close enough... almost.”; “We’ve all been there.”
- Uh oh: “Oof. You’re not alone.”; “Your house noticed.”; “No judgment. Some judgment.”

### Exact introductory and closing copy

- Brand: “From the makers of Around The House”.
- H1: “How well do you really know your house?”
- Introduction: “Six quick questions about the things every house quietly needs. About two minutes. No judgment. Okay, a little judgment.”
- Results CTA headline: “Around The House remembers all of this for you.”
- Results CTA body: “Filter sizes, battery dates, install dates, and the pro you trust, kept with the thing they belong to. Reminders when it’s time. Private, on your iPhone, iPad, and Mac.”
- App CTA: “Try it free for two weeks”.
- Alternate CTA: “Not on Apple? Get the free annual checklist.”
- Share invitation: “Know someone who’d score lower? Send it to them.”
- Privacy footer: “Your answers stay in your browser. Nothing is saved or sent.”
- Guidance footer: “General guidance, not professional advice. Always follow your manufacturer's instructions.”
- Source footer: “Sources: NFPA; U.S. Fire Administration, Clothes Dryer Fires (2012); U.S. Department of Energy, Energy Saver; HomeServe 2025 State of the Home.”

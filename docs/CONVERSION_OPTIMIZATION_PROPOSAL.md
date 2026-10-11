# Around The House — conversion audit and approval proposal

Prepared October 10, 2026. Status: proposal only; no website or app implementation changes made.

The requested outcome is more qualified downloads, more homeowners saving their first real item, and more Pro customers. The recommendations below preserve the current checkout’s design, typography, components, and URLs. Expected impact is a hypothesis, not a measured uplift.

## Evidence and scope

Reviewed the homepage, shared navigation and CTA components, pricing, privacy, campaign landing pages, deployment configuration, saved responsive screenshots, and the public homepage/pricing/App Store pages. Product evidence comes from `/Users/ecross/Documents/personal/apps/Tendory/Tendory/MARKETING_FEATURE_GUIDE.md` and focused reads of current app source.

There are two website baselines. The current checkout has the newer “Everything about your home. Without the spreadsheets.” homepage and a Free section on pricing. The public pages retrieved during this audit show the earlier “Your home has a history. Keep it.” hero and introductory lifetime offer. Confirm the deployed revision before publication; retrieved web content can lag a deployment. Implementation should improve this checkout, rather than recreate its design from the public version.

The app project identifies version `2026.09.18`, build `14`; the public listing also identifies version `2026.09.18`. Matching version strings do not establish that every local change shipped. The app checkout has local modifications, and the feature guide expressly distinguishes implementation from release availability. No production app device tests or App Store Connect price-schedule inspection were performed in this audit.

## A. Conversion audit

| Area | Working and worth preserving | Weak or missing | Recommendation |
|---|---|---|---|
| Positioning | Strong primary proposition; Capture / Find / Remember framework; practical examples; consistent cream/green visual identity | Free entry and example home are supporting details rather than immediate reasons to try | Keep the headline; make free start and example-home exploration visible in the hero |
| Download path | Direct App Store links; correct app ID `6789646793`; hero and closing badges | Header download is hidden inside the mobile menu; visible labels omit “Free”; long mobile page separates hero from the next download opportunity | Visible mobile header action, “Download Free” text buttons, and a feature-end CTA |
| Demo | Existing homepage explanation and FAQ; authentic screenshot asset with explicit Demo Mode banner | Demo section is text only, below a long narrative; no demonstration of the preloaded experience | Add a genuine demo capture to that section and a short hero mention; retain existing section styling |
| Tangible benefits | Paint, furnace specifications, history, providers, and real screenshots already tell useful stories | Four requested questions are dispersed; warranty question absent from homepage; documents and advanced schedules sometimes read as universally free | Compact four-question summary; identify Pro features where introduced |
| Free / Pro | Local pricing page leads with five free items; monthly and lifetime choices; central prices | Pro cards list only three benefits; Free capabilities and owned-item counting unclear; generic feature list blurs entitlement boundaries | Explicit comparison using existing list/card styles; explain five owned items across the app |
| Differentiation | “The answer belongs with the item” and filing-system story work well | Opening comparison is more abstract than the requested Photos/email/text scenario | Replace the intro paragraph with the concrete scattered-information example |
| Trust | No separate account; same-account private iCloud; privacy link; no fabricated social proof | Offline use and user-controlled Pro backups missing; property-sharing claim conflicts with app Settings; website/support processing is not clearly distinguished from app storage | Narrow, factual trust copy and privacy clarification; stop advertising sharing pending release verification |
| Campaign readiness | Existing paint, warranty, appliance, inventory, document, and handoff pages; real report captures; established SEO URLs | Insurance campaign lacks a focused section; report/attachment Pro requirements and handoff limits need clarity | Reuse existing pages; add an insurance section to inventory; align campaign promise, screenshot, metadata, and CTA |
| Measurement | No marketing SDK or analytics script found in reviewed website/app code; App Store Connect available as an Apple reporting route | No observed website event collection; custom demo/activation events absent; no campaign-link configuration | Start with Apple campaign links and a campaign register; treat web/app event collection as separately approved work |

Five-second assessment: the checkout communicates what the app does and why it helps. Visitors can find the download badge and free allowance. The example home is not visible near the first decision, and mobile navigation conceals its download action. These are the highest-value changes without a redesign.

## B. Prioritized implementation plan

Effort describes relative implementation and QA work, not a delivery guarantee.

| Rank | Proposed change | Expected impact | Effort | Files / dependencies |
|---|---|---|---|---|
| 1 | Make “Download Free” the visible primary action in shared navigation, hero, feature-end demo section, and closing section; retain “See How It Works”; expose header download outside mobile menu | High: clearer next action and free entry | Small | Header, AppStoreLink, PageCta, LandingLayout, homepage, existing CSS |
| 2 | State “iPhone, iPad & Mac · Up to five home items free” and “Explore a preloaded example home before adding your own” near hero actions | High: addresses platform, cost, and setup uncertainty | Small | Homepage; no headline or layout replacement |
| 3 | Strengthen existing demo section with requested headline/copy and authentic `iphone-today.webp` capture, labeled “Example home in Demo Mode” | High: makes exploration concrete | Small–medium | ProductScreenshot and existing demo grid; compare capture with released UI before publication |
| 4 | Complete Free/Pro comparison and add contextual Pro labels for attachments/reports | High for qualified upgrades | Small–medium | Pricing, FAQ, shared CTA microcopy and affected landing pages; release entitlement check |
| 5 | Add compact four-question summary within existing features introduction, using current list styles; update differentiation paragraph | Medium–high: faster comprehension | Small | Homepage; keep detailed narrative and its screenshots |
| 6 | Explain offline records, same-account sync, and Pro exports/backups; remove promotional property-invitation claim; reconcile privacy/support processing | Medium: trustworthy claims | Small | Trust, privacy, private-app and comparison pages; sharing remains unadvertised |
| 7 | Tune existing campaign pages, with insurance anchor on inventory; prepare link register | Medium; particularly valuable for paid traffic | Medium | Existing pages and central page metadata; no new routes |
| 8 | Configure App Store Connect campaign links after obtaining actual provider token; optional web and app instrumentation only under a separate reviewed scope | Necessary for evaluation; no assumed immediate uplift | Small for link configuration; larger for collection | Apple account access; new ingestion infrastructure if web/app events are requested |

Recommended approval scope: ranks 1–7, including release checks for newly advertised features. Rank 8 initially covers the measurement plan and campaign register only. It does not approve analytics collection, SDKs, new infrastructure, price changes, app changes, or deployment.

Do not restore a November 1 promotion or advertise a 14-day duration solely from source or historical website copy. Those require the release/business checks below.

## C. Current and proposed copy

The current column describes this checkout unless explicitly marked public.

| Location | Current | Proposed |
|---|---|---|
| Main headline | “Everything about your home. Without the spreadsheets.” | Keep unchanged |
| Hero lead | “One place for everything you need to remember about your home, with reminders built in.” | “Keep paint colors, appliance details, repair history, and reminders together—so there’s less to remember and one place to look.” |
| Primary action | Badge / “Download on the App Store” | Visible text button: **Download Free**. Retain the official badge where useful; never alter the wording inside Apple’s badge artwork. |
| Secondary action | “See how it works” | **See How It Works**, linked directly to `#how-it-works` |
| Hero microcopy | “iPhone, iPad & Mac · Start with five items free” | “iPhone, iPad & Mac · Up to five home items free” plus “Explore a preloaded example home before adding your own.” |
| Differentiation | “Notes for the paint. A spreadsheet for the appliances. A binder for the receipts…” | “Your furnace filter size is in Photos. The repair receipt is in email. The plumber’s number is in a text. Around The House keeps the details connected to your home, so they’re easier to find when you need them.” |
| Demo heading | “See how it works before you set up a thing.” | **Explore a home before adding your own.** |
| Demo body | “Open Demo Mode in the app… See how items, documents, and maintenance history fit together…” | “See how Around The House works with a preloaded example home. Explore maintenance reminders, appliance details, warranties, documents, and home records before setting up your own.” |
| Demo caption / action | No screenshot; App Store badge | “Example home in Demo Mode. These are sample records.” / **Download Free** / “Then start your own home with up to five items free. Document attachments and reports for your own records require Pro.” |
| Trust | “No Around The House account. No advertising trackers… private iCloud sync when enabled.” | “No separate Around The House account required. Keep and use your home records locally, including offline. When enabled, private iCloud sync keeps them available across supported devices signed into the same Apple Account. Pro adds exports and full backup and restore, with files you choose where to keep.” |
| Free heading | “A place for your first five items.” | **Start with up to five home items free.** Supporting copy: “Save item details and history, organize your home, and set one-time, weekly, or monthly reminders. The limit applies to owned items across the app; example-home items don’t use that allowance.” |
| Pro benefits | “Unlimited items / Document attachments / PDF exports” | “Unlimited owned home items; document attachments; quarterly, six-month, yearly, and custom reminders; supported PDF reports and CSV exports; full backup and restore; printable QR labels.” |
| Plan actions | “Get Around The House” | **Download Free**, with “Upgrade to Pro in the app when you need more.” Both plans unlock the same Pro features. |
| Closing microcopy | “Free for up to five items. Pro from $0.99/month.” | “Start free with up to five home items. Optional Pro: $0.99/month or $14.99 lifetime in the US App Store. See pricing.” |

Compact question section headline: **The home questions you can answer in seconds.** This is a messaging direction, not a timed performance claim; safer final wording: **One place for the home questions that come up again.**

| Question | Proposed answer |
|---|---|
| What color did we paint this room? | Save the color, brand, finish, and room details for the next touch-up. |
| What size air filter do we need? | Keep appliance specifications and maintenance reminders together. |
| Is this appliance still under warranty? | Track the expiration dates you enter, see upcoming expirations, and keep warranty information handy. Pro adds warranty documents and warranty-countdown PDF reports. |
| Who fixed that last time? | Keep service providers, repairs, dates, and recorded costs connected to the relevant home item. |

Use existing paint, furnace, and history captures in the detailed sections. Add the existing warranty-countdown capture where its dates are legible without making a second long screenshot gallery. The question summary itself can remain text only and compact.

## Campaign destinations and proposed messaging

Use the homepage for broad brand campaigns. Send problem-specific campaigns to the corresponding existing page. The campaign registry in `src/data/site.ts`, visible copy, metadata, and shared CTAs must agree.

| Campaign | Existing destination | Proposed title / description and key copy |
|---|---|---|
| Paint | `/paint-color-tracker/` | Title: “Paint Color Tracker for Your Home | Around The House”. Description: “Remember the paint color, code, brand, finish, and room for your next touch-up. Start free on iPhone, iPad, and Mac.” Keep current concrete headline and authentic form captures. |
| Warranty | `/home-warranty-tracker/` | Title: “Appliance Warranty Countdown & Records | Around The House”. Description: “Track appliance warranty expiration dates and keep details nearby. Pro adds warranty documents and countdown PDF reports. For iPhone, iPad, and Mac.” Lead with entered dates; do not imply automatic eligibility verification. |
| Maintenance / appliances | `/appliance-maintenance-records/` for item-focused creative; `/home-maintenance-reminders/` for reminder-focused creative | Item title: “Appliance Records, Filter Sizes & Repairs | Around The House”. Description: “Keep appliance details, filter sizes, repair history, and reminders together. Start with five home items free on iPhone, iPad, and Mac.” Explain advanced recurrence is Pro on the reminders page. |
| Insurance documentation | `/home-inventory-app/#insurance-records` | Keep broad inventory SEO title, refine to “Home Inventory & Insurance Records | Around The House”. Description: “Record home belongings, photos, values, and identifying details. Organize insurance evidence and prepare a Pro Insurance Binder PDF on Apple devices.” Add section “Organize the evidence before you need it,” using existing personal-property / documentation captures. Readiness measures completeness, not insurance coverage. |
| Home handoff | `/home-handoff-report/` | Title: “Home Handoff Report for a New Owner | Around The House”. Description: “Build a home record of appliances, repairs, warranties, and upcoming maintenance. Pro creates a Home Handoff PDF summary for a future owner.” Label Pro and clarify the summary is not a transfer of every attachment or app ownership. |

Example incoming link: `/paint-color-tracker/?utm_source=instagram&utm_medium=paid_social&utm_campaign=paint_2026q4&utm_content=touchup_a`. Use short, non-personal, allowlisted campaign values. Avoid excessive campaign/CTA token splitting because Apple suppresses small cohorts. Create actual Apple links in App Store Connect; never invent a provider token. Canonicals and sitemap URLs remain free of tracking parameters.

## D. Technical considerations and verification gates

### Product and release evidence

| Claim | Evidence | Publication decision |
|---|---|---|
| Free five owned items | `ProStore.swift`: `freeRealAssetLimit = 5`; count excludes demo and shared records, counts owned live records | Explain app-wide owned quota; projects use the item model. Check release sixth-item behavior. |
| Monthly and lifetime only | `ProStore.swift` requests monthly `.v2` and lifetime IDs; `.storekit` contains monthly auto-renewable and lifetime non-consumable products; paywall derives localized prices from StoreKit | Retain these choices; no annual plan. Local fixtures do not authorize live catalog changes. |
| US $0.99 / $14.99 | Current [US App Store listing](https://apps.apple.com/us/app/around-the-house-home-tracker/id6789646793) agrees with the site | Preserve amounts; keep region/current-purchase-screen qualification. |
| November 1 offer | Retrieved [public pricing](https://aroundthehouseapp.com/pricing/) says lifetime becomes $24.99 November 1, 2026. No matching deadline found in reviewed purchase source; private future price schedule not inspected | Business/release owner must confirm the scheduled price and offer end date in App Store Connect. If confirmed, restore identical terms across relevant pages and purchase messaging. Do not silently assume the offer is invalid or automatically change pricing. |
| Demo duration | `AppContainerMode.swift` implements 14 days from activation; `DemoExpiredView.swift` offers selected-item transfer or erase; fictional history is excluded during transfer | Omit duration for now. Verify activation, expiration, exit, restart, and existing real-record preservation in the released app before adding “14 days.” This is an example-data window, not evidence of a Pro free trial. |
| Free / Pro extras | `ProStore.swift`, reminder editor, asset document controls, warranty export, Settings gates confirm advanced schedules, documents, PDF/CSV, backup and printable QR entitlement checks | Verify actual released entry paths on Free and Pro, including starter/seasonal recurrence and restore. Gate labels belong near the relevant claim. |
| Offline / iCloud | `PersistenceController.swift`: local demo store, private CloudKit store, local fallback; guide describes offline core workflows | Describe core offline use and same-account sync. Do not promise that purchases, downloads, or sync work offline. |
| Sharing | Property-sharing implementation exists, but Settings explicitly says other Apple Accounts are unsupported; guide flags inconsistency | Remove promotional invitation promise from comparison page. Reconcile legal disclosures with actual release behavior; do not erase a real data flow from privacy copy merely to avoid advertising it. Separate-account invitation/edit/removal/entitlement QA required before marketing sharing. |
| No tracking | No third-party analytics imports or collection calls found in focused source scan; app target has no Swift package products; listing declares Data Not Collected | Prefer specific factual trust copy. This is a source audit, not a binary/network audit. Apple diagnostics and analytics depend on user settings. New app collection requires privacy-label review. |
| Website support privacy | Static GitHub Pages deployment; support form posts to FormSubmit; privacy text describes email support but not that form processor | Describe website hosting and submitted support data separately from private app home records. Do not describe the entire site as making no third-party requests. |

All app evidence paths above are relative to `/Users/ecross/Documents/personal/apps/Tendory/Tendory/Tendory/`. No app files were changed.

### Minimal measurement recommendation

Start with App Store Connect campaign links and a simple CSV campaign register: campaign name, source, medium, destination, creative, Apple campaign token/link, dates, spend, first-time downloads, paying users, and proceeds. This requires no website analytics dependency or marketing SDK. [Apple campaign documentation](https://developer.apple.com/help/app-store-connect-analytics/acquisition/campaign-links/) describes provider/campaign tokens, a 24-hour first-download attribution window, and minimum reporting thresholds. Missing small-campaign metrics are not zero conversions.

| Metric | Collection location / definition | Recommended first step and limitation |
|---|---|---|
| Visits by campaign source | Website: landing-page view with allowlisted source/medium/campaign | Currently unmeasured. UTMs label links but do not count visits. GitHub Pages static code has no event ingestion endpoint. Separate approval would be needed for a small first-party aggregate collector; do not add it in this scope. |
| App Store clicks | Website: actual outbound anchor activation by page and CTA placement | Currently unmeasured. App Store product-page views can be a directional downstream measure, not an exact click count. Future first-party collection must not block navigation; support keyboard and normal clicks without double counting. |
| Downloads | Apple: first-time downloads by campaign | Use App Store Connect; separate redownloads. Do not equate downloads with successful first-item setup. |
| Demo engagement | App: demo opened and first meaningful example-record/reminder/document interaction | Not observable from the website or standard custom-event reporting in App Store Connect. Future app instrumentation requires reviewed event definitions and collection approval. Sample interaction must never count as real-item activation. |
| First real item saved | App: first successfully persisted, user-created owned non-demo item | Future app event. Exclude imported example shells, demo edits, restores, and existing iCloud records from new-user activation. A local deduplication flag is useful but alone cannot measure cross-device people. |
| Free-to-Pro conversion | Apple: available download-to-paid cohorts and paying users; app if an activation-to-purchase funnel is needed | Begin with Apple cohorts and verified product purchases. Separate monthly from lifetime; account for renewals, restores, refunds, and revocations. A period’s purchases divided by downloads is a directional ratio, not a true cohort conversion rate. |
| Paid acquisition cost | Campaign register plus ad-platform spend / attributed first-time downloads or new paying customers | Report cost per download separately from customer acquisition cost. Use matching attribution windows; do not calculate CAC when new-customer data is unavailable or suppressed. |

[Apple’s analytics overview](https://developer.apple.com/help/app-store-connect-analytics/overview/analytics-dashboard/) documents download-to-paid cohorts, paying users, and opt-in usage-data limitations. These do not reveal which custom app action a homeowner took.

If collection is later approved, keep the design aggregate and minimal: no home contents, names, addresses, item IDs, account identifiers, full referrers, fingerprinting, or cross-site identity matching. Use only enumerated event/campaign labels, disclose collection and retention, and review network metadata/logging. A new endpoint has hosting/maintenance implications even without an SDK. Browser-local counters or console logging are not a business measurement system. No analytics or privacy-sensitive instrumentation is implemented by this proposal.

### Component and deployment considerations

- `AppStoreLink` currently changes only the accessible label through its `label` prop; its visible image remains Apple’s badge. Add an explicit text-button variant using existing button styles rather than claiming a label change updates the badge.
- Centralize the direct app destination and optional actual campaign URLs; keep fallback links usable without JavaScript. Avoid redirects or email gates.
- At narrow widths, allow the brand, small Download Free action, and menu to fit without hiding the download or shrinking touch targets. Reuse current responsive conventions.
- Retain established routes, canonical URLs, internal anchors, title/description uniqueness, and matching visible FAQ/schema text. Update central page metadata when tuning campaigns.
- Preserve original screenshot pixels; label sample records and compare older captures against the release before use. Capture a current screen if the existing asset misrepresents behavior.
- No new npm dependency is required for conversion-copy work. `.github/workflows/deploy.yml` deploys on pushes to `main`; keep review and publication separate.

## E. Implementation and QA after approval

1. Implement the approved copy and CTA changes using existing components/styles; record any feature that fails release verification and omit its new claim.
2. Run the existing build and static validation (`npm run check`) for routes, canonical metadata, images, schema, anchors, and App Store app ID.
3. Run responsive browser QA at 320, 390, 834, and 1440 pixels. Inspect changed hero, header, demo, questions, pricing, and campaign sections; check overflow and readable screenshots.
4. Check keyboard focus, skip link, mobile menu close/Escape behavior, FAQ controls, visible/action-label agreement, touch targets, and WCAG AA text contrast. Verify secondary CTA scrolls to the intended section.
5. Verify every unique App Store destination resolves to app ID `6789646793`; check all CTA instances and navigation paths, including query parameters and no-JavaScript fallbacks.
6. Review claimed entitlements and demo behavior against the released app, not merely a debug-unlocked local build. No unsupported sharing, deadline, or trial claim should pass this review.
7. Report changed files, responsive screenshots, checks passed, unresolved release/business decisions, and measurement gaps. Publication and new analytics remain separate decisions.

Prior browser QA artifacts are evidence for the existing design only. They are not QA results for this proposed change. No new implementation or production tests are claimed here.

**Approval requested:** implement ranks 1–7 as described, preserving the design and prices, with conditional claims withheld until release verification. The user brief expressly requires “Before implementing” deliverables and says “After approval, make the changes.”

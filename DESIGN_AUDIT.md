# Around The House — Design Audit

**Date:** August 18, 2026
**Scope:** aroundthehouseapp.com (Astro 4, static). Homepage, screenshots, support, privacy, terms.
**Method:** Source review of `src/`, headless-Chrome renders at 320/375/390/430/560/768/834/980/1024/1280/1440px, pixel inspection of the app screenshots in `public/assets/screenshots/new/`, app icon and OG image color sampling, CSS token/value counting.
**Status:** Audit only. No redesign performed. See [Changes Made](#appendix-b--changes-made-during-this-audit) for the two non-visual housekeeping edits.

---

## 1. Executive Summary

The site is in better shape than most indie-app sites. The copy is concrete, the product is real, the screenshots are genuine, and there is a legible warm-green identity that plausibly descends from the app icon. Nothing here is broken, and the writing avoids nearly every cliché on the "AI marketing phrases" list.

The problem is not quality. It is **structure and confidence**.

Three things hold the site back:

1. **The product is present but never legible.** There are 11 real app screenshots on the homepage. At desktop width, not one of them is rendered large enough to read a single row of data. The furnace record in `src/pages/index.astro:198` — which contains exactly the maintenance history, provider, cost, and document list that justifies the entire product — is displayed at ~410px wide as texture. The site is *illustrated* with the product rather than *explaining itself through* the product.

2. **The page is a stack of nine near-identical section templates.** Every content section on the homepage opens `KICKER → centered H2 → paragraph`. There are **15 kickers** and **7 centered section headers** on one page. Three separate sections are `centered header → grid of cards`. This repetition — not any individual element — is the dominant source of the AI/template feel.

3. **The design system has drifted into 17 border radii, 8 shadows, 6 font weights, and 9 near-identical cream surfaces**, while three declared tokens (`--warm`, `--cream`, `--bg-soft`) are used zero times and `--radius` is used once. The tokens exist; the CSS ignores them.

There is also one **trust-level defect that should be fixed before anything else**: the hero screenshot, the OG image, and roughly half the gallery show the app's in-product **"Demo Mode: Viewing example home records / Exit Demo"** banner. The single most prominent image on the site is advertising that the user is looking at fake data.

The highest-leverage change is not a restyle. It is: **cut the homepage from nine sections to six, delete the three card grids, and give the four surviving sections screenshots large enough to read.** The product is good enough to carry the page. The site currently doesn't let it.

---

## 2. Overall Visual Assessment

**What the site looks like at a glance:** a warm, cream-and-forest-green Apple-adjacent landing page, typographically loud (weights 800–950 everywhere), organized as a long vertical run of soft rounded containers on a subtly gradient background.

**Measured facts:**

| Metric | Desktop (1440) | iPad (834) | iPhone (390) |
|---|---|---|---|
| Homepage height | 11,668px | 19,739px | 19,894px |
| Screens of scroll | ~13 | ~18 | ~24 |
| `/screenshots/` height | 10,386px | 20,067px | 18,244px |

Twenty-four phone-screens of scrolling for a single-product landing page is the clearest quantitative symptom. The page is roughly twice as long as it needs to be, and the excess is almost entirely card grids and repeated section furniture.

**Density:** the homepage renders approximately **47 discrete bordered/rounded containers** (3 numbered cards + 6 feature cards + 4 persona cards + 6 question pills + 4 trust boxes + 5 label pills + 2 price cards + 4 FAQ cards + 11 image containers + CTA card + coverage note). Almost every idea on the page lives inside a rounded rectangle.

**Tone:** correct in copy, overstated in typography. The stated goal is "calm." The type is set at weight 800–950 with an 84px H1 and bolded body text in every check-list. The words are calm; the rendering is not.

---

## 3. What Currently Works

These are genuine strengths and should be **protected** through any redesign.

1. **The copy is concrete and specific.** `src/pages/index.astro:14-21` — "What size is the furnace filter?", "When did we replace the water heater?", "Who fixed the dishwasher?" These are real homeowner questions in real homeowner language. This is the single best asset on the site and it is currently buried in a 6-box grid in the fourth section. It belongs near the top.

2. **The screenshots are real, current, and unusually rich.** `public/assets/screenshots/new/` contains 23 genuine iPhone/iPad captures with plausible data: "Peak Appliance Repair", "Comfort Air Heating & Cooling", filter sizes, serial numbers, warranty dates, QR labels. Most indie sites do not have this. The raw material for a product-led site already exists in the repo.

3. **The App Store proposition is honest and complete.** Pricing is stated plainly on-page ($0.99/mo, $9.99 lifetime, `index.astro:39-42`), there is no fake urgency, no invented testimonials, no fabricated user counts, no "trusted by X homeowners." This is rarer than it should be and it reads as trustworthy.

4. **The privacy position is stated once, plainly, in the right place.** `index.astro:124` — "No Around The House account. Your data stays on your Apple devices and in your private iCloud when sync is enabled." It sits directly under the hero CTA, it is 20 words, and it is not repeated eight more times down the page. This is exactly the right amount of privacy messaging.

5. **The alternating COPY | PRODUCT rhythm already exists and is correctly built.** `.showcase`, `.capability-grid`, `.capability-grid.reverse`, `.property-grid`, `.property-grid.reverse` (`global.css:148-172`) already implement the alternating layout the site needs. The pattern is right; the screenshots inside it are just too small. This is a scale fix, not a rebuild.

6. **`/screenshots/` handles headings better than the homepage.** `src/pages/screenshots.astro:60` uses `.gallery-heading` — a left-aligned H2 with the description beside it, not below it, not centered. It is more confident than anything on the homepage and is the model the homepage should follow.

7. **Accessibility fundamentals are present and mostly passing.** Skip link, `aria-label`ed nav, `aria-labelledby` on sections, focus-visible outlines at 3px with offset, `prefers-reduced-motion` block, honeypot on the support form, real `<label>` elements, explicit `width`/`height` on every image. Contrast: ink 11.2:1, muted body 4.7:1, kicker 8.7:1, button 9.6:1 — all pass AA.

8. **No layout is actually broken.** Measured `scrollWidth` at every breakpoint from 320px to 1440px on all four pages: **zero horizontal overflow.** Nothing is clipped, nothing escapes the viewport.

---

## 4. What Currently Feels AI-Generated or Template-Driven

Listed strongest-signal first. Each is tied to the file and line responsible.

### 4.1 The repeated section template — the single biggest tell

**What exists:** `src/pages/index.astro` contains **15 `class="kicker"` elements** and **7 `section-header centered`** blocks. Nine of the page's content sections open with the identical three-part figure:

```
UPPERCASE MICRO-LABEL
Big Centered Headline.
One centered explanatory sentence.
```

Kickers in document order: *The home memory app · What Around The House does · Made for real life · What you can track · Fast answers · Personal property and insurance coverage · Personal Property Inventory · Home Value History · Home maintenance reports · Costs and warranties · Who it helps · Product preview · Pricing · Questions · Available on the App Store.*

**Why it is a problem:** an eyebrow label is a device for signalling "a new topic starts here." When every section has one, it signals nothing and becomes visual wallpaper. More importantly, a reader scanning the page sees the same shape nine times and concludes the page was generated from a template — because structurally, it was. This is the pattern most strongly associated with AI-generated marketing pages, and this page has the highest kicker density I would expect to find anywhere.

**What should replace it:** keep the kicker on at most **two** sections where it does real work (the hero, and one section-break). Delete the other 13. Let section changes be signalled by layout — a full-bleed screenshot, a background change, an alignment flip — rather than by a repeated label. Alternate left-aligned and centered headers instead of centering seven of them.

**Why better:** it restores the kicker's meaning, removes ~13 lines of visual noise, and forces each section to earn its distinction structurally rather than typographically.

---

### 4.2 Emoji as feature icons

**What exists:** `src/pages/index.astro:23-30` —

```js
const featureCards = [
  ['🏠', 'Home item records', …],
  ['🔔', 'Simple reminders', …],
  ['📎', 'One organized Binder', …],
  ['🛠️', 'Repair history', …],
  ['📷', 'Photos and notes', …],
  ['📊', 'Reports and coverage overview', …]
];
```

rendered into `.card .icon` (`global.css:138`), a 46px sage rounded square.

**Why it is a problem:** three compounding failures.
- Emoji render as full-color platform-specific glyphs. The same page shows Apple emoji on macOS, Segoe emoji on Windows, Noto on Android — you do not control your own brand marks.
- 🏠 (a generic house), 🔔 (a bell), 📊 (a bar chart) carry no Around The House meaning. They are the visual equivalent of placeholder text.
- **The app itself uses proper SF Symbols.** The tab bar in every screenshot shows drawn, weight-matched symbols for Today/Items/Schedule/Binder/Settings; the item list uses SF Symbols for Kitchen, Exterior, Garage/Yard, Safety, Utility. The website replaced a real, native icon system with emoji. Moving website → App Store → app, the icon language *downgrades* on the website and then recovers in the app.

**What should replace it:** delete the icon row entirely and delete five of the six cards (see §4.3). For any icon that survives, use SF Symbols — either the actual SF Symbols the app uses, exported as SVG, or nothing. A section heading with no icon is better than a section heading with a generic emoji.

**Why better:** it makes the website's icon vocabulary identical to the app's, which is the cheapest available way to make the two feel like one product.

---

### 4.3 Three consecutive "centered header + grid of cards" sections

**What exists:**
- `index.astro:149-166` — "Add it once…" → `.grid-3` of 3 `.answer-card` with numbered circles
- `index.astro:181-194` — "The house stuff people actually forget." → `.grid-3` of 6 `.card` with emoji
- `index.astro:293-304` — "For the person who ends up remembering the house." → `.grid-4` of 4 persona `.card`

**Why it is a problem:** this is the canonical AI-page rhythm — *headline, paragraph, three cards; headline, paragraph, three cards*. All three sections are pure abstraction: **13 cards, and not one screenshot among them.** A reader gets three consecutive sections of the site telling them about the product without ever showing it.

The persona grid (`peopleCards`, `index.astro:32-37`) is the weakest content on the site. "Busy households / Forgetful brains / Detail people / New homeowners" describes essentially all consumers, and "Forgetful brains" is the one place the copy slips toward cute. It occupies a full-width dark green band, 604px tall at desktop, and communicates nothing a visitor didn't already assume.

**What should replace it:**
- **Delete the persona band entirely.** Fold "new homeowners" into the hero subhead if the audience needs stating.
- **Delete the 6-card feature grid.** Its six ideas are already demonstrated by screenshots elsewhere on the page — item records, reminders, Binder, repair history, photos, reports. It is a text summary of the sections around it.
- **Convert "Add it once" to a three-step strip with no card containers** — number, label, one line, separated by whitespace or a hairline rule, not by three bordered boxes.

**Why better:** removes ~2,100px of desktop height and ~4,000px of mobile height, eliminates 13 of the page's 47 containers, and — critically — removes the three sections where the product is invisible.

---

### 4.4 Screenshots too small to read (the most consequential problem)

**What exists, measured at 1440px:**

| Location | Source | Rendered width | Legible? |
|---|---|---|---|
| Hero | `index.astro:129` `ipad-today.webp` (2048×2732) | ~400px | No |
| "When something breaks" | `index.astro:198` `ipad-item-record.webp` | ~410px | No |
| Personal property | `index.astro:230` | ~430px (cropped) | No |
| Coverage overview | `index.astro:246` | ~430px (cropped) | No |
| Health report | `index.astro:275` | ~470px | Barely |
| Cost tracking | `index.astro:287` `iphone-cost-tracking.webp` | ~180px | No |
| Warranty countdown | `index.astro:288` | ~180px | No |

An iPad screenshot is 2048px wide. Displayed at 400px, that is a **5.1× downscale** — body text in the app renders at well under one pixel per stem. The information is mathematically unrecoverable.

**Why it is a problem:** the site's entire argument is "this app holds the details you forget." The proof of that claim is *the details being visible*. `ipad-item-record.webp` contains a Furnace & Air Filter record with three dated maintenance entries, a provider, costs, an overdue reminder, and a manuals-and-documents list. That single image, shown large, is a more persuasive argument than the six feature cards, four persona cards, and three numbered cards combined. At 410px it is a beige smudge.

Two supporting defects make it worse:
- **Double-framing.** The hero screenshot sits inside `.device-stage` (42px radius, gradient fill, border, `--shadow`) which contains `.hero-product-shot` (28px radius, border, its own shadow) which contains the image (24px radius, another border). Three nested rounded containers with three borders around one picture — `global.css:99-110`.
- **Hard crops.** `.property-shot { max-height: 720px; overflow: hidden }` with `object-fit: cover; object-position: top` (`global.css:171-172`) slices both property screenshots mid-content. At 1440px the "Create Insurance Binder PDF" button is cut in half. The crop is arbitrary — it is a height cap, not a composition decision.

**What should replace it:** see §13 (Screenshot Strategy). Short version: **one screenshot per section, 700–900px wide minimum at desktop, cropped deliberately to the region that proves the point.**

**Why better:** the tablet render proves it. At 834px the hero screenshot is ~790px wide and you can read "Overdue 2 / Coming Up 5 / Documents 48", "Areas of Your Home", and "Furnace & Air Filter — Overdue — Needs Repair." The site already demonstrates, at one breakpoint, exactly how much more persuasive it becomes when the product is legible.

---

### 4.5 Three different pill treatments doing the same job

**What exists:**
- `.quick-answer span` — `global.css:121` — 18px radius, 4 boxes: "Simple home records / Repairs and reminders / Receipts and warranties / iPhone, iPad, and Mac"
- `.question-pill` — `global.css:146` — 18px radius, 6 boxes of homeowner questions
- `.feature-labels span` — `global.css:167` — 999px radius, 5 boxes: "Personal Property Inventory / Home Value History / …"

All three are "short phrase in a bordered, shadowed, cream container." Fifteen pills across three visually distinct treatments.

**Why it is a problem:** the trust strip (`index.astro:140-147`) is the weakest — four generic capability labels immediately below the hero, occupying 121px, saying nothing the hero didn't. The `feature-labels` row is a keyword list dressed as UI. And the `question-pill` content is the *best copy on the site*, demoted to decoration by being boxed.

**What should replace it:**
- **Delete `.quick-answer` / the trust strip.** It is filler between the hero and the first real section.
- **Delete `.feature-labels`.** The five terms are already the headings of the subsections directly beneath them.
- **Unbox the questions.** Set the six homeowner questions as plain type — a two-column list of italic or quoted lines with no borders, no shadow, no background — and pair them with the answering screenshot. See §27.

**Why better:** removes 15 containers and 3 of the design system's radius/shadow variants, and promotes the best copy on the site from decoration to content.

---

### 4.6 Decorative gradients and offsets with no product meaning

**What exists:**
- `body` background: two stacked radial gradients — sage at 8% 0%, tan at 92% 6% (`global.css:23-26`)
- `.device-stage` — `linear-gradient(135deg, …)` behind the hero screenshot (`global.css:102`)
- `.cta-inner` — `linear-gradient(135deg, …)` (`global.css:207`)
- `.phone-shot.offset` — `transform: translateY(54px)` (`global.css:117`)
- `.phone-pair .phone-shot:nth-child(2)` — `transform: translateY(34px)` (`global.css:158`)
- The OG image (`public/assets/og/around-the-house-og-v2.png`) has pale green and tan quarter-circle blobs

**Why it is a problem:** the two staggered-phone offsets (54px and 34px, two different arbitrary values) are the "floating decorative element" pattern — they exist to look designed, and they push the second phone toward the `overflow: hidden` edge of `.capability-section`. The corner radial gradients are the mildest instance; they are subtle and largely harmless, but combined with two 135° linear gradients and a gradient CTA card they add up to four gradient treatments in service of nothing.

**What should replace it:** remove both `translateY` offsets — align phone pairs on a shared baseline. Remove the `.device-stage` gradient (the screenshot should sit on the page background, not on a gradient plate). Keep the body radial gradients if desired at reduced opacity, or replace with a flat `--bg`; they are the lowest priority here.

**Why better:** the reason to stagger two phones is to suggest depth or sequence. Neither applies — these are two unrelated features (costs, warranties). Aligning them reads as deliberate; offsetting them reads as decoration.

---

### 4.7 A custom green pill instead of the Apple App Store badge

**What exists:** `.button` / `.app-button` (`global.css:68-80`) — a 999px dark-green pill reading "Download on the App Store," used in the hero (`index.astro:121`), nav (`Header.astro:19`, labelled just "App Store"), final CTA (`index.astro:365`), and screenshots-page CTA.

**Why it is a problem:** for an Apple-only app whose stated goal is to feel "native to the Apple ecosystem," the official black App Store badge is the single most recognizable trust mark available, and it is instantly parseable as "this is a real, shipping iOS app." A custom green pill reads as a generic web CTA. Every reference site for Apple-native identity — Things, Bear, Anybox — uses the real badge.

**What should replace it:** the official Apple-provided App Store badge SVG in the hero and final CTA. Keep a text link in the nav (a badge in a 70px nav bar is cramped).

**Why better:** it is a recognized mark, it carries Apple's implicit endorsement of "this exists on the store," and it costs one asset swap.

---

### 4.8 Demo-mode chrome in every marketing image *(trust defect — P0)*

**What exists:** the in-app demo banner appears in:
- `ipad-today.webp` — **the hero image** (`index.astro:129`): "✦ Demo Mode: Viewing example home records. [Exit Demo]"
- `public/assets/og/around-the-house-og-v2.png` — **the social share card**
- `ipad-item-record.webp` (`index.astro:198`): "This is fully interactive example data. You can edit it, test QR codes, complete reminders, hide it, reset it, or permanently remove it from Settings."
- `ipad-insurance-coverage-overview.webp` (`index.astro:246`): "Example: Smith House", "Changes remain in demo data and do not affect your real properties."
- Multiple tiles in `/screenshots/`

**Why it is a problem:** it is a trust problem before it is a design problem. The first image a visitor sees, and the image that represents the site on every social share, carries a system banner saying the contents are not real. It reads as a screenshot taken carelessly rather than a product presented deliberately. It also wastes ~40px of the most valuable vertical space in the hero image on a dismissal control.

Two secondary authenticity issues in the same demo data:
- **Future-dated history.** Today is Aug 18, 2026. `iphone-item-history.webp` shows maintenance *history* dated Dec 14 2026, Nov 11 2026, Oct 8 2026; `iphone-items.webp` shows "Last service: Dec 22, 2026." History dated four months in the future is visibly wrong to anyone who reads it — which is the state we are trying to reach.
- **Implausible magnitudes.** `iphone-cost-tracking.webp` shows Maintenance $183,268 / Repairs $60,630 / Replacements $39,876, and `iphone-item-history.webp` shows "Appliance Cleaning — $705.00." These undermine credibility precisely when the screenshots become legible.

**What should replace it:** recapture the marketing screenshots with demo mode hidden (the app's own copy says demo data can be hidden from Settings), with dates in the recent past, and with realistic costs — a furnace service at $189, a dishwasher repair at $240. This is a prerequisite for §13, not an optional polish item: enlarging the screenshots makes all of these defects legible.

**Why better:** the goal is "these are real records from a real home." Every one of these details currently says the opposite, and they get *worse* as the screenshots get better.

---

### 4.9 Design-system drift (measured)

Counted directly from `src/styles/global.css`:

| Property | Distinct values | Detail |
|---|---|---|
| **border-radius** | **17** | 999px, 50%, 42, 34, 32, 30, 28, 26, 24, 20, 19, 18, 16, 15, 12, `0 16px 16px 0`, `var(--radius)` |
| **box-shadow** | **8** | 2 tokens (`--shadow`, `--soft-shadow`) + 6 one-off values |
| **font-weight** | **6** | 700, 750, 800, 850, 900, 950 |
| **cream surfaces** | **9** | `rgba(255,250,242,·)` at .48/.74/.76/.8/.82/.86, plus `#fffaf2`, `#fffdf8`, `white` |
| **gradients** | **4** | 2 body radial, 2 × `linear-gradient(135deg,…)` |
| **dead tokens** | **3** | `--warm`, `--cream`, `--bg-soft` — **0 uses each** |
| **`--radius` usage** | **1** | one use, against 16 hand-written radii |

**Why it is a problem:** this is what accumulated, unsystematic iteration looks like — and it is a recognized signature of generated/assembled pages. Nine cream surfaces separated by 4% alpha are indistinguishable to a viewer but guarantee that no two containers match exactly. Seventeen radii mean no two corners agree.

The font weights deserve special attention: **750, 850, and 950 are not real weights in most fonts.** With a static face they snap to 700/800/900 — and since the site's actual rendering font is a fallback (see §4.10), the weights land unpredictably. `.check-list li` at weight 700 also means every bullet on the page is bold body text, which is a large part of why a "calm" site reads loud.

**What should replace it:** a 4-step radius scale (e.g. 8 / 14 / 22 / 999px), 2 shadows (`--soft-shadow`, `--shadow`), 3 weights (400 / 600 / 700), 3 surfaces (page, raised, inverted). Delete the dead tokens. Route every value through a token.

**Why better:** a small enforced scale is the difference between "someone designed this" and "this accumulated." It is also a mechanical change with no creative risk.

---

### 4.10 `Inter` is specified but never loaded

**What exists:** `global.css:15` sets

```css
font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", sans-serif;
```

There is **no `@font-face` rule, no webfont `<link>`, and no font file in the repo.** Verified: `document.fonts` is empty on the rendered page; the only `<link>` tags in `BaseLayout.astro:71-73` are the favicons and manifest.

**Why it is a problem:** Inter renders *only* for visitors who happen to have it installed locally — which includes this development machine, and therefore every screenshot taken during design work. Every other visitor gets `system-ui` (SF Pro on Apple, Segoe on Windows). This means:
- The site you are designing against is not the site your visitors see.
- The 750/850/950 weights resolve differently across those faces.
- Inter and SF Pro have noticeably different letterforms — Inter's `a`, `t`, and `1` in particular — so the brand's typographic voice is not stable.

**What should replace it — and this is a genuine design decision, not just a bug fix:** the right answer is probably to **delete `Inter` and commit to the system stack**. The app is SF Pro. An Apple-native product whose website is set in SF Pro is *more* coherent, not less, and it costs zero bytes. If a distinct typographic identity is wanted (see §23, Bear), it should come from a deliberately chosen display face used *only* for headlines, with SF Pro for body — not from an unloaded Inter reference.

**Why better:** either way, the site renders identically for everyone, and the website's type matches the app's.

---

### 4.11 Minor template tells

- **Gradient CTA card.** `.cta-inner` (`global.css:207`) — 42px radius, 135° gradient, border, `--shadow`, centered. The archetypal "CTA card" ending. A full-bleed band or plain centered type with the App Store badge would be quieter and more confident.
- **Competing final CTA.** `index.astro:365` places "Visit Quiet Tools" beside "Download on the App Store" at the page's conversion moment. The developer link belongs in the footer, where it already is (`Footer.astro:35`).
- **Numbered circles.** `.big-number` (`global.css:141`) — dark green filled circles for 1/2/3. Generic; a plain large numeral in accent color reads better and drops a container.
- **`.landscape-shot` holds a portrait image.** `index.astro:198` applies `.landscape-shot` (`global.css:152`) to `ipad-item-record.webp`, which is 2048×2732 — portrait. A leftover class name; harmless but a sign of drift.

---

## 5. The "Could This Be Any App?" Test

**Method:** replace "Around The House" with "Notion" / "Bear" / "Todoist" and re-read each section.

| Section | Source | Survives the swap? | Verdict |
|---|---|---|---|
| Hero headline "Remember everything about your home." | `index.astro:117` | Partially | "your home" is the only anchor. "Remember everything about your [X]" works for any memory app. |
| Trust strip | `index.astro:140-147` | **Yes** | "Simple records / iPhone, iPad, and Mac" — any app. |
| "Add it once. Stop trying to remember it later." + 3 cards | `index.astro:149-166` | **Yes, entirely** | "Add the thing / Save the details / Find it later" is a generic CRUD description. Works verbatim for Notion, Bear, Things. |
| Homeowner questions | `index.astro:14-21` | **No** | Furnace filters and water heaters are unmistakably this product. **Strongest section on the page.** |
| 6 feature cards | `index.astro:23-30` | Mostly | "Simple reminders / Photos and notes" — any app. Only "One organized Binder" and "Repair history" are specific. |
| "When something breaks, you already have the record." | `index.astro:198-208` | **No** | Specific and good. |
| Personal property / coverage | `index.astro:212-261` | **No** | Very specific — arguably *too* specific for its position (see §6). |
| Health report / costs / warranties | `index.astro:263-291` | **No** | Specific. |
| Persona cards | `index.astro:32-37` | **Yes, entirely** | "Busy households / Forgetful brains / Detail people" — any productivity app. |
| "Calm records for busy homes." | `index.astro:306-320` | Mostly | The heading is generic; only the screenshots anchor it. |
| Pricing | `index.astro:322-340` | **Yes** | Standard, and that is fine — pricing should be conventional. |
| FAQ | `index.astro:342-358` | **No** | Specific and useful. |
| Final CTA "Give your home a memory." | `index.astro:363` | **No** | Good line. |

**Score: 5 of 14 sections survive the swap intact.** Those five are exactly the five with no screenshots: trust strip, "Add it once," feature cards, persona cards, and the generic heading over the screenshot trio.

**The correlation is the finding.** Every section that shows the product is unmistakably Around The House. Every section that doesn't, isn't. The page does not need new distinguishing content — it needs to delete the sections that lack product and enlarge the ones that have it.

**Why this happens:** the generic sections were written to describe *categories of capability* ("reminders," "photos and notes"). Categories are shared across all productivity software by definition. The specific sections were written to describe *homeowner situations* ("when something breaks," "what size is the furnace filter"). Situations belong to one product.

---

## 6. Homepage Audit

### The five-second test

| # | Question | Answered in 5s? | Why |
|---|---|---|---|
| 1 | What is Around The House? | **Partially** | "Remember everything about your home" + "THE HOME MEMORY APP" convey a memory app for a house. The *maintenance* dimension — the product's spine — is absent from the headline. |
| 2 | Who is it for? | **Yes** | `index.astro:119` names the audience directly. |
| 3 | What problem does it solve? | **Partially** | The lead lists eight nouns (repairs, reminders, warranties, receipts, photos, notes, details). A list is not a problem statement. |
| 4 | What makes it useful? | **No** | Requires scrolling to §"When something breaks" (3,107px down at desktop). |
| 5 | What does the app look like? | **No at desktop, no at mobile** | Present but illegible at desktop; below the fold at 390px (product starts at y≈910, viewport 844). |
| 6 | Where do I download it? | **Yes** | Nav button + hero CTA, both above the fold at desktop. |

**Score: 2.5 / 6.** The two failures — #4 and #5 — are the two that matter most for an app landing page, and both have the same root cause: the product is not legible at first contact.

### Section-by-section verdict

| # | Section | Source | Height @1440 | Verdict |
|---|---|---|---|---|
| 1 | Hero | `:113-138` | 887px | **Keep, rebuild.** See §7. |
| 2 | Trust strip | `:140-147` | 121px | **Delete.** Four generic pills; adds nothing. |
| 3 | Add it once (3 cards) | `:149-166` | 627px | **Delete or compress** to an uncontained 3-step strip. |
| 4 | Questions | `:168-179` | 498px | **Keep and promote.** Best copy; move up, unbox, pair with product. |
| 5 | 6 feature cards | `:181-194` | 903px | **Delete.** Text summary of sections around it. |
| 6 | When something breaks | `:196-210` | 838px | **Keep, enlarge screenshot 2×.** Best section on the page. |
| 7 | Property + coverage | `:212-261` | **2,032px** | **Cut ~60%.** See below. |
| 8 | Health report | `:263-277` | 977px | **Keep, enlarge.** |
| 9 | Costs & warranties | `:279-291` | 603px | **Keep, align phones, enlarge.** |
| 10 | Persona band | `:293-304` | 604px | **Delete.** |
| 11 | Screenshot trio | `:306-320` | 1,152px | **Replace** with a link to `/screenshots/`; the sections above already show these screens. |
| 12 | Pricing | `:322-340` | 634px | **Keep.** Honest and clear. |
| 13 | FAQ | `:342-358` | 771px | **Keep**, consider `<details>`. |
| 14 | Final CTA | `:360-367` | 550px | **Keep, simplify.** Drop the gradient card and the Quiet Tools link. |

**Deleting sections 2, 3, 5, 10, 11 removes ~3,400px of desktop height (29%) and ~7,000px of mobile height (35%) while removing zero product information** — every idea in those five sections is demonstrated by a screenshot elsewhere on the page.

### The insurance/personal-property imbalance

Section 7 (`index.astro:212-261`) is **2,032px tall — the largest section on the page by 2×**, roughly 17% of total desktop height. It contains: a centered header, five keyword pills, and two full COPY|PRODUCT blocks about personal property inventory, home value history, insurance coverage limits, claim readiness, replacement value, and coverage gaps.

**Why it is a problem:** the stated positioning is "a beautifully organized digital home binder that also helps you stay ahead of maintenance," and explicitly *not* "enterprise property-management software." But the site's largest section is about insurance coverage comparison, documented replacement value, and claim readiness percentages. It requires a legal disclaimer (`.coverage-note`, `index.astro:257`) — the only disclaimer on the site. That is an insurance-adjacent tone in the position of greatest emphasis, and it arrives *before* the maintenance reports section.

The screenshot filenames confirm the drift: the App Store asset pipeline in `images/iphone/optimized/` is named `01-see-your-coverage-in-one-place`, `02-know-how-your-coverage-compares`, `03-build-a-claim-ready-home-record`, `05-create-an-insurance-binder-in-seconds` — while the *older* set in `images/old/iphone/` is named `01-remember-what-needs-attention`, `03-stay-ahead-of-maintenance`, `04-keep-home-documents-together`, `08-create-a-home-handoff`. The positioning moved from maintenance toward insurance, and the homepage followed.

**What should replace it:** reduce to **one** block (~700px) covering personal property and documentation as *part of the binder*, positioned after maintenance and history, framed as "know what you own and where the proof is" rather than as coverage analysis. Keep the disclaimer. Move the detailed coverage-comparison material to a dedicated page if it deserves depth.

**Why better:** it restores maintenance as the spine and keeps the insurance capability as a supporting benefit — which matches both the stated product character and the app's own tab structure (Today / Items / Schedule / Binder), where coverage is a view inside Binder, not a top-level concept.

---

## 7. Hero Audit

`src/pages/index.astro:113-138`; CSS `global.css:84-117`.

| Element | Current | Assessment |
|---|---|---|
| **Kicker** | "THE HOME MEMORY APP" | Good positioning, wrong emphasis. "Memory" undersells the forward-looking half (upcoming/overdue maintenance) that is the app's `Today` tab. |
| **H1** | "Remember everything about your home." @ `clamp(48px, 7vw, 84px)`, weight 700, line-height 1.06 | **Too large.** 84px wraps to 4 lines in a `.95fr` column, leaving "home." orphaned on line 4. Consumes 380px of hero height. |
| **Lead** | 24px, 3 lines, 8 nouns | A list, not a proposition. Doesn't say *maintenance*. |
| **Plain line** | 17px, audience | Fine, but a third text block before the CTA. |
| **CTA** | Custom green pill | Should be the Apple badge (§4.7). |
| **Secondary CTA** | "See how it works" | On mobile it is full-width and nearly as prominent as the primary. |
| **Microcopy** | Privacy line | **Excellent.** Right content, right length, right place. |
| **Screenshot** | iPad `ipad-today.webp` @ ~400px, triple-framed, demo banner visible | **The core failure.** See §4.4, §4.8. |
| **Caption** | "Your home at a glance / Items · Schedule · Binder · Reports" | **Good idea, keep it** — it names the app's real tabs. |
| **Background** | 2 radial gradients | Low priority. |

### The four hero problems, ranked

**1. The hero shows an iPad screenshot — on a site for an iPhone-first app.** `ipad-today.webp` is 2048×2732. At 390px viewport the visitor is looking at a picture of an iPad, on an iPhone, at 360px wide. An iPhone screenshot at near-native scale (~300px wide displayed from a 1206px-wide source) would be readable *and* would match the device in the visitor's hand.

**2. The headline is big instead of clear.** 84px is a magazine cover size. Things, Bear, and Anybox all set their heroes far smaller and let the product image carry the visual weight. Reducing to `clamp(40px, 5vw, 62px)` would fit "Remember everything about your home." on two lines, recover ~180px, and read calmer.

**3. The proposition omits maintenance.** The prompt's own candidate — *"Keep the important details about your home organized and stay ahead of maintenance"* — contains both halves. The current headline contains only the first. Concrete alternatives, in the site's existing voice:

- **"Every repair, receipt, and reminder — in one place."** (concrete nouns, no cliché)
- **"Know what you fixed, what it cost, and what's due next."** (the three questions the app answers; strongest)
- **"Your home has a lot to remember. Now it doesn't all have to live in your head."** — **this already exists, in the OG image** (`around-the-house-og-v2.png`), and is warmer and more specific than the live H1.

That last point is worth stating plainly: **the OG image has a better headline than the homepage.**

**4. Three text blocks precede the CTA.** Kicker + H1 + lead + plain-line + CTA. Cutting `.plain-line` (or merging its audience note into the lead) moves the CTA up ~90px.

### Recommended hero structure

```
[nav]

THE HOME MEMORY APP  (or drop the kicker)

Know what you fixed, what it cost,        [ large, readable
and what's due next.                        iPhone screenshot —
                                            Today tab, showing
Around The House keeps your home's          Overdue 2 / Coming Up 5,
maintenance, repairs, receipts, and         Areas of Your Home,
documents together — on your iPhone,        Furnace & Air Filter · Overdue
iPad, and Mac.                              — at ≥380px wide,
                                            single frame, no demo banner ]
[ Apple App Store badge ]  See how it works

No account required. Your records stay on   Your home at a glance
your devices and in your private iCloud.    Items · Schedule · Binder · Reports
```

**Why better:** the headline names the three questions the product answers; the screenshot is legible and shows the correct device; the CTA is the recognized Apple mark; the privacy line stays where it already works; and the hero loses ~200px.

---

## 8. Navigation Audit

`src/components/Header.astro`; CSS `global.css:54-82`.

**What works:** 70px sticky header with `backdrop-filter: blur(18px)` over `rgba(248,243,234,.86)` — appropriately light and Apple-ish. Brand lockup uses the real app icon at 38px with a 12px radius, so the site's first mark is the app's own mark. `aria-label="Main navigation"`. Labels are plain English ("How it works," "What it tracks") rather than SaaS-speak. Six items is a reasonable count.

### Problem 1 — All navigation disappears below 980px *(P0)*

```css
@media (max-width: 980px) {
  .nav-links a:not(.button) { display: none; }
}
```
`global.css:239`

Below 980px, "How it works," "What it tracks," "Screenshots," "Pricing," and "Support" are simply **removed with no replacement.** There is no hamburger, no drawer, no `<details>` disclosure, no anchor list. Mobile and tablet visitors get brand + App Store button only.

**Why it is a problem:**
- **Around The House is an iPhone app.** A large share of traffic arrives on the device the product runs on, and that share has the least navigation.
- The threshold is 980px, so this also strips nav from **iPad portrait (834px)** and iPad landscape at some sizes — widths with abundant horizontal room.
- Support becomes reachable only by scrolling ~19,000px to the footer. For a paid app, that is a real support-access problem.
- `Screenshots` — the page that best demonstrates the product — becomes invisible to mobile visitors except via one link at `index.astro:318`.

**What should replace it:** a lightweight disclosure. A native `<details>`/`<summary>` menu needs no JavaScript, no framework, and about 20 lines of CSS, which suits a static Astro site. At minimum, surface **Screenshots** and **Support** as visible links at tablet widths, where there is clearly room.

**Why better:** it restores five wayfinding links on the site's most important viewport at essentially zero weight and zero JS.

### Problem 2 — Nav CTA label

`Header.astro:19` renders the button as "App Store" — a destination, not an action, and it does not visually read as an App Store link. Either "Download" or the small Apple badge would be clearer.

### Problem 3 — Anchor-heavy IA

Four of six nav items are homepage anchors (`#how-it-works`, `#features`, `#pricing`) plus two real pages. If the homepage is shortened as recommended in §6, `#how-it-works` and `#features` point at deleted sections — the nav should be revisited alongside that change. A flatter set — **Features · Screenshots · Pricing · Support · [badge]** — would survive homepage restructuring.

### Footer

`src/components/Footer.astro` — four columns (brand, Product, Support, Company), correct link set, real support email, `compact` variant for legal pages. **This is well-judged and needs no change.**

---

## 9. Typography Audit

### Current scale (`global.css`)

| Element | Value | Line | Assessment |
|---|---|---|---|
| Stack | `Inter, ui-sans-serif, system-ui, …` | `:15` | **Inter never loaded — §4.10** |
| `h1` | `clamp(48px, 7vw, 84px)`, wt 700, lh 1.06 | `:88-89` | Too large; 4 lines at desktop |
| `h2` | `clamp(34px, 5vw, 58px)`, lh 1.06 | `:90` | Too large; most H2s wrap to 2–3 lines |
| `h3` | `23px` | `:91` | Fine |
| `.feature-heading` | `clamp(28px, 3.4vw, 42px)` | `:173` | A **fourth** heading size between h2 and h3 |
| `.lead` | `clamp(19px, 2.2vw, 24px)` | `:92` | Fine |
| `.small-lead` | `clamp(18px, 2vw, 22px)` | `:93` | Barely distinct from `.lead` — 2px apart |
| `.plain-line` | `17px` | `:94` | Fifth body size |
| body | `16px`, lh 1.55 | `:20-27` | Good |
| `.section-header p` | `18px` | `:127` | Sixth body size |
| `.microcopy` | `14px` | `:96` | Fine |

**Six body-text sizes (14/16/17/18/22/24) and four heading treatments (h1/h2/.feature-heading/h3).** `.lead` at 24px vs `.small-lead` at 22px is a distinction no reader can perceive; it is drift, not hierarchy.

### Weight

Six weights (700/750/800/850/900/950). **Non-standard steps (750, 850, 950) do not exist in most faces** and snap unpredictably — which matters more given the font isn't loaded (§4.10).

Specific over-bolding:
- `.kicker` — weight **850**, uppercase, `.09em` tracking, ×15 per page (`:87`)
- `.check-list` — weight **700** on all body bullets (`:160`). Fourteen bullets across four lists, all bold. This is the largest single contributor to the page reading loud.
- `.question-pill`, `.quick-answer span`, `.feature-labels span` — weight **800**
- `.brand`, `.button` — 850 / 800
- `.check-list li:before` — weight **950**

**Recommendation:** three weights — 400 body, 600 emphasis/labels, 700 headings. Set `.check-list` to 400 and let the checkmark carry emphasis.

**Why better:** contrast comes from *variation*. When 800+ is the default, bold stops meaning anything and the page reads as shouting — the opposite of "calm."

### Alignment

**Seven `section-header centered` blocks.** Four are centered headline + centered paragraph + centered grid. Centering is for moments; used seven times it becomes the default and the eye loses its left edge. `/screenshots/` already demonstrates the better pattern (`screenshots.astro:60`, `.gallery-heading`): left-aligned H2 with the description beside it.

**Recommendation:** at most two centered headers per page (the hero if desired, and the final CTA). Left-align everything else.

### Measure

`.lead` caps at `max-width: 720px` at 24px ≈ **78 characters** — above the 45–75 comfort range. `.section-header` at 780px with 18px text ≈ 95 characters, though centering shortens effective lines. Body copy inside cards is well-constrained by card width.

**Recommendation:** cap `.lead` at ~620px and section-header paragraphs at ~640px.

### Mobile scaling

`h1 { clamp(43px, 14vw, 60px) }` (`:263`) — at 390px, `14vw` = 54.6px. Reasonable but still large; ~48px would sit better against 16px body. H2 at `clamp(34px, 5vw, 58px)` resolves to 34px on mobile, which is the one place the scale behaves well.

---

## 10. Color Audit

### Palette (`global.css:1-16`)

| Token | Value | Uses | Note |
|---|---|---|---|
| `--bg` | `#f8f3ea` | — | App bg is `#faf5ec` — close but not matched |
| `--bg-soft` | `#fffaf2` | **0** | Dead |
| `--ink` | `#183a33` | — | Good, 11.2:1 |
| `--muted` | `#63706a` | — | 4.7:1, passes AA |
| `--accent` | `#4d8a73` | 2 | Barely used |
| `--accent-dark` | `#244c42` | 12 | The de-facto brand color |
| `--sage` | `#dcebe1` | 2 | |
| `--cream` | `#fffaf2` | **0** | Dead; duplicate of `--bg-soft` |
| `--warm` | `#ead8b8` | **0** | Dead |

**Three of nine color tokens are unused**, and two of those are identical values. Meanwhile nine different cream surface values are hand-written across the file (§4.9).

### The central finding: the brand's accent color is missing

Sampled from `public/assets/icons/around-the-house-icon.png`, the app icon is **three** colors:

| Role | Sampled | Present on site? |
|---|---|---|
| Dark green (house outline) | `#354e3c` | Yes — `--accent-dark: #244c42` |
| Sage green (leaf) | `#b1b794` | Partly — `--sage: #dcebe1` is much lighter |
| **Orange (the checkmark)** | **`#fbb664` / `#f5ad5a`** | **No — zero uses** |

The orange checkmark is the visual center of the app icon — the element that makes it *this* app rather than a generic house glyph. It is also functional in the app: sampled from `iphone-schedule.webp`, the "Today" pill and due-soon states use **`#de8c2b`**, and overdue uses **`#ac382e`**.

So the app's status language is **green = done / amber = due / red = overdue** — a three-state system that is the heart of a maintenance product — and **the website is monochrome green.** The website cannot express the product's single most important concept because it has thrown away two of its three colors.

**What should replace it:** introduce amber (`#de8c2b`, or `#f5ad5a` for larger fills) as a genuine accent, used *structurally* rather than decoratively — on overdue/upcoming callouts, on a "what's due" section, on the checkmarks in `.check-list` (currently `--accent` green at 3.65:1). Keep red reserved for overdue, matching the app.

**Why better:** it makes the website recognizably the same product as the icon a visitor just saw on the App Store, it gives the palette a second voice so green stops being the only signal, and it lets the site *show* the maintenance state concept rather than describing it.

### Other color notes

- **Backgrounds vs screenshots:** the app's background is `#faf5ec`; the site's cream cards are `rgba(255,250,242,·)`. Screenshots therefore sit on a near-identical cream and their edges dissolve — which is *why* the code adds borders and shadows to separate them, which is why there are 8 shadow variants. Nudging section backgrounds slightly cooler or darker behind screenshots would let the frames come off entirely.
- **`--warm: #ead8b8` is declared and unused**, while the body gradient hand-writes `rgba(238,220,188,.85)` — a *different* tan. The warm half of the palette was intended and never systematized.
- **Gradients:** four total (§4.6). None are load-bearing.
- **Band card body text** (`rgba(255,255,255,.72)` on `.band .card`) computes to ~4.44:1 — marginally under AA 4.5. Raising to `.80` fixes it. Minor.

---

## 11. Design-System Audit

Counted values in §4.9. Assessment: **there is a token layer, but the stylesheet does not use it.** `--radius` appears once against 16 hand-written radii; three tokens are dead. This is a system in name only.

### Proposed scale

| Axis | Now | Proposed |
|---|---|---|
| Radius | 17 values | **4**: `--r-sm: 8px` (inputs, chips) · `--r-md: 14px` (buttons, small containers) · `--r-lg: 22px` (cards, screenshots) · `999px` (pills only) |
| Shadow | 8 | **2**: `--shadow-soft` (raised surfaces) · `--shadow-lift` (screenshots only) |
| Weight | 6 | **3**: 400 · 600 · 700 |
| Surface | 9 creams | **3**: `--surface-page` · `--surface-raised` · `--surface-inverted` |
| Heading | 4 | **3**: h1 · h2 · h3 (delete `.feature-heading`) |
| Body size | 6 | **4**: 14 · 16 · 18 · 22 |
| Button | 2 (+3 link styles) | **3**: App Store badge · text link · quiet secondary |
| Card | 6 (`.card`/`.answer-card`/`.price-card`/`.faq-item`/`.gallery-figure`/`.screenshot-card`) | **2**: `.panel` · `.screenshot` |

### Button/link inventory

`.button` (green pill), `.button.secondary` (cream), `.button.disabled`, `.price-link` (underlined arrow link, `:201`), `.gallery-link .button.secondary`, `.footer a` — plus the nav button at a different padding. **Six link/button treatments.** Consolidate to three.

### Card inventory

Six card classes with six different radius/padding/shadow combinations:

| Class | Radius | Padding | Shadow |
|---|---|---|---|
| `.card` / `.answer-card` | 28px (`--radius`) | 26 / 30px | `--soft-shadow` |
| `.price-card` | 30px | 28px | `--soft-shadow` / `--shadow` |
| `.faq-item` | 24px | 24px | `--soft-shadow` |
| `.gallery-figure` | 28px | 14px | `--soft-shadow` |
| `.screenshot-card` | 34px | 18/16/14px | `--shadow` |
| `.cta-inner` | 42px | 58px | `--shadow` |

No two agree. Two classes (`.panel`, `.screenshot`) would cover every case.

---

## 12. Card / Container Audit

**~47 discrete rounded containers on the homepage.** Verdict per group:

| Group | Source | Count | Verdict |
|---|---|---|---|
| `.quick-answer span` | `:140-147` | 4 | **Delete the section.** |
| `.answer-card` | `:156-164` | 3 | **Unbox** → 3-step strip, hairline dividers, no borders. |
| `.question-pill` | `:175-177` | 6 | **Unbox** → plain quoted type in 2 columns. Best copy on the site; boxing demotes it. |
| `.card` (features) | `:188-192` | 6 | **Delete.** Redundant with screenshot sections. |
| `.feature-labels span` | `:220-226` | 5 | **Delete.** Keyword list as UI. |
| `.card` (personas) | `:300-302` | 4 | **Delete the section.** |
| `.price-card` | `:329-337` | 2 | **Keep.** Genuinely discrete, comparable options — cards are correct here. |
| `.faq-item` | `:349-356` | 4 | **Unbox** → `<details>` list with hairline rules. |
| `.screenshot-card` etc. | various | 11 | **Reduce to ~5**, each much larger, single-framed. |
| `.cta-inner` | `:360-367` | 1 | **Unbox** → full-bleed band or plain centered type. |
| `.coverage-note` | `:257` | 1 | **Keep.** A legal note genuinely benefits from a distinct container. |

**Net: 47 → ~9 containers.** The only ones that survive are the two pricing cards, the coverage disclaimer, and ~5 screenshot frames — precisely the cases where content genuinely belongs in a discrete box (discrete comparable options; a legal aside; a bounded image).

**The governing principle:** a card should mean *"this is one of several parallel, self-contained things you might compare or choose between."* Pricing tiers qualify. A feature description does not — it is just page content that has been put in a box because a box felt like design.

---

## 13. Screenshot Strategy

### Current state

23 real screenshots in `public/assets/screenshots/new/` (11 iPhone @1206×2622, 11 iPad @2048×2732, plus two @1242–1310×2688). The homepage uses 8; `/screenshots/` uses all 22.

Rendered sizes at 1440px, and the resulting downscale factor:

| Screenshot | Source width | Rendered | Downscale |
|---|---|---|---|
| `ipad-today` (hero) | 2048 | ~400px | **5.1×** |
| `ipad-item-record` | 2048 | ~410px | **5.0×** |
| `ipad-personal-property-documentation` | 2048 | ~430px | **4.8×** |
| `ipad-health-report` | 2048 | ~470px | **4.4×** |
| `iphone-cost-tracking` | 1206 | ~180px | **6.7×** |
| `iphone-warranty-countdown` | 1206 | ~180px | **6.7×** |

App body text renders at roughly 17pt on a 3× device ≈ 51 source pixels of line height. At a 5× downscale that is ~10px of line height on screen — below the threshold where letterforms resolve. **At 6.7× the phone screenshots are pure texture.**

### Six rules

1. **One screenshot per section, not three.** A single 800px image beats three 260px images every time.
2. **Minimum 700px wide at desktop for iPad captures; 340–420px for iPhone captures** (a 1206px-wide iPhone source at 380px is a 3.2× downscale — the practical legibility floor).
3. **Crop to the region that proves the point.** Do not show a whole iPad screen to make one argument. For "Remember what happened," crop `iphone-item-history.webp` to just the Maintenance History block — four rows, dates, provider, cost — and show it at ~500px. That crop is legible *and* it is the entire argument.
4. **Match the device to the claim and to the visitor.** iPhone screenshots for capture-in-the-moment ("snap the serial number"), iPad for overview ("see the whole schedule"). The hero should be iPhone.
5. **One frame, not three.** Delete the `.device-stage` wrapper. A single subtle border plus one shadow, or — better — a real device bezel like the one already used in the OG image.
6. **Never crop with `object-fit: cover` and a `max-height`.** Replace `.property-shot`'s height cap (`global.css:171-172`) with deliberate pre-cropped image assets.

### Alternating rhythm

The CSS already supports `COPY | PRODUCT` → `PRODUCT | COPY` (`.capability-grid.reverse`, `.property-grid.reverse`). The recommendation is to **use it for every product section and delete the grid sections between them**, so the page reads as a consistent alternating rhythm rather than alternating blocks interrupted by card grids.

For one or two sections, let the screenshot go **full-bleed or near-full-width** with the copy above it — breaking the two-column rhythm deliberately so it doesn't become its own template.

### Prerequisite

Every recommendation here is blocked on **recapturing the screenshots without demo-mode chrome, with past-dated history and realistic costs** (§4.8). Enlarging the current captures makes those defects legible and would be a net loss in trust. **This is the first task in the backlog.**

---

## 14. Home-Imagery Audit

**Finding: the site has essentially no stock photography, and this is correct.** There are no smiling families, no keys-over-a-doorstep, no contractor with a clipboard, no staged living room, no toolbox. The visual identity is the app icon plus real screenshots.

The only photographic content is **inside** the screenshots and is genuinely product-derived:
- A kitchen hero photo in `ipad-today.webp` / `iphone-today.webp` — this is the user's own property cover photo, an actual app feature.
- Item thumbnails in `iphone-items.webp` — attic vent fan, CO detector, bathroom exhaust fan, deck, dishwasher, dryer vent. These are unglamorous, specific, and exactly right: they look like photos a homeowner actually took.
- A chest freezer photo in `iphone-item-history.webp` labelled "Cover."

**Recommendation: add no photography.** If a moment of warmth is wanted, crop *up* on the existing item thumbnails — a grid of six real item photos (vent fan, CO detector, deck, dishwasher) at larger scale would be more evocative *and* more honest than any stock image, because it shows what the product actually contains.

**One caution:** the kitchen cover photo in `ipad-today.webp` is the most "stock-looking" element on the site — a bright, styled, plant-filled kitchen. It reads as a marketing photo rather than a homeowner's snapshot. Since it is the largest single image element in the hero screenshot, a plainer, more ordinary cover photo would make the whole hero feel more authentic.

---

## 15. Product-Authenticity Audit

### What the app actually contains (from screenshot inspection)

Verified capabilities, with the app's own terminology:

| App concept | Evidence | Used on site? |
|---|---|---|
| **Today** tab — Overdue / Coming Up / Documents counts, Areas of Your Home, "To Take Care Of" | `iphone-today.webp` | Hero screenshot only, illegible |
| **Items** — 31 items, 11 open reminders, filters (All Items / Categories / Areas), per-item "Last service: …" and document counts | `iphone-items.webp` | Gallery only |
| **Schedule** — month calendar, Today pill, per-day reminder list, OVERDUE badge, "Every 3 M…" recurrence | `iphone-schedule.webp` | Gallery + trio |
| **Binder** — categories (Appliances, Kitchen, Laundry, HVAC, Plumbing, Safety & Security, Exterior & Yard, Garage, Basement), typed documents (Receipt / Manual / Warranty) with size, date, and parent item | `iphone-binder.webp` | Trio only, small |
| **Maintenance History** — dated entries with type (Repair / Replacement / Cleaning), provider, cost | `iphone-item-history.webp` | **Not on homepage at all** |
| **Photos** — cover photo + up to 10 per item | `iphone-item-history.webp` | Mentioned in text only |
| **Reports** — health score, At a Glance, Maintenance Trend, Watchlist, Recent Records | `ipad-health-report.webp` | Yes, small |
| **Home Handoff Report** | `iphone-home-handoff.webp` | Trio only |
| **QR labels**, filter sizes, model/serial | `ipad-qr-item-details.webp` | **Gallery only** — a genuinely distinctive feature, absent from the homepage |
| **Areas** — Kitchen, Exterior, Garage/Yard, Safety, Utility, HVAC, Laundry, Bathroom | `iphone-today.webp` | Not used |

### The three biggest missed opportunities

**1. Maintenance History is the product's spine and it is not on the homepage.**

`iphone-item-history.webp` shows, for "Garage Deep Freezer":

```
Exterior & Yard Seaso…   Dec 14, 2026
Repair · Peak Appliance Repair · $971.00

Safety Device Test & B…  Nov 11, 2026
Replacement · Peak Appliance Repair · $1,0…

Appliance Cleaning & D…  Oct 8, 2026
Cleaning · Peak Appliance Repair · $705.00

Show 19 Older Entries
```

This *is* the answer to "When did I last service this? Who repaired it? What did it cost?" — three of the product's defining questions, answered in one image, with a provider name and a cost. **It appears nowhere on the homepage.** It should be a full section (§27, section 3).

Two caveats before using it: the entry titles truncate ("Exterior & Yard Seaso…", "$1,0…") and the dates are in the future. Recapture at a width that fits the titles, with past dates and plausible costs.

**2. Service providers are a real, named entity and the site treats them as a footnote.**

The app surfaces "Peak Appliance Repair," "Comfort Air Heating & Cooling," and `ipad-health-report.webp` shows "9 service providers in your history" as a tappable stat. "Know who to call" is one of the product's clearest homeowner benefits. On the site it appears only as a sub-clause in `index.astro:268` and one bullet at `:272`.

**3. QR labels and filter sizes are distinctive and hidden.**

`ipad-qr-item-details.webp` — "Save filter sizes, model and serial numbers, costs, notes, and a scannable QR code" (`screenshots.astro:31`). A QR sticker on the furnace that opens its record is a *memorable*, specific, un-fakeable feature that no generic productivity app has. It is on the gallery page and nowhere else. The homepage copy asks "What size is the furnace filter?" (`index.astro:15`) — and the app has a screen that literally answers it, unused.

### Terminology consistency

The site correctly uses the app's own words: **Binder** (capitalized, matching the tab), Home Handoff, Documentation Check, Insurance Coverage Overview, Personal Property Inventory, Home Value History. `screenshots.astro:6-32` is careful and accurate throughout. **This is a real strength** and should be preserved.

One gap: the app's **Areas** concept (Kitchen, Exterior, Garage/Yard, Safety, Utility, HVAC, Laundry, Bathroom) is a primary organizing structure in the product and appears nowhere in the site's vocabulary.

### No fabrication

Checked and confirmed: no invented testimonials, no user counts, no awards, no "trusted by," no fabricated statistics, no star ratings. The coverage disclaimer (`index.astro:257`) is appropriately careful. **This is exemplary and must be preserved.**

---

## 16. Copy / Design Relationship

### What is strong

- **`quickUses`** (`index.astro:14-21`) — six real homeowner questions. Best copy on the site.
- **"When something breaks, you already have the record."** (`:201`) — concrete, situational, product-specific.
- **"Give your home a memory."** (`:363`) — short, warm, ownable.
- **Privacy microcopy** (`:124`) — precise and appropriately scoped ("when sync is enabled").
- **The disclaimer** (`:257`) — states plainly what the app does *not* do.
- **Zero clichés from the prohibited list.** No "Your home, simplified," no "reimagined," no "take control," no "transform." This is genuinely well done.

### Where copy and design disagree

**1. Copy promises specificity; layout delivers abstraction.** The questions in `quickUses` are the most specific content on the site, and they sit in a 6-box grid with **no product visible** — the section that asks "What size is the furnace filter?" doesn't show the screen that answers it. Meanwhile the section that *does* show a legible-in-principle answer ("When something breaks," `:196-210`) sits 1,400px below.

**Fix:** merge them. Pose two or three questions as plain type on the left; show the screen that answers them, large, on the right.

**2. Headline abstraction ladder runs the wrong way.** The page opens most abstract and gets more concrete as you scroll:

| Position | Headline | Specificity |
|---|---|---|
| Hero | "Remember everything about your home." | Generic |
| §3 | "Add it once. Stop trying to remember it later." | Generic |
| §5 | "The house stuff people actually forget." | Semi |
| §6 | "When something breaks, you already have the record." | **Specific** |
| §8 | "See the health of your home, not just a list of chores." | **Specific** |

The two most concrete headlines are 3,000–6,000px down. Visitors who leave in five seconds see only the two generic ones.

**Fix:** lead with the specific. "Know what you fixed, what it cost, and what's due next" belongs in the hero.

**3. Feature-card copy could describe any app.** "Simple reminders — Remember filters, inspections, renewals, seasonal tasks, service dates, and warranty deadlines" (`:25`) is a list of nouns. The app has a *screen* — `iphone-schedule.webp`, showing "Degrease screen · OVERDUE · Range Hoo… · Every 3 M…" — that demonstrates it. Six such cards vs. one screenshot: the screenshot wins.

**4. Two headlines describe the layout rather than the benefit.** "Calm records for busy homes." (`:310`) and "Product preview" (`:309`) label a screenshot grid. If a section needs a heading that only says "here are some pictures," the section is doing no work.

**5. `.check-list` bolding fights the copy's calm.** `font-weight: 700` on 14 bullets (`global.css:160`) makes advisory detail shout.

**6. Two small tone slips.** "Forgetful brains" (`:34`) is the one cute moment in otherwise mature copy. "One low price. Your choice." (`:326`) is slightly salesy against the rest; "$0.99 a month, or $9.99 once" would be plainer and match the honest tone of the section beneath it.

---

## 17. Page-Rhythm Audit

### Homepage rhythm, as built

```
1  Hero                    split       [small product]
2  Trust strip             4 pills     —
3  Centered header  →  3 cards         —
4  Split                   6 pills     —
5  Centered header  →  6 cards         —
6  PRODUCT | copy          split       [small product]
7  Centered header  →  5 pills → 2× (PRODUCT | copy)   [small, cropped]
8  copy | PRODUCT          split       [small product]
9  copy | PRODUCT          split       [2 tiny phones]
10 Centered header  →  4 cards (dark band)             —
11 Centered header  →  3 screenshots                   [small]
12 Centered header  →  2 cards                         —
13 Centered header  →  4 cards                         —
14 Centered CTA card                                   —
```

**Seven centered headers. Five card grids. Eight of fourteen sections contain no visible product.** Sections 3→4→5 are three consecutive abstraction sections; 10→11→12→13 are four consecutive centered-header sections.

### Proposed rhythm

```
1  Hero                    copy | LARGE PRODUCT          asymmetric
2  Questions → answer      plain type | LARGE PRODUCT    no containers
3  Maintenance history     LARGE PRODUCT | copy          flipped
4  Binder / documents      FULL-BLEED PRODUCT + copy above   breaks the grid
5  Reports & costs         copy | LARGE PRODUCT          returns to rhythm
6  Property & documentation (condensed)  PRODUCT | copy  flipped
7  Privacy / no account    plain centered type          quiet, no container
8  Pricing                 2 cards                       the one legitimate grid
9  FAQ                     <details> list                hairlines
10 CTA                     App Store badge, plain band   full-bleed
```

Ten sections instead of fourteen, one centered header instead of seven, one card grid instead of five, and **six sections showing large legible product instead of zero.** The full-bleed section at position 4 deliberately breaks the two-column alternation so that alternation doesn't itself become a template.

### Other pages

- **`/screenshots/`** (`src/pages/screenshots.astro`) — hero, iPhone grid (11), iPad grid (11), CTA. At 10,386px desktop / 18,244px mobile this is a long undifferentiated wall. The grouping is right; consider grouping by *task* (Stay ahead / Remember / Keep documents / Know who) rather than by device, so the gallery tells the same story as the homepage.
- **`/support/`** — well structured: form, then "Helpful details," iCloud notes, purchases. `LegalArticle` wraps it in a 32px-radius cream panel; a plain article column would read cleaner, but this is minor.
- **`/privacy/`, `/terms/`** — appropriately plain. Terms is very short (`terms.astro`, 18 lines) but honest — it points at Apple's standard EULA, which is correct for this app.

---

## 18. Mobile Audit

Measured at 320 / 375 / 390 / 430 / 560 / 768 / 834 / 980px. *(Note: headless Chrome clamps window width to a 500px minimum, so narrow-viewport captures were taken via a width-constrained iframe harness to get accurate layout.)*

### Verified good

- **No horizontal overflow at any width, on any page.** `scrollWidth` ≤ viewport from 320px to 1440px throughout.
- **Tap targets pass.** Buttons are 13px vertical padding + ~19px line ≈ 45px tall; full-width in the hero on mobile.
- **Nav shrinks sensibly** — `min-height: 64px`, brand at 15px (`:258-259`).
- **Images have explicit `width`/`height`** on every tag, so there is no layout shift.
- **`/support/` form stacks correctly** — `.form-row` → 1 column at 560px (`:271`).

### P0 — Page length

**19,894px at 390px ≈ 24 phone-screens.** `/screenshots/` is 18,244px ≈ 22 screens. The desktop page is 11,668px; mobile is **1.7× longer** because every grid becomes a vertical stack: 3 answer cards + 6 question pills + 6 feature cards + 4 persona cards + 4 trust pills + 5 label pills = **28 stacked full-width boxes**, each ~150–250px tall, roughly 5,000px of near-identical rounded rectangles.

This is the clearest case of "stacking desktop components vertically is not a mobile design." The fix is the same as §6: delete the grids. Removing sections 2, 3, 5, 10, 11 cuts roughly **7,000px (35%)** from the mobile page.

### P0 — The product is below the fold on iPhone

At 390×844 the hero screenshot begins at **y ≈ 910px** — below the fold. First screen: nav, kicker, 4-line H1, 3-line lead, 3-line audience line, two full-width buttons, two lines of microcopy. **All text, no product.**

**Fix:** reduce H1 to ~48px, cut `.plain-line`, and use an iPhone screenshot instead of an iPad one. That lifts the product to roughly y≈620 — visible on first screen.

### P0 — No navigation below 980px

Covered in §8.1. Its severity is mobile-specific: on the device the app runs on, the site has no nav.

### P1 — iPad screenshots at 360px are decoration

At 390px, `.property-shot { max-height: 520px }` (`:274`) renders 2048px-wide iPad captures at ~360px — a **5.7× downscale**, plus a hard bottom crop. Four such images appear on the mobile page.

**Fix:** serve iPhone captures at mobile widths (`<picture>` with a `max-width: 700px` source), or crop iPad screens to a single legible region for small screens. An iPad screenshot on an iPhone is the wrong artifact at the wrong scale.

### P1 — Equal-weight CTAs

At ≤560px both hero buttons go full width (`:260-261`). "See how it works" — an anchor to a section that may be deleted — carries nearly the visual weight of the App Store link. Make the secondary a plain text link.

### P2 — Tablet gets the phone layout

There are only two breakpoints: **980px** and **560px**. Everything from 561–980px — the entire tablet range, including **iPad portrait at 834px** — gets single-column full-width stacking. At 834px the page is 19,739px, essentially the phone layout with more whitespace, and 2-up grids would fit comfortably.

Worth noting: **834px is where the hero screenshot finally becomes readable** (~790px wide) — the tablet layout accidentally demonstrates the correct screenshot scale while getting everything else wrong.

**Fix:** add a ~768px breakpoint keeping 2-column grids and side-by-side COPY|PRODUCT for tablets.

### P2 — Breakpoint gap at 981–1023px

The media query is `max-width: 980px`, so at 981–1023px the full desktop layout applies, including `.grid-3` at three columns and `.grid-4` at four. Four persona cards at 981px are ~230px wide each. Minor, but it is the seam of a two-breakpoint system.

---

## 19. Privacy and Trust Presentation

### Assessment: this is the site's most disciplined area, with one structural gap.

**What works:**

1. **Stated once, prominently, then dropped.** `index.astro:124`, directly beneath the hero CTA, 20 words. It is not repeated in eight sections. This restraint is exactly right and is rarer than it should be.
2. **Accurately scoped.** "when sync is enabled," "in your private iCloud" — conditional and true, not an absolute guarantee.
3. **FAQ reinforces without marketing it.** `index.astro:46` answers "Does Around The House require an account?" plainly.
4. **The privacy policy is genuinely readable.** `src/pages/privacy.astro` is 26 lines of plain English with real headings — "No Around The House account," "iCloud sync," "Data collection." It says "Quiet Tools does not sell your Around The House data" without a paragraph of hedging.
5. **Real support infrastructure.** A working form (`support.astro:15`) with topic/device/version fields, a real address (`support@quiettoolsapps.com`), an auto-response, honeypot spam protection, and a named developer (Quiet Tools) linked from the footer. For an indie app this is a meaningful trust signal.
6. **Pricing is on-page, both options, no dark patterns.** No "was $19.99," no countdown, no fake scarcity.
7. **Nothing fabricated.** No testimonials, counts, awards, or ratings.

**The gap: trust is stated, not shown.**

Every trust signal is a sentence. The most persuasive available proof — *the product working, legibly* — is the thing the site currently withholds (§4.4). "No account required" is more convincing when paired with a screenshot of the app opening straight to a populated Today view, with no sign-up wall.

**Two concrete opportunities:**

1. **Make "no account" visual.** The app has no login screen. Showing the first-run path — open the app, you're in — proves the claim better than asserting it.
2. **The demo-mode banner actively undercuts trust** (§4.8). The site says "your records"; the hero image says "example home records." Fixing this is both a design and a trust fix.

**One thing to avoid:** do not expand privacy into a section with its own icon grid. The current one-line treatment is correct. If it grows at all, it should become a short, quiet, uncontained block near the CTA (§27, section 7) — not a feature panel.

---

## 20. Website-to-App Visual Consistency

Comparing `src/styles/global.css` and the rendered site against the app screenshots and `public/assets/icons/around-the-house-icon.png`.

| Dimension | App | Website | Verdict |
|---|---|---|---|
| **Typeface** | SF Pro (system) | `Inter` declared, **never loaded** → falls back to system-ui | **Accidentally consistent** for most visitors, inconsistent for anyone with Inter installed (§4.10) |
| **Font weight** | Standard SF weights; body regular | 700–950; bold body bullets | **Disconnect** — the site is far heavier |
| **Background** | `#faf5ec` | `#f8f3ea` + 2 radial gradients | Close; site is slightly cooler and gradient-washed |
| **Primary green** | `#354e3c` (icon), dark green UI | `--accent-dark: #244c42` | Consistent |
| **Accent orange** | `#fbb664` (icon check), `#de8c2b` (Today/due) | **Absent** | **Major disconnect (§10)** |
| **Overdue red** | `#ac382e` | **Absent** | **Disconnect** |
| **Icons** | SF Symbols throughout | **Emoji** | **Major disconnect (§4.2)** |
| **Corner radii** | Consistent iOS grouped-list radii | **17 values** | **Disconnect** |
| **Density** | Compact iOS lists, hairline separators | Airy cards, 26–30px padding, heavy shadows | **Disconnect** — the app is a dense binder; the site is a spacious brochure |
| **Containers** | Grouped list sections, no drop shadows | Cards with borders **and** shadows | Disconnect |
| **Terminology** | Today, Items, Schedule, Binder, Areas | Binder ✓, Areas ✗ | Mostly consistent — **a strength** |
| **App icon usage** | — | Used in nav + footer at 38px | **Good** |
| **Tagline** | "Home care for everyday household life" (in-app header) | "The home memory app" | Two different taglines |

### The three disconnects that matter

**1. Icon language.** The app uses SF Symbols; the site uses emoji. This is the most visible and cheapest to fix (§4.2).

**2. Color completeness.** The app's core visual grammar is **green = done, amber = due, red = overdue** — the state system of a maintenance product. The site uses only green. It literally cannot show the concept it is selling (§10).

**3. Density and weight.** The app is a dense, quiet, information-rich binder: hairline separators, compact rows, regular-weight text, lots of data per screen. The site is airy and loud: 26–30px card padding, weight-800 labels, heavy shadows, 84px headlines. Moving from site to app, the *character* changes — the site promises a spacious brochure and the app delivers a dense, capable tool. The app is the better product; the site should look more like it.

**A fourth, smaller one:** there are **three** typographic identities in play — the app (SF Pro), the website (Inter-or-fallback at 800–950), and the OG image (a light, wide-tracked treatment). The OG image is arguably the most elegant of the three and matches neither.

### What is already consistent — preserve it

- The app icon is the site's brand mark, at correct scale, in nav and footer.
- Warm cream + forest green reads as the same family in both.
- Product terminology is accurate and capitalized to match the app.
- The "Your home at a glance / Items · Schedule · Binder · Reports" caption (`index.astro:131-134`) names the app's real tabs — a small, genuinely good touch that ties site to app.

---

## 21. Comparison — Things (culturedcode.com/things)

| Dimension | Things | Around The House | Gap |
|---|---|---|---|
| Hero headline size | Modest; product dominates | 84px, 4 lines; product ~400px | **Large** |
| Screenshot scale | Very large, legible | 4–7× downscaled | **Large** |
| Cards | Almost none | ~47 | **Large** |
| Section count | Few, long, deliberate | 14 | **Large** |
| Copy per section | 1–2 sentences | Kicker + headline + lead + 3 bullets | **Moderate** |
| Eyebrow labels | Rare | 15 | **Large** |

**Lessons:**

1. **Restraint is a position, not an absence.** Things is confident enough to show one screen and one sentence. Around The House explains six times before showing anything.
2. **The screenshot is the hero.** Things lets the product occupy the majority of the visual field. Around The House gives its hero screenshot ~35% of the hero width and then wraps it in three frames.
3. **Fewer, longer sections.** Things uses a handful of substantial sections; this site has 14, of which 8 contain no visible product.
4. **Concise copy.** Things trusts one sentence. Section 7 here (`index.astro:212-261`) has a header, a 3-line paragraph, 5 pills, two sub-headers, two leads, six bullets, and a disclaimer — before you reach a screenshot.

**Most transferable:** delete the three abstraction sections (§4.3) and double the screenshot sizes. That single change moves the site substantially toward Things without copying anything.

**What not to take:** Things is a task manager with little data per screen. Around The House is information-dense by nature — a maintenance record with dates, costs, and providers is the point. This site should show *more* information than Things, not less; it just needs to show it larger.

---

## 22. Comparison — Day One (dayoneapp.com)

**Conceptually the closest reference.** Both products preserve personal information over time and must make stored records feel *valuable* rather than *administrative*.

| Dimension | Day One | Around The House | Gap |
|---|---|---|---|
| Emotional frame | "Your memories, preserved" | "Remember everything about your home" | Small — both frame around memory |
| Records feel | Precious | Administrative | **Moderate** |
| Screenshot-led explanation | Consistently | Inconsistently | **Moderate** |
| Warmth without cliché | Strong | Good in copy, cold in layout | **Moderate** |
| Trust presentation | Prominent, integrated | Present, minimal | Small |

**Lessons:**

1. **Present stored records as valuable, not as data entry.** Day One never frames journaling as filing. This site's strongest section — "Add the thing / Save the details / Find it later" (`index.astro:8-12`) — is framed as *data entry*, which is the least appealing possible framing of the product. The reframe: not "save the details" but *"in three years, when the furnace fails, you'll know it was serviced in October and by whom."* The value is the future moment of retrieval, not the act of recording.

2. **Time is the emotional axis.** Day One makes the passage of time the point. Around The House has the same asset and doesn't use it: `iphone-item-history.webp` shows "Show 19 Older Entries" — a *nineteen-entry service history*. That accumulated record is genuinely valuable and slightly moving in the way a journal is. The site never dramatizes it.

3. **Warmth comes from specificity, not from softness.** Day One earns warmth with real entries and real photos. This site attempts warmth via cream gradients, 28px radii, and soft shadows — decoration rather than content. Its actual warm content (the freezer photo, the deck photo, the "Peak Appliance Repair" service record) sits at 5× downscale.

4. **The handoff moment is this product's "memories" moment.** `iphone-home-handoff.webp` — everything a future owner would need — is emotionally the strongest idea the product has, and it appears once, at ~250px, in a symmetric trio.

**Most transferable:** reframe from *storage* to *retrieval*. Section headings should describe the moment of payoff ("When something breaks, you already have the record" — the site already has one of these and it is the best headline on the page).

---

## 23. Comparison — Bear (bear.app)

| Dimension | Bear | Around The House | Gap |
|---|---|---|---|
| Distinct identity | Very strong (mascot, type, red accent) | Moderate (icon is good; site is generic warm-green) | **Moderate** |
| Typographic personality | Deliberate, distinctive | System fallback at heavy weights | **Large** |
| Escapes SaaS look | Fully | Partially | **Moderate** |
| Recognizable in a screenshot | Immediately | Not really | **Moderate** |

**Lessons:**

1. **A distinctive typeface is the cheapest personality available.** Bear's type is recognizable. This site declares Inter and loads nothing (§4.10), so it renders in the same system font as every other site — the most generic possible outcome. A deliberately chosen display face for headlines only (paired with SF Pro for body) would give the site a voice at almost no performance cost.

2. **One strong mark beats many weak ones.** Bear has a mascot. Around The House has an excellent, distinctive icon — a green house with an **orange check** and a sage leaf — and uses it at 38px in the nav, then never again. The orange, the most distinctive element, appears nowhere in the site palette (§10). The brand mark exists; the site doesn't exploit it.

3. **Escaping the SaaS look is structural, not decorative.** Bear avoids the generic look by not being built from centered headers and card grids. This site has seven centered headers and five card grids — the SaaS skeleton, wearing warmer colors.

**Most transferable:** adopt the icon's orange as a real accent, and choose the typography deliberately. Together those two changes would do more for distinctiveness than any layout work.

**What not to take:** Bear's personality is expressive and a little playful. Around The House should stay mature and calm — its distinctiveness should come from the *warm-green-plus-amber* palette and the density of real home data, not from whimsy.

---

## 24. Comparison — Anybox (anybox.app)

**The closest peer:** a small-developer, Apple-native, privacy-oriented utility.

| Dimension | Anybox | Around The House | Gap |
|---|---|---|---|
| Native-Apple identity | Immediate | Claimed in copy, undercut by emoji + custom CTA | **Moderate** |
| Feature communication | Direct, plain | Wrapped in kickers and cards | **Moderate** |
| Privacy positioning | Clear, proportionate | Clear, proportionate | **None — both good** |
| Indie confidence | High | Medium | **Moderate** |

**Lessons:**

1. **Native identity is signalled by details.** The App Store badge, SF Symbols, system typography, and Apple-standard layout conventions. This site uses a custom green pill instead of the badge (§4.7) and emoji instead of SF Symbols (§4.2) — two details that undercut a genuinely Apple-native product.

2. **Small developers can be direct.** Anybox states what a feature does and moves on. Section 7 here (`index.astro:212-261`) spends 2,032px on personal property and coverage. Directness reads as confidence; elaboration reads as selling.

3. **Privacy stated proportionately.** Both get this right. `index.astro:124` is the correct length and placement — **do not expand it.**

4. **Indie is an asset, and it is under-used here.** "Built by Quiet Tools" appears only in the footer (`Footer.astro:8, 35`). A single line — a named developer who answers support email — is a real trust signal for a paid app, and it costs nothing.

**Most transferable:** the Apple App Store badge, and SF Symbols in place of emoji. Both are asset swaps with no layout risk.

---

## 25. Comparison — Centriq

*Studied for homeowner problem framing and terminology, not visual design.*

**Where Centriq's framing is instructive:**

1. **The label/model-number capture moment.** Centriq's core insight is that the useful atomic action is *photograph the label*. Around The House **has** this — QR labels, model/serial capture, "Snap a label, serial number, breaker panel, part, or problem before you forget the details" (`index.astro:28`) — but it is one emoji card among six, and `ipad-qr-item-details.webp` never appears on the homepage. **This should be a demonstrated moment, not a bullet.**

2. **Manuals as the entry benefit.** "Where is the manual?" is a question homeowners actually ask. The Binder holds `garbage_disposal_manual.pdf`, `range_hood_manual.pdf`, `microwave_warranty.pdf` — with types, dates, and parent items. `iphone-binder.webp` is genuinely convincing and appears only in the small trio.

3. **Appliance-first mental model.** Homeowners think in *things* ("the dishwasher"), not in *tasks*. The app's Items tab matches this exactly. The site's `answerCards` ("Add the thing") gestures at it but abstractly.

**Where Around The House is stronger and should press the advantage:**

- **History and cost over time.** Centriq is largely about identification; Around The House records what happened, who did it, and what it cost. That is a deeper, more defensible position — and it is the section missing from the homepage (§15).
- **Recurring maintenance scheduling.** A real calendar with recurrence ("Every 3 M…") and overdue states.
- **No account required.** A meaningful differentiator in this category.

**Terminology worth adopting:** the app's **Areas** (Kitchen, Exterior, Garage/Yard, Safety, Utility, HVAC, Laundry, Bathroom) is homeowner-native vocabulary that the site never uses.

**Explicitly do not adopt:** Centriq's visual design, its service-marketplace framing, or any contractor-facing positioning. Around The House should stay a homeowner's private binder.

---

## 26. Comparison — HomeZada

*Studied for feature coverage and information architecture, not visual design.*

**Where HomeZada's IA is instructive:**

1. **Home information has natural domains** — property details, inventory, maintenance, finances, documents. Around The House covers most of these and organizes them well in-app (Today / Items / Schedule / Binder). The *website* doesn't reflect that structure; it presents a flat run of feature sections.

2. **"Important home info" is a real, expected category.** Where is the water shutoff? The breaker panel? The filter sizes? Homeowners expect this and it is a natural entry point. The app supports it (`index.astro:28` mentions breaker panels; the Binder holds home-level records), but the site has no section for it. **This is a genuine content gap**, and the prompt's proposed homepage flow is right to include it.

3. **Handoff/sale as a lifecycle moment.** HomeZada leans on this. Around The House has a dedicated **Home Handoff Report** — arguably a better-realized version — shown once at ~250px.

**Where Around The House should deliberately diverge:**

- **Do not follow HomeZada into financial-management breadth.** Home value, insurance analysis, and cost forecasting pull toward property-management software — precisely the character the product is trying to avoid. Section 7 (`index.astro:212-261`) has already drifted this way at 2,032px (§6). HomeZada is a useful map of *what homeowners expect*; it is not a model for *what this product should emphasize*.
- **Do not adopt its density or its dashboard aesthetic.** Around The House should feel like a well-kept binder, not a portal.

**Net:** HomeZada confirms two content gaps — **Important Home Info** and **handoff** — and confirms that the insurance material, while legitimate, should be *supporting* rather than *dominant*.

---

## 27. Proposed Visual Direction

### The idea

**A well-kept binder, not a brochure about a binder.**

The site should feel like the app: warm, dense, quiet, information-rich. Fewer containers, more content. The product supplies the color, the texture, and the proof; the page supplies typography, rhythm, and restraint. Where the site is currently a spacious brochure describing a dense tool, it should become a calm document that shows one.

### Principles

1. **The screenshot is the argument.** Every section that makes a claim shows the screen that proves it, at a size where the proof is readable.
2. **Containers are for things that are genuinely discrete.** Pricing tiers, a legal note, a bounded image. Not ideas.
3. **Structure signals section changes, not labels.** Alignment flips, background shifts, one full-bleed moment — instead of 15 uppercase kickers.
4. **Three colors, doing three jobs.** Forest green (structure), amber (attention/due — from the icon), red (overdue). Cream carries everything else.
5. **Type is calm and small.** Three weights, four sizes, mostly left-aligned. The product provides the visual excitement.
6. **Match the app's density.** Hairlines instead of card borders. Compact rows instead of padded panels.

### Concrete system changes

| Axis | From | To |
|---|---|---|
| Radius | 17 values | 4: `8 / 14 / 22 / 999px` |
| Shadow | 8 | 2 (`soft`, `lift` — lift on screenshots only) |
| Weight | 6 (700–950) | 3 (400 / 600 / 700) |
| Cream surfaces | 9 | 3 (page / raised / inverted) |
| Heading sizes | 4 | 3 |
| Body sizes | 6 | 4 (14 / 16 / 18 / 22) |
| H1 | `clamp(48, 7vw, 84)` | `clamp(38, 5vw, 62)` |
| Centered headers | 7 | 1–2 |
| Kickers | 15 | ≤2 |
| Card containers | ~47 | ~9 |
| Accent colors | 1 (green) | 3 (green / amber / red) |
| Icons | 6 emoji | SF Symbols or none |
| CTA | Custom green pill | Apple App Store badge |
| Font | Unloaded Inter | System stack (or a deliberate display face for headings) |
| Sections (home) | 14 | 10 |
| Mobile height | 19,894px | ~12,000px target |

### Proposed homepage story

Ten sections. For each: purpose, message, treatment, product UI, and copy budget.

---

**1 · Hero — the proposition, with the product**

- **Purpose:** in five seconds, say what it is and show it working.
- **Message:** *"Know what you fixed, what it cost, and what's due next."*
- **Treatment:** asymmetric split, copy left / product right (~55% width). H1 at ~56px, two lines. Apple App Store badge + quiet text link. Privacy line beneath, unchanged. No gradient plate, one frame.
- **Product:** **iPhone** `Today` — Overdue 2 / Coming Up 5 / Documents 48, Areas of Your Home, "To Take Care Of: Furnace & Air Filter · Overdue." ≥380px wide, demo banner removed. On mobile the screenshot moves above the audience line so it is visible on the first screen.
- **Copy:** headline + 2-line lead + privacy line. ~45 words.

---

**2 · The questions — and where the answers live**

- **Purpose:** establish recognition. This is the site's strongest copy; give it the best position.
- **Message:** *"Home information gets scattered. These are the questions it should answer."*
- **Treatment:** **no containers.** Six questions as plain quoted type in two columns, left-aligned, muted, ~20px. Product to the right. Replaces sections 2, 3, 4, and 5 of the current page.
- **Product:** `iphone-items.webp` — the searchable item list with "Last service: …" and document counts on each row. Large enough to read three or four rows.
- **Copy:** the six existing questions (`index.astro:14-21`, unchanged) + one framing line. ~40 words.

---

**3 · Remember what happened — maintenance history**

- **Purpose:** the product's spine; currently absent from the homepage.
- **Message:** *"Every repair, with the date, the person, and the price."*
- **Treatment:** **PRODUCT | copy** (flipped). Screenshot dominant, ~55%.
- **Product:** `iphone-item-history.webp`, **cropped to the Maintenance History block** — dated entries with type, provider, and cost, plus "Show 19 Older Entries." Shown at ~500px so every row is readable. *Requires recapture: untruncated titles, past dates, plausible costs.*
- **Copy:** headline + 2 sentences. Name the moment: three years later, the freezer fails, and the record is already there. ~40 words.

---

**4 · Everything about one thing — the item record** *(full-bleed; breaks the rhythm)*

- **Purpose:** show depth. One item holds photos, specs, documents, history, and reminders.
- **Message:** *"One place for the manual, the receipt, the filter size, and every visit."*
- **Treatment:** **full-width screenshot**, copy above it, centered and short. This is the page's one deliberate rhythm break — it should feel like opening the binder.
- **Product:** `ipad-item-record.webp` (or `ipad-qr-item-details.webp` for filter size / model / serial / QR) at 900–1100px wide. Optionally two annotated callouts.
- **Copy:** headline + 1 sentence. ~25 words.

---

**5 · Stay ahead — schedule and reminders**

- **Purpose:** the forward-looking half the current hero omits.
- **Message:** *"Recurring work shows up before it becomes a repair."*
- **Treatment:** copy | PRODUCT. **First use of amber**, matching the app's due-state color.
- **Product:** `iphone-schedule.webp` — calendar with the Today pill, "Degrease screen · OVERDUE · Every 3 M…". Large enough to read the overdue row.
- **Copy:** headline + 2 sentences + at most 2 bullets (unbolded). ~45 words.

---

**6 · The Binder — documents where they belong**

- **Purpose:** answer "Where is the manual?" and "Where is the receipt?"
- **Message:** *"Manuals, receipts, and warranties, filed with the thing they belong to."*
- **Treatment:** PRODUCT | copy (flipped).
- **Product:** `iphone-binder.webp` or `ipad-binder.webp` — categories expanded showing `dishwasher_receipt.pdf` (Receipt), `garbage_disposal_manual.pdf` (Manual), each with date and parent item. Legible.
- **Copy:** headline + 2 sentences. ~35 words.

---

**7 · Know what you own — property, documentation, handoff** *(condensed from 2,032px)*

- **Purpose:** cover personal property and the handoff without becoming insurance software.
- **Message:** *"Know what you own, where the proof is, and what to leave for the next owner."*
- **Treatment:** copy | PRODUCT, **one block**, ~700px. Keep the disclaimer. Frame as *records*, not coverage analysis. Consider leading with the Home Handoff Report — the emotionally strongest idea — and treating coverage as the supporting detail.
- **Product:** `iphone-home-handoff.webp` primary; `ipad-personal-property-documentation.webp` secondary or moved to `/screenshots/`.
- **Copy:** headline + 2 sentences + disclaimer. ~55 words.

---

**8 · Private by default** *(quiet, no container)*

- **Purpose:** state the trust position once, calmly.
- **Message:** *"No account. Your records stay on your devices and in your private iCloud."*
- **Treatment:** short centered block, **no card, no icon, no grid**. Generous space above and below. A visual pause before the commercial close.
- **Product:** none — or a small first-run frame showing the app opening straight into a populated view.
- **Copy:** ~30 words. Do not expand.

---

**9 · Pricing** *(unchanged)*

- **Purpose:** remove the last objection.
- **Treatment:** the two existing cards — **the one card grid that survives**, because two comparable options are genuinely what cards are for.
- **Copy:** as-is, with "One low price. Your choice." softened to something plainer.

---

**10 · Download** *(full-bleed band)*

- **Purpose:** close.
- **Message:** *"Give your home a memory."* (keep — it is a good line)
- **Treatment:** full-bleed band or plain centered type. **Drop the gradient card.** Apple App Store badge alone. **Remove the "Visit Quiet Tools" button** — it is already in the footer and competes at the conversion moment.
- **Copy:** headline + 1 line. ~20 words.

---

### What this achieves

| | Now | Proposed |
|---|---|---|
| Sections | 14 | 10 |
| Sections showing legible product | 0 | 6 |
| Card containers | ~47 | ~9 |
| Centered headers | 7 | 2 |
| Kickers | 15 | ≤2 |
| Desktop height | 11,668px | ~8,500px |
| Mobile height | 19,894px | ~12,000px |
| "Could be any app" sections | 5 of 14 | 0 of 10 |

---

## 28. Prioritized Design Backlog

### P0 — Materially hurts understanding, accessibility, or trust

| # | Item | Files |
|---|---|---|
| P0-1 | **Recapture all marketing screenshots without demo-mode chrome**, with past-dated history and plausible costs. Blocks every screenshot recommendation. | `public/assets/screenshots/new/*`, `public/assets/og/around-the-house-og-v2.png` |
| P0-2 | **Enlarge hero screenshot and switch to an iPhone capture.** Currently 5.1× downscale, iPad artifact, below the fold on mobile. | `index.astro:126-135`, `global.css:98-113` |
| P0-3 | **Restore navigation below 980px.** Five links vanish with no replacement on the site's most important viewport. | `Header.astro:12-29`, `global.css:239` |
| P0-4 | **Resolve the font.** `Inter` is declared and never loaded; the design machine renders differently from every visitor's. | `global.css:15`, `BaseLayout.astro:71-73` |
| P0-5 | **Enlarge the four main product screenshots to ≥700px** and remove the `object-fit: cover` height crop. | `index.astro:198, 230, 246, 275`, `global.css:171-172` |

### P1 — Removes the AI/template feel; builds product identity

| # | Item | Files |
|---|---|---|
| P1-1 | **Delete the three card-grid sections** (3 answer cards, 6 feature cards, 4 persona cards) and the trust strip. Removes 19 containers and ~3,400px desktop / ~7,000px mobile. | `index.astro:140-147, 149-166, 181-194, 293-304` |
| P1-2 | **Replace emoji icons with SF Symbols or nothing.** | `index.astro:23-30`, `global.css:138` |
| P1-3 | **Reduce 15 kickers to ≤2 and 7 centered headers to ≤2.** | `index.astro` throughout, `global.css:87, 126` |
| P1-4 | **Add a "Remember what happened" section** using the maintenance-history screenshot. The product's spine, currently absent. | new section; `iphone-item-history.webp` |
| P1-5 | **Introduce the icon's amber (`#de8c2b` / `#f5ad5a`) and overdue red as real accents.** Restores the app's green/amber/red state language. | `global.css:1-16` |
| P1-6 | **Use the Apple App Store badge.** | `index.astro:121, 365`, `Header.astro:19` |
| P1-7 | **Condense the property/coverage section from 2,032px to ~700px** and reposition after maintenance. | `index.astro:212-261` |
| P1-8 | **Unbox the six homeowner questions** and pair with the answering screenshot; move up the page. | `index.astro:168-179`, `global.css:146` |
| P1-9 | **Reduce H1/H2 scale** (H1 → `clamp(38, 5vw, 62)`) and drop `.check-list` to weight 400. | `global.css:88-93, 160` |
| P1-10 | **Collapse the design system**: 17 radii → 4, 8 shadows → 2, 6 weights → 3, 9 creams → 3. Delete `--warm`, `--cream`, `--bg-soft`. | `global.css` throughout |

### P2 — Secondary

| # | Item | Files |
|---|---|---|
| P2-1 | Add a ~768px tablet breakpoint (2-col grids, side-by-side COPY\|PRODUCT). iPad currently gets the phone layout. | `global.css:236-275` |
| P2-2 | Remove decorative `translateY` offsets (54px, 34px) on phone pairs. | `global.css:117, 158` |
| P2-3 | Replace the gradient `.cta-inner` card with a full-bleed band; remove "Visit Quiet Tools" from the final CTA. | `index.astro:360-367`, `global.css:207` |
| P2-4 | Remove the `.device-stage` gradient plate and triple-framing. | `global.css:99-110` |
| P2-5 | Convert FAQ cards to a `<details>` list with hairline rules. | `index.astro:342-358`, `global.css:202-204` |
| P2-6 | Consolidate 6 card classes → 2, and 6 button/link treatments → 3. | `global.css` |
| P2-7 | Regroup `/screenshots/` by task rather than by device. | `screenshots.astro:6-32` |
| P2-8 | Raise `.band .card p` to `rgba(255,255,255,.80)` (currently ~4.44:1, just under AA). | `global.css:179` |
| P2-9 | Add an "Important Home Info" moment (shutoffs, filter sizes, breaker panel) — an expected homeowner category with no section. | new |
| P2-10 | Adopt the app's **Areas** vocabulary. | copy throughout |

### P3 — Polish

| # | Item | Files |
|---|---|---|
| P3-1 | Reconcile taglines — "The home memory app" vs the app's "Home care for everyday household life." | `index.astro:116`, `Footer.astro:17` |
| P3-2 | Rename `.landscape-shot` (applied to a portrait image). | `index.astro:198`, `global.css:152` |
| P3-3 | Merge `.lead` / `.small-lead` (24px vs 22px — imperceptible). | `global.css:92-93` |
| P3-4 | Soften "Forgetful brains" and "One low price. Your choice." | `index.astro:34, 326` |
| P3-5 | Reduce `.lead` max-width 720 → ~620px (currently ~78 characters). | `global.css:92` |
| P3-6 | Surface "Built by Quiet Tools" once outside the footer. | `index.astro` |
| P3-7 | Rebuild the OG image on the new system — its type treatment matches neither site nor app (though its headline is better than the live H1). | `public/assets/og/` |
| P3-8 | Consider a plainer property cover photo — the current kitchen reads as stock. | app demo data |

---

## The 10 Highest-Value Changes

Ranked by impact per unit of effort.

| # | Change | Why it matters |
|---|---|---|
| **1** | **Recapture screenshots without demo-mode chrome, with past dates and plausible costs** | Every other screenshot change depends on it. Currently the hero and the OG card both announce the data is fake. |
| **2** | **Double the size of every product screenshot; make the hero an iPhone capture** | Answers homepage questions #4 and #5, which currently both fail. The product becomes the argument instead of the wallpaper. |
| **3** | **Delete the three card-grid sections and the trust strip** | Removes 19 of 47 containers, ~3,400px desktop / ~7,000px mobile, and all five sections that survive the "could be any app" swap. The single biggest de-templating move. |
| **4** | **Add a "Remember what happened" maintenance-history section** | The product's defining capability — dates, providers, costs — is absent from the homepage. |
| **5** | **Restore navigation below 980px** | Five links vanish on the viewport that matters most for an iPhone app. Support is 19,000px away. |
| **6** | **Replace emoji with SF Symbols; use the Apple App Store badge** | Two asset swaps, no layout risk, and the two clearest signals of native-Apple identity. |
| **7** | **Introduce the icon's amber and overdue red** | Lets the site express green/amber/red — the state language at the heart of a maintenance product — and connects the site to the icon a visitor just saw. |
| **8** | **Cut kickers 15 → 2 and centered headers 7 → 2** | The repeated `KICKER → centered H2 → paragraph` figure is the strongest template tell on the page. |
| **9** | **Collapse the design system** (17→4 radii, 8→2 shadows, 6→3 weights, 9→3 surfaces) | Converts accumulated drift into intent. Mechanical, no creative risk. |
| **10** | **Condense property/coverage from 2,032px to ~700px and reposition** | Stops the largest section on the page from positioning a home binder as insurance software. |

---

## Appendix A — Files Referenced

| File | Role |
|---|---|
| `src/pages/index.astro` | Homepage — 369 lines, 14 sections, all content arrays |
| `src/styles/global.css` | Entire design system — 286 lines, all tokens and components |
| `src/components/Header.astro` | Nav — the `display: none` breakpoint issue |
| `src/components/Footer.astro` | Footer — well-judged, no changes recommended |
| `src/layouts/BaseLayout.astro` | Head, meta, OG, JSON-LD — no webfont link |
| `src/pages/screenshots.astro` | Gallery — best heading treatment on the site |
| `src/pages/support.astro` | Support form — good structure, real trust signal |
| `src/pages/privacy.astro` | Privacy policy — genuinely readable |
| `src/pages/terms.astro` | Terms — short, honest |
| `public/assets/screenshots/new/*.webp` | 23 real captures — the site's most under-used asset |
| `public/assets/icons/around-the-house-icon.png` | Brand mark — source of the unused amber |
| `public/assets/og/around-the-house-og-v2.png` | OG card — better headline than the live H1; shows demo banner |

## Appendix B — Changes Made During This Audit

Per the brief, no redesign was performed. Two non-visual housekeeping edits:

1. **Added `.claude/launch.json`** — dev-server config so the site can be previewed on a fixed port. Development tooling only.
2. **Added `.claude/` to `.gitignore`** — keeps local tooling config out of the repo.

Three temporary measurement harnesses (`public/__audit.html`, `__mob.html`, `__vp.html`) were created to measure layout overflow and narrow-viewport rendering, and **have been deleted**. `git status` is otherwise clean.

**No CSS, markup, copy, or asset was modified.** Every finding above is documented, not applied.

One correction worth recording: an early pass appeared to show content clipping at the right edge on mobile. That was a capture artifact — headless Chrome clamps its window to a 500px minimum width, so sub-500px screenshots render at 500px and crop. Re-measured via an iframe harness, **`scrollWidth` is within the viewport at every width from 320px to 1440px on all four pages. There is no responsive overflow bug.**

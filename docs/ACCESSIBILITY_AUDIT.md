# Accessibility audit and remediation

Audit date: October 12, 2026.

This records what was reviewed, what was found, what was changed, and what still needs a person to check. It is not a certification and makes no legal compliance claim. Passing automated checks does not prove WCAG conformance.

## 1. Standards and scope

- **Target:** WCAG 2.2 Level A and AA.
- **Context:** Colorado HB21-1110 and 8 CCR 1501-11 apply to state and local government technology and use WCAG 2.1 AA. Around The House is a private commercial website, so those rules are used here as a reference point, not as a statement that they bind this business. ADA guidance was treated the same way.
- **Scope:** every route the build produces (45), the shared layouts and components, and all client scripts. The native app is out of scope.
- **Appearances:** the site is light-only except the Home Health Check, which also has a dark appearance. Both were tested there.

## 2. Pages and components reviewed

All 45 routes were scanned and keyboard-walked: the homepage, 21 product and landing pages, the resources index and 14 guides, the annual checklist, Home Health Check, pricing, screenshots, support, privacy, terms, about, editorial standards, and the new accessibility statement.

Components and scripts read line by line: `BaseLayout`, `LandingLayout`, `ArticleLayout`, `Header`, `Footer`, `AppStoreLink`, `Breadcrumbs`, `HomeStoryHero`, `HomeHealthCheckTeaser`, `HomeHealthCheck`, `LegalArticle`, `PageCta`, `ProductBlock`, `ProductScreenshot`, `RelatedLinks`, `home-health-check.ts`, `home-story-hero.ts`, `checklist-download-alert.js`, and the three stylesheets.

The site was already in good shape: a skip link, one `h1` per page, landmarks, labelled form fields, alt text on every image, table headers and captions, a pause control on the slideshow, and a global reduced-motion rule were all in place. axe-core found no violations before any change. The issues below came from keyboard, contrast, and reading-order checks that axe cannot do.

## 3. Issues found and fixed

| # | Issue | WCAG | Severity | Where | Fix |
|---|---|---|---|---|---|
| 1 | Focus ring (blue `#0f6fcb`) was about 2.5:1 on the dark footer and other dark bands, and the quiz's clay ring was about 1.1:1 on its green call-to-action panel | 1.4.11, 2.4.7 | Serious | Footer on most pages, pricing details band, homepage quiz teaser, quiz results | Light focus ring on dark and saturated surfaces |
| 2 | Links inside sentences had no underline and inherited the text colour, so they were indistinguishable from text | 1.4.1 | Serious | Compact footer (support, privacy, terms), pricing, page call-to-action microcopy | Underline for unclassed links inside running text |
| 3 | Hero headline over the photograph dropped to 2.5:1 at 980px wide, where the green italic line ran past the scrim onto the shelf of filters | 1.4.3 | Serious | Homepage, 980–1199px | Scrim extended for that width range; lowest measured ratio is now above 4:1 |
| 4 | Support form field borders were about 1.3:1 against the field, and the focus style was a 25%-opacity tint | 1.4.11, 2.4.7 | Moderate | `/support/` | Border `#6f7a70` (over 3:1), solid 3px focus ring, explicit placeholder colour |
| 5 | Mobile menu stayed open over the page after focus moved past it, and did not close on an outside click | 2.4.11 | Moderate | Header, 980px and below | Closes when focus or a click leaves it. Escape still closes and returns focus |
| 6 | Menu button had a fixed `aria-label="Open menu"`, which was wrong while the menu was open | 4.1.2 | Moderate | Header | Label removed. The native `<summary>` is named “Menu” and exposes expanded/collapsed itself |
| 7 | Lazy screenshots in product blocks reserved no height until loaded, so the page jumped by hundreds of pixels and pushed the focused link off screen | 2.4.11 (and layout shift) | Moderate | Landing pages with product blocks, narrow widths | Figure given a definite width so the image's aspect ratio reserves space |
| 8 | Quiz progress (“Question 2 of 6”) and the final score were visible but not announced; focus moved past them | 4.1.3 | Moderate | `/home-health-check/` | Status region now announces progress on each question and the score with its band |
| 9 | Quiz tally read “2 red · 1 yellow · 3 green”, while each answer is labelled “Uh oh”, “Getting there”, “Pro move”. The colours had no stated meaning | 1.4.1, 1.3.3 | Moderate | Quiz results | Tally now uses the same labels as the answers. Scoring is unchanged |
| 10 | Checklist progress count was not exposed as a status message | 4.1.3 | Minor | `/annual-home-maintenance-checklist/` | `role="status"` on the count |
| 11 | Support success message was revealed by removing `hidden` from a live region, which screen readers often skip, and it always scrolled smoothly | 4.1.3, 2.3.3 | Minor | `/support/?sent=1` | Message receives focus; scrolling respects reduced motion |
| 12 | Footer link groups were loose anchors, not lists | 1.3.1 | Minor | Footer | Each group is a `<ul>` |
| 13 | Inactive slideshow dots were about 2.2:1 | 1.4.11 | Minor | Homepage hero | Darkened to `#7d7666` (about 4:1). The active dot is also wider, so state is not colour-only |
| 14 | App Store links open a new tab without saying so | 3.2.5 (AAA, advisory) | Minor | Every page | Visually hidden “(opens in a new tab)” added to the link name |
| 15 | Decorative generated glyphs (☰, ✕, +, −, ✓, /) could be read aloud | 1.3.1 | Minor | Menu, FAQ, lists, breadcrumbs | Empty alternative text via `content: "…" / ""`, with the old declaration as fallback |
| 16 | Arrows in “iPhone screens ↓” were read aloud | 1.3.1 | Minor | `/screenshots/` | Wrapped in `aria-hidden` |
| 17 | Current page was not marked in navigation | 2.4.8 (AAA, advisory) | Minor | Header | `aria-current="page"` on the matching link |
| 18 | No accessibility statement | n/a | n/a | Site | `/accessibility/` added and linked from both footer variants |

## 4. Changes by file

- `src/styles/global.css`: new “Accessibility” section at the end (items 1, 2, 4, 7, 12, 15, 17, plus a `.visually-hidden` utility and a scroll margin so checklist checkboxes clear the sticky toolbar).
- `src/styles/home-story.css`: scrim for 980–1199px, dot colour (3, 13).
- `src/components/Header.astro`: menu label, focus-out and outside-click closing, `aria-current` (5, 6, 17).
- `src/components/Footer.astro`: lists, Accessibility link, link row in the compact footer (12, 18).
- `src/components/AppStoreLink.astro`, `src/pages/screenshots.astro`: new-tab text, arrows (14, 16).
- `src/scripts/home-health-check.ts`: announcements and tally labels (8, 9).
- `src/pages/support.astro`, `src/pages/annual-home-maintenance-checklist.astro`: status handling (10, 11).
- `src/pages/accessibility.astro`: the statement (18).
- `scripts/accessibility-test.mjs`, `package.json`: the regression suite and `npm run test:a11y`.

Not changed: URLs, metadata, structured data, pricing, copy other than the quiz tally, screenshots, scoring logic, and the App Store destinations. The deploy workflow gained one step that runs the accessibility suite. No overlay, analytics, or third-party script was added.

The statement names “Quiet Tools LLC” because the project brief did. The rest of the site says “Quiet Tools”. Confirm the legal name before publishing.

## 5. Automated test results

Run on October 12, 2026 with Google Chrome (headless) through playwright-core 1.64 and axe-core via `@axe-core/playwright`.

| Check | Result |
|---|---|
| `npm run check` (production build of 45 pages plus site validation) | Passed |
| `npm run test:quiz` (scoring logic and quiz palette contrast) | Passed |
| `npm run test:a11y` | Passed, 0 failures |

What `npm run test:a11y` did in that run:

- 294 axe scans: every route at 1440×1000, 1920×1080, 834×1194, 390×844, 640×512 (200% zoom) and 320×256 (400% zoom), plus the quiz in dark mode and in its question, feedback, and results states. Tags: WCAG 2.0/2.1/2.2 A and AA, and best practices. Zero violations.
- 270 structure and reflow checks: language, title, one `h1`, one `main`, landmarks, skip link first, no horizontal scrolling, zoom not blocked, inline links underlined, footer link to the statement, new-tab links announced.
- 135 keyboard walks: Tab through every element on every route at three sizes, checking for a visible indicator of at least 2px, 3:1 indicator contrast where the background is a flat colour, the focused element on screen and not covered, and no keyboard trap.
- 90 text-spacing checks (WCAG 1.4.12 overrides applied, no clipping or horizontal scroll).
- 15 text-over-photograph samples: hero copy against the real pixels behind it, at five widths and all three scenes.
- Interaction checks: skip link, mobile menu, support form (labels, required markers, border contrast, invalid submit keeps input and focuses the first error, success message; nothing is ever sent), checklist, slideshow pause and reduced motion, six full keyboard-only quiz journeys in light and dark, and the statement page.

Not run: Lighthouse, a standalone HTML validator, and the older optional browser QA scripts (`scripts/browser-qa.mjs` and friends), which need a `playwright` package and a preview server that this change did not set up.

## 6. Manual verification results

| Check | Result |
|---|---|
| Keyboard-only use of every page | Passed (scripted real key presses, all routes) |
| Focus indicators and order | Passed (scripted), plus screenshots of the footer, form, and menu reviewed by eye |
| Mobile navigation: open, Escape, focus return, close on leave | Passed (scripted) |
| Home Health Check completed by keyboard, light and dark | Passed (scripted) |
| Support form errors and success state | Passed (scripted, no submission) |
| 200% and 400% zoom equivalents, 320px reflow | Passed (scripted viewports) |
| Text spacing | Passed (scripted) |
| Reduced motion | Passed (scripted: slideshow does not auto-play, no cross-fade, no smooth scroll) |
| Visual review of changed areas | Passed (hero at 1024px, support form, both footers, mobile menu, statement page) |
| VoiceOver, NVDA, JAWS, TalkBack | **Not verified.** No screen reader was operated |
| Real devices, real browser zoom, Safari, Firefox | **Not verified.** Chrome only |
| Windows High Contrast / forced colours | **Not verified** |
| Voice control, switch access | **Not verified** |

## 7. Known limitations

- **Font sizes are in pixels.** Browser zoom works to 400%, which satisfies 1.4.4, but a larger default font size set in the browser or operating system is not honoured. Converting the type scale to `rem` would fix this and is a design-system change, so it was left alone.
- **Form errors use the browser's built-in validation messages.** They are announced and keep the user's input, but only the first error is shown at a time and the wording is the browser's.
- **FormSubmit CAPTCHA.** The support form hands off to a third-party page that may show a CAPTCHA. Its accessibility was not tested. The support email is offered on the same page as an alternative.
- **Expanded/collapsed state** of the menu, FAQ items, and “See the app screen” relies on native `<details>`. This is well supported, but was not confirmed with a screen reader.
- **Hero contrast sampling** ignores the darkest 1% of pixels behind each line as image noise.
- **The focus-contrast check** skips elements over gradients and photographs.
- Automated tools catch only a share of accessibility problems.

## 8. Remaining issues

No known critical or serious issues remain. Open items are the “Not verified” rows above and the pixel font sizes.

## 9. Manual checklist, in priority order

1. **VoiceOver on iPhone (Safari):** open the menu and confirm it says “Menu, collapsed/expanded”. Complete the Home Health Check and confirm you hear the question number, the verdict after each answer, and the score at the end.
2. **VoiceOver on Mac (Safari):** submit the support form empty and confirm the error is read. Load `/support/?sent=1` and confirm the thank-you message is read.
3. **VoiceOver:** on the homepage, change scenes with the three scene buttons and confirm the new scene is announced and hidden slides are not read.
4. **VoiceOver:** tick a few boxes on the annual checklist and confirm the count is announced without being disruptive. If it is too chatty, remove `role="status"` from `#progress-label` and announce on a delay instead.
5. **Real zoom:** in Safari and Chrome at 200% and 400%, read the homepage, a guide, pricing, and the comparison table on `/homezada-alternative/` (the table scrolls sideways by design).
6. **iPhone, large text:** with Safari's page zoom at 200%, check the header and quiz.
7. **Send one real support request** and go through the FormSubmit CAPTCHA with a keyboard and a screen reader.
8. **Windows:** NVDA with Firefox or Chrome on the homepage, quiz, and form; then High Contrast mode for focus rings and the slideshow dots.
9. **Confirm the legal name** in the statement.

## 10. Keeping it accessible

Before publishing any change:

```bash
npm run check
npm run test:quiz
npm run test:a11y
```

- New pages are picked up automatically; the suite scans whatever the build produces.
- Fix failures. Do not add exclusions to the suite to make them pass.
- For new interactive components, add a keyboard journey to `scripts/accessibility-test.mjs` next to the existing ones.
- Keep links inside sentences unclassed (they are underlined automatically) or give classed inline links their own underline.
- Give new dark sections a light focus ring by adding them to the selector list in the Accessibility section of `global.css`.
- Repeat the manual checklist after any change to the header, quiz, forms, or hero, and at least twice a year.
- Review the statement's date and content when the site changes materially.
- `.github/workflows/deploy.yml` runs `npm run test:a11y` after the build, using the Chrome preinstalled on GitHub's Ubuntu runners. A failing check blocks publication.

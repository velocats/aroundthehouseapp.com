# Around The House redesign: Phase 3 report

Completed October 11, 2026 on `codex/website-marketing-redesign`. The native Home Health Check now works at `/home-health-check/`. No deployment, push, merge, or Phase 4 implementation occurred.

## Source fidelity and implementation

Read the Phase 1 plan, Phase 2 report, repository context, and original quiz source in `docs/design-reference/Home Health Check_files.zip :: Home Health Check_files/saved_resource.html`. The original includes standalone quiz CSS/data/controller after Claude's frame preamble. Only the meaningful quiz design and behavior were adapted. No artifact viewer, iframe, Anthropic runtime, capability imports, or Claude share target appears in production.

The production quiz preserves:

- Exactly six questions with four choices each, one question at a time.
- Original cream/forest/clay palette, centered 620px column, answer cards, six-segment progress track, traffic-light labels, reaction styling, dashed rule box, explanation box, score display, recommendations, conversion card, and sharing/retake section.
- Original Fraunces and Instrument Sans typography, now served locally as Latin WOFF2 subsets. Font files retain their SIL Open Font License notices in `public/assets/fonts/`. The original dark palette is scoped to the quiz; the shared header/footer remain unchanged in theme.
- Original reaction pools and deterministic `(question index + answer index) % pool length` choice, plus the original introduction, result category descriptions, conversion headline/body, and playful sharing invitation.
- Green 2 / yellow 1 / red 0 scoring; exactly 12 maximum points; 11–12 House whisperer, 6–10 Mostly on it, 0–5 Your house is keeping secrets.
- Immediate feedback with Rule of thumb and Why it matters, followed by explicit Next question or See my score. Answers never auto-advance.

Requested maintenance corrections are recorded in the appendix and [complete wording comparison](design/phase3/wording-changes.json). The unsupported free-trial conversion button was replaced with the existing official App Store badge and correct destination. The free checklist is available to everyone.

## State, recommendations, and sharing

Pure functions in `src/data/homeHealthCheck.ts` own scores, result bands, deterministic feedback, recommendation order, and guarded state transitions. State consists only of current index, six in-memory answer slots, and question/results phase. Scores are recalculated from the current six choices, never incremented in a running total.

Back revisits earlier answers without clearing other answers. A separate Change answer control unlocks the current question, permitting correction; Next revisits the retained later answers. Review answers on results returns to question six. Take it again clears all choices and focuses question one. Stale DOM callbacks are rejected by a render-generation token, answer/Next transitions verify the current index and answered state, double-click events are ignored, and repeating Enter/Space is prevented from activating replacement controls.

Results show the actual choice for each area, tone counts, each rule, non-green practical tips, and links to supporting guidance. The original sorting is preserved: red first, then yellow, then green; equal severity follows original question order. A separate “Safety first, whatever your score” section highlights non-green smoke-alarm and dryer findings independently of score. A disconnected smoke alarm receives prompt-restoration guidance. Even an 11-point House whisperer result receives a smoke-testing alert when its smoke answer is yellow. A score is explicitly not an inspection, certification, or complete assessment.

Copy/share text includes only score, category, and `https://aroundthehouseapp.com/home-health-check/`. Individual answers never enter the URL, clipboard/share text, storage, analytics, or server requests. Clipboard rejection or unavailability reveals and selects a readonly full-score textarea, with manual copying instructions suitable for phones. Supported browsers also receive a native Share my score button. Native sharing cancellation leaves results available; non-cancellation failure exposes the same fallback. Async completion does not update a removed results view.

## Integration and homepage protection

The page uses the existing BaseLayout, single main/h1, branding/header/footer, canonical URL, unique title/description, and shared structured-data conventions. Sitemap generation now includes 44 URLs, preserving all 43 previous routes.

Discovery is through the existing homepage CTA, a sitewide Maintenance & guides footer link, and a resources-page quiz invitation. The header is unchanged to avoid crowding its existing navigation.

The homepage teaser now imports question one and its choices from the quiz data, preventing wording drift. Its preview remains noninteractive and clearly labeled. The approved Phase 2 hero, photography, all three composites, headline, supporting sections, carousel controller, and homepage stylesheet were not changed during Phase 3. The only homepage-component edit is the requested teaser wording/data binding. Footer/resource discovery changes are small additions.

The Phase 2 temporary `ALLOW_PENDING_PHASE3_QUIZ` validator exception was removed. Default validation is restored with no quiz-route exemption.

## Accessibility and privacy

Answer buttons have proper group/question labeling, selected states, semantic disabled locking after selection, and text labels alongside colors. Progress includes readable question number/topic. Controls have at least 44px practical touch targets; answer cards are at least 52px tall. Source and inline privacy links retain readable text without forcing large block controls.

New questions, results, and restart receive explicit heading focus. Selecting an answer retains the original Next-focus behavior while a stable, short status region announces its tone/reaction; the full stage is not a live region. Feedback and recommendations remain ordinary readable content. Scroll positioning is immediate and never forces smooth motion; reduced motion removes transitions. Green/yellow tone text was darkened and button borders strengthened for contrast, and disabled answer text no longer fades to low contrast. The original dark palette is retained within the widget.

With JavaScript disabled, a useful static list of all six corrected maintenance rules, supporting links, and the free checklist replaces the interactive score. No dead answer/Next buttons are shown. Privacy/disclaimer/source links remain available.

Answers are memory-only, reset by refresh/leaving, and not collected. The page discloses that deliberate sharing sends the score/category/link. Fonts and quiz requests stay on the site origin. Existing unrelated checklist storage and support processing were preserved.

## Tests and build results

All tests below passed:

| Check | Result |
| --- | --- |
| `npm run check` | Normal static build and validation pass; 44 pages and sitemap routes, no exemption. Validates metadata, canonicals, social titles, landmarks, images, JSON-LD, internal links/fragments, App Store destinations, and sitemap coverage. |
| `npm run test:quiz` | All 4,096 answer combinations, all 13 possible totals, 0/5/6/10/11/12 boundaries, all six/four-choice data, deterministic reactions, personalized recommendations, severity ordering, independent safety findings, Back/edit/recalculation, restart, invalid/repeated/stale transitions, canonical share text, and light/dark text/control contrast thresholds pass. |
| `scripts/home-health-check-qa.mjs` | 29 completed rendered journeys with no errors; six viewports, all 24 choices, keyboard focus/Next, Back/corrections/results review, restart, stale/repeated actions, real double-click, high-total safety alert, clipboard success/rejection/unavailable, native share success/cancellation/rejection, dark mode, reduced motion, no-JavaScript guidance, and memory-only/local-network behavior. |
| Existing `scripts/browser-qa.mjs` | All 176 route/viewport checks pass: 44 routes at 1440×1000, 390×844, 834×1194, 320×740. Existing menu, keyboard skip, checklist persistence/reset/print/CSV, support validation/success, campaign anchor/canonical, official badges, carousel selection, and genuine-screen disclosure checks pass. |
| `git diff --check` | Passes. |

Results: [Quiz browser QA](design/phase3/quiz-qa.json), [44-route regression QA](design/phase3/regression/browser-qa.json). The quiz network sample contained 264 requests, all on the preview origin, without external font/frame/analytics requests.

Repeat the pure tests with `npm run test:quiz`. The test scripts transpile the actual TypeScript data using the already-installed Astro/esbuild toolchain, supporting the repository's Node 20+ environment without a new dependency. For browser checks, build, start `npm run preview`, and supply `PLAYWRIGHT_MODULE` pointing to the existing bundled Playwright module:

```sh
PLAYWRIGHT_MODULE=/absolute/path/to/playwright/index.mjs node scripts/home-health-check-qa.mjs
QA_OUTPUT=../docs/design/phase3/regression/ PLAYWRIGHT_MODULE=/absolute/path/to/playwright/index.mjs node scripts/browser-qa.mjs
```

The quiz bundle measured about 6.1KB gzip in the build output. No frontend framework, backend, account, email collection, or paid dependency was added.

## Visual review performed

Actually rendered and inspected the quiz at 320×740, 390×844, 430×932, 768×1024, 1024×768, and 1440×1000. Reviewed initial question and answered feedback at every size, representative green/yellow/red results, dark results, copy fallback, no-JavaScript guidance, and corrected homepage teaser at 320/390/834/1440px.

- 320px: long model-aware answers wrap inside full-width cards. Tone labels move below answers; navigation buttons wrap cleanly. No horizontal overflow or overlapping quiz content.
- 390/430px: headline, question, choices, rules, and source links stay readable. CTA/share/retake controls fit without clipped text. Results remain one vertical column, as in the original.
- 768/1024/1440px: centered original-width column, right-aligned answer tone labels, and wrapping action/share rows preserve the reference hierarchy. Tablet portrait and landscape were both checked.
- Green results retain the reassuring original description and all six rules. Yellow/red results include practical tips and the separate safety notice. The conversion and free-checklist options remain visible without gating results.
- The corrected homepage teaser retains its approved two-column desktop and CTA-first mobile layout. Longer sealed-battery wording increases the sample-card height but fits cleanly.

Evidence: `docs/design/phase3/question-{width}.png`, `{width}-red-feedback-q{1,4,5,6}.png`, `results-{width}-{green,yellow,red}.png`, `review-quiz-{width}.jpg`, and `review-results-{green,yellow,red}.jpg`.

Representative previews: [390px question](design/phase3/question-390.png), [desktop green results](design/phase3/results-1440-green.png), [desktop yellow results](design/phase3/results-1440-yellow.png), [desktop red results](design/phase3/results-1440-red.png), [clipboard fallback](design/phase3/clipboard-fallback.png), [no JavaScript](design/phase3/no-javascript.png), [dark results](design/phase3/results-dark.png), [updated teaser](design/phase3/homepage-teaser-390.png).

Visual capture styles suppress an unfocused offscreen skip link to avoid the known Chromium tall-element screenshot artifact. Actual keyboard skip behavior is tested on the page separately.

## Limitations and remaining release work

No visual clipping or unresolved functional failure was found in the reviewed quiz layouts. Long corrected feedback and six detailed recommendations require vertical scrolling on phones; this preserves the original readable single-column experience.

Testing used installed headless Chrome with emulated viewports. Clipboard and native sharing outcomes were injected into browser APIs to test success/failure paths; actual iOS share sheets, device clipboards, VoiceOver/NVDA, Safari/Firefox, physical phones/tablets, production HTTPS performance, and purchase availability were not certified. Font/image/network performance figures are build/local evidence, not field metrics.

The Phase 2 image-resolution/hardware/licensing limitations remain documented in its report. Live pricing/trial/Professional configuration still needs verification before broader pricing changes or release. Existing pricing pages were outside this phase. Complete the separate release review and obtain deployment authorization; this work was not deployed.

## Files added and changed

Added:

- `src/pages/home-health-check.astro`
- `src/components/HomeHealthCheck.astro`
- `src/data/homeHealthCheck.ts`
- `src/scripts/home-health-check.ts`
- `src/styles/home-health-check.css`
- Three WOFF2 files, license notices, and provenance README under `public/assets/fonts/`
- `scripts/home-health-check-test.mjs`, `scripts/home-health-check-qa.mjs`
- `docs/design/phase3/*` evidence and this report

Changed: `src/components/HomeHealthCheckTeaser.astro`, `src/components/Footer.astro`, `src/pages/resources/index.astro`, `src/data/site.ts`, and the `test:quiz` command in `package.json`. Restored `scripts/validate-site.mjs` to its original strict behavior by removing the Phase 2 exception. Existing Phase 2 edits and user reference materials were preserved without staging/discarding unrelated work. No package dependencies or lockfile changed.

## Appendix: original versus corrected wording

Full exact question/choice/rule/why/tip text is recorded in [wording-changes.json](design/phase3/wording-changes.json). This short appendix records the substantive corrections and their sources.

| Area | Original wording/assumption | Production correction |
| --- | --- | --- |
| Smoke alarms | “When did you last change your smoke alarm batteries?” Two recent-battery answers earned 2 points; no testing question. Annual batteries/10-year rule and a broad fire-death statistic. | “When did you last test your smoke alarms?” Recent testing explicitly includes sealed-battery alarms (2), overdue testing (1), uncertainty/removal (0). Monthly testing, manufacturer-directed battery care, generally 10-year whole-alarm replacement, and prompt restoration for disconnected alarms. The statistic was omitted. [USFA smoke alarms](https://www.usfa.fema.gov/prevention/home-fires/prepare-for-fire/smoke-alarms/). |
| Furnace filter | “When did you last change your furnace filter?” “At least every 90 days”; universal recent-change scoring and 5–15% energy claim. | “How are you keeping up with your furnace filter?” Green means checking/following that system's schedule. Monthly inspection plus equipment/filter instructions; qualitative airflow wording; save size/instructions. Percentage claim removed. [ENERGY STAR checklist](https://www.energystar.gov/saveathome/heating-cooling/maintenance-checklist). |
| Dryer vent | “This year”; universal annual cleaning and “the vent is likely clogged” when drying slows. | Question unchanged; green choice adds following instructions. A yearly planning cue is qualified by manual and airflow/conditions; lint screen each load. Longer drying has multiple possible causes. Fire statement now specifies reported U.S. home dryer fires in 2018–2020. [USFA appliance fire safety](https://www.usfa.fema.gov/prevention/home-fires/prevent-fires/appliance-and-electrical/). |
| Dishwasher | “Have you ever cleaned your dishwasher filter?” Recent cleaning was always green; monthly/two-month universal interval and “Twist it out” tip. | “How are you keeping up with your dishwasher filter?” Following the manual, including self-cleaning arrangements, earns green. Cleaning/removal/reinstallation depends on the model. The “Spoiler” voice is retained for neglected removable filters. [Whirlpool filter care](https://producthelp.whirlpool.com/Dishwashers/Product_Info/Dishwasher_Cleaning_and_Care/How_to_Clean_the_Dishwasher_Filters). |
| Water heater | “Most last 10 to 15 years”; replace before a basement flood; label date treated as age evidence. | Question/choices unchanged. Separate storage (often 10–15 years) and tankless (can exceed 20); age is planning information, not a guaranteed deadline or leak prediction. Verify installation/manufacture records and serial-date evidence. [DOE Energy Saver guide, water heating](https://www.energy.gov/sites/default/files/2022-08/energy-saver-guide-2022.pdf#page=23). |
| Contractor | “33% of homeowners say finding a reliable contractor is stressful.” | Question, choices, rule, and tip unchanged. Unsupported/broadened statistic replaced by “A good contractor is worth remembering” and the original invoice-disappearing personality. No new statistical claim. |
| Conversion/share | “Try it free for two weeks”; Claude artifact URL; fallback selected only the URL. | Official neutral download badge, free checklist for everyone, canonical production quiz URL, full score/category/link fallback, optional native sharing. |

Choice tone pattern is now green/yellow/red/red for each question. Q1's old second green was tied to recent battery replacement; it is now a genuinely overdue testing answer worth 1 point. All original score values, maximum, and category thresholds remain unchanged, with expected combination outcomes updated for the approved correction. Original category descriptions and reaction pools were retained verbatim.

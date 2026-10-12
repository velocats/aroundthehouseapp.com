# Around The House website redesign: Phase 2 report

Implemented 2026-10-11 on `codex/website-marketing-redesign`. Phase 2 only. No push, merge, deployment, or Phase 3 quiz implementation occurred.

## Result and scope

The homepage now follows the supplied photography-led marketing prototype: the approved headline and supporting copy, three homeowner scenes, official App Store download badges, scene captions, a prominent Home Health Check teaser, a restrained `#how-it-works` section, useful existing article links, and a closing download invitation.

The existing Astro/GitHub Pages architecture, shared header/footer, icon assets, App Store destination, metadata infrastructure, resource content, support/legal pages, and all 43 existing URLs remain. Homepage CSS is scoped to the new components. No dependencies were added to the website.

The homepage's obsolete price/trial copy and structured-data Offers were removed. No annual or Professional purchase offer was published. Other pages and `src/data/site.ts` retain their existing pricing; verifying the live purchase configuration and aligning those pages remains a later release task. The shared header/footer were preserved without edits.

## Source inspection and exact scene mappings

The Phase 1 plan was read in full before implementation, repository instructions were checked, and the design-reference directory and ZIP contents were inspected. The nested `ath-hero.zip` supplied the HTML prototype; its fabricated HTML app screens were not used. The larger 1680×944 versions of the same three photographs in the outer archive were used for asset generation.

All photography comes from `docs/design-reference/website images-20261011T222919Z-1-001.zip`:

| Scene | Exact archive entry | Exact approved capture |
| --- | --- | --- |
| Filter shopping | `website images/airfilter.jpeg` | `docs/design-reference/iphone-screenshots/furnace-filter.png` |
| Smoke alarm | `website images/AaEs3BYGNuYswCyvfw5kYg-AaEs3BYG5DelzTn1_CtDmQ.jpg` | `docs/design-reference/iphone-screenshots/smoke-alarm.png` |
| Water heater | `website images/AaEssReI4e7mQ2pZx2mxHQ-AaEssReIEWjDJzknMPkx5Q.jpg` | `docs/design-reference/iphone-screenshots/water-heater.png` |

The three approved captures are 1320×2868. They were used as supplied, without inventing fields, erasing controls, replacing content, or altering example records. The screenshots need not show every detail mentioned by their captions, as explicitly approved in the brief.

## Compositing and responsive assets

`scripts/create-home-story-assets.py` reproduces all assets directly from the original archive and screenshots, using the available Pillow and NumPy libraries. It proportionally contains each complete capture in an oversampled display plane, using minimal edge padding where phone/capture proportions differ. An inverse projective transform maps that plane to measured display corners. Rounded alpha masks keep the original photographed bezel, hand, and surrounding scene; the water-heater photograph's physical camera notch is explicitly preserved. Individual interface elements were never independently moved, stretched, or recreated.

Desktop composites preserve the complete photographic frame. Mobile crops select a 755×944 region of each finalized composite, keeping both the contextual object and held phone. No runtime screenshot overlays, perspective CSS, prototype scripts, remote fonts, or fabricated UI are included.

There are 39 final assets in `public/assets/home-story/`: AVIF and WebP at desktop widths 768/1200/1680 and mobile widths 480/755, desktop/mobile JPEG fallbacks, and three proportional 660×1434 WebP copies of the complete captures for the optional disclosure. The first scene is eager/high priority; later scenes and supplemental screenshots are deferred. The source images are not upscaled during asset generation.

Full-resolution lossless proofs were rendered and inspected individually:

- [Filter composite](design/phase2/composites/filter-master.png)
- [Smoke alarm composite](design/phase2/composites/smoke-master.png)
- [Water heater composite](design/phase2/composites/heater-master.png)
- [Source hashes, dimensions, aperture coordinates, crop bounds, and output sizes](design/phase2/composites/asset-manifest.json)

The headline, supporting paragraph, reminder line, filter caption, smoke caption, quiz headline, and quiz invitation retain the supplied copy. The water-heater answer changes “One tap” to “Keep its details close” to avoid an unverified tap-count promise. Georgia and system sans-serif fonts provide the serif/sans character without external font requests; they differ from the prototype's Newsreader/Instrument Sans.

## Responsive visual review

Rendered Chromium screenshots were actually inspected, including all three scenes at each width and the complete homepage. Contact sheets were used for side-by-side review, with individual full-resolution composites and detail screenshots also inspected. Review was not limited to overflow checks.

| Viewport | Review finding | Full-page capture |
| --- | --- | --- |
| 320×740 | Headline/badge precede the photo; one-column teaser answers fit. Small text inside the photographed UI needs the optional full-screen disclosure. | [Preview](design/phase2/home-320.png) |
| 375×812 | Complete phone and homeowner context remain visible; headline/caption wrapping is clean. | [Preview](design/phase2/home-375.png) |
| 390×844 | Mobile crop balances phone, hand, and context; quiz CTA appears before the preview card. | [Preview](design/phase2/home-390.png) |
| 430×932 | Wider mobile copy and captions fit without collisions. | [Preview](design/phase2/home-430.png) |
| 768×1024 | Tablet portrait stacks the copy above the wide photo; quiz uses two columns. | [Preview](design/phase2/home-768.png) |
| 834×1194 | Tablet portrait retains the full environment and a clear teaser card. | [Preview](design/phase2/home-834.png) |
| 1024×768 | Tablet landscape uses the over-photo layout. Corrected a minimum-height/aspect-ratio grid overflow; final layout fits. | [Preview](design/phase2/home-1024.png) |
| 1280×900 | Desktop copy is separated from the phone by the cream scrim; captions and quiz fit. | [Preview](design/phase2/home-1280.png) |
| 1440×1000 | Desktop headline, held phone, and quiz form a clear hierarchy; supporting sections stay restrained. | [Preview](design/phase2/home-1440.png) |
| 1920×1080 | Hero is capped at 1680px to limit enlargement; content and navigation remain centered. | [Preview](design/phase2/home-1920.png) |
| 1194×834 | Additional tablet landscape review; both the photo and editorial supporting sections fit. | [Preview](design/phase2/home-1194.png) |

Scene-by-scene captures follow `docs/design/phase2/hero-{width}-scene-{1,2,3}.png`. Review sheets follow `review-scenes-{width}.jpg`; complete-page overview sheets are `review-mobile.jpg`, `review-tablet.jpg`, and `review-desktop.jpg`. The photo begins around 501–544px from the top on the narrow/mobile viewports, within the tested first screen. At 768/834px it follows the introductory copy; wider layouts show copy and photography together.

The 1024px overflow found during QA was corrected by explicitly constraining the photo grid item's width and minimum width. No caption/control overlap or horizontal page scrolling remained in the final review.

## Carousel and accessibility

The controller uses a six-second interval and approximately 0.9-second CSS fade. The incoming image is decoded before switching. Mouse hover, keyboard focus within the hero, and a hidden document pause rotation. Manual selection stops rotation until explicit play. Play resumes when focus/hover leave. Opening the genuine capture also pauses rotation.

Reduced motion disables autoplay and fades, including when the preference changes while the page is open. Manual scene buttons remain usable. Scene buttons and the play control have accessible names and 44×44px targets. Only the active scene is exposed through `aria-hidden`; only its caption and disclosure are shown. Manual actions announce status politely; automatic rotation does not repeatedly interrupt assistive technology. Existing skip navigation, landmarks, mobile menu, and visible focus styles remain.

The no-JavaScript page shows the first genuine composite, caption, downloadable app link, working native screenshot disclosure, and explanatory text for the other situations. Dead carousel controls stay hidden. Quiz answer previews are static text, with an explicit preview note; they do not pretend to select or save answers.

- [No-JavaScript preview](design/phase2/no-javascript.png)
- [Expanded genuine screenshot preview](design/phase2/supplemental-capture.png)

Visual capture styles hide an unfocused, offscreen skip link solely to avoid Chromium's tall-element screenshot artifact. The actual page's skip link was tested independently as the first keyboard stop and successfully focused main content.

## Automated validation and build results

1. `npm run check`: Astro builds all 43 pages and generates the 43-route sitemap. Default validation fails with exactly one expected dependency: `/: broken internal link /home-health-check/`. The quiz is intentionally reserved for Phase 3. Default CI/release validation remains strict.
2. `ALLOW_PENDING_PHASE3_QUIZ=1 npm run check`: passes all remaining validation, with an explicit DEVELOPMENT ONLY warning. This narrowly scoped local opt-in exempts only the exact homepage quiz link, and must not be used for deployment.
3. `scripts/home-story-qa.mjs`: passes at all 11 listed viewports, with no errors. Checks all three scene images, mobile/desktop source selection, active scene/caption accessibility, touch targets, reduced motion, quiz destination, lack of fake answer controls, official badges, absence of obsolete pricing/trial claims and prototype UI, and local-only homepage requests. Twelve interaction checks cover timer rotation, wrap, hover, focus, keyboard/manual selection, explicit pause/play, simulated hidden-document behavior, live motion preference changes, real capture disclosure, skip navigation, and no-JavaScript fallback. [Machine-readable results](design/phase2/home-story-qa.json).
4. Updated `scripts/browser-qa.mjs`: passes all 172 route/viewport checks with no errors. Route regression results are recorded in [browser QA](design/phase2/regression/browser-qa.json). It covers 43 routes at 1440×1000, 390×844, 834×1194, and 320×740, plus existing menu, checklist, support, campaign-anchor, and canonical checks. Homepage selectors now target the carousel and teaser instead of removed feature/FAQ sections. Closed disclosure images are checked when opened rather than mistaken for failed visible images.
5. `git diff --check`: passes.

The browser uses the existing bundled Playwright runtime with installed Chrome; no browser-testing package was added to the project. To repeat local browser QA after building, start `npm run preview`, then supply `PLAYWRIGHT_MODULE` pointing to the available Playwright `index.mjs`. Set `QA_OUTPUT=../docs/design/phase2/regression/` for the route script.

Browser testing was Chromium only, with CSS viewport emulation, not physical phones/tablets. Hidden-tab behavior was exercised with a simulated visibility event. No VoiceOver/NVDA session, Safari/Firefox matrix, real App Store purchase, form submission, print hardware, or production network performance measurement was performed.

## Remaining limitations and next-phase dependencies

- **Release blocker:** `/home-health-check/` does not exist. Do not deploy until the real Phase 3 quiz destination works and default `npm run check` passes. No quiz page, scoring, persistence, or results were implemented in Phase 2.
- The supplied heater photo uses older notched hardware, while the genuine capture includes a Dynamic Island. The original physical notch occludes part of that camera area, with a small dark lip at its lower edge. This is the best truthful integration without erasing or reconstructing screenshot elements; the unmasked supplemental capture remains available. The source bezel geometry and raster edge softness limit perfect hardware matching in the other scenes as well.
- At narrow widths, photographed screen text cannot all be read comfortably. The same complete genuine capture is available in the native disclosure. No missing specifications were invented to make the marketing wording match the screenshot.
- Photograph resolution is 1680×944 and original JPEG softness remains. Retina displays can reveal those limits; the hero is capped rather than claiming higher-resolution source material.
- Photography licensing and provenance have not been independently verified. The user approved these inputs for this work; retain and confirm licensing documentation before publication.
- Verify live purchase configuration before aligning existing pricing pages or publishing planned annual/Professional offers. This phase does not validate future entitlements or trials.
- Phase 3 must apply the plan's quiz accuracy and safety corrections, including sealed smoke-alarm batteries, before publishing the quiz. The teaser preserves the requested prototype question without providing maintenance advice or results.

## Files created or modified

Created: `src/components/HomeStoryHero.astro`, `src/components/HomeHealthCheckTeaser.astro`, `src/scripts/home-story-hero.ts`, `src/styles/home-story.css`, `scripts/create-home-story-assets.py`, `scripts/home-story-qa.mjs`, `public/assets/home-story/*`, `docs/design/phase2/*`, and this report.

Modified: `src/pages/index.astro`, `scripts/browser-qa.mjs`, `scripts/validate-site.mjs`.

Preserved existing untracked user materials: `docs/WEBSITE_REDESIGN_PLAN.md` and `docs/design-reference/*`. No unrelated changes were discarded. Build output remains in the existing ignored `dist/` directory.

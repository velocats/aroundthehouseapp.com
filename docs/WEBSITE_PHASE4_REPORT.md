# Around The House: Phase 4 release review

Reviewed October 11, 2026 on `codex/website-marketing-redesign`. No deployment, merge, push, or commit. Existing user materials and work from earlier phases remain intact.

## Release decision

**Implementation is ready for release review, with publication conditional on confirming the supplied photographs’ usage rights.** No known code blocker remains in the tested Chromium environment. The approved source photography still limits resolution and hardware matching. Safari, physical Apple devices, native browser zoom, OS text-size settings, and VoiceOver/NVDA were not tested; this report does not certify those environments or complete accessibility compliance.

Current purchase products and entitlements remain unverified. The site now uses neutral download and purchase wording, so publication does not require advertising the planned annual/Professional offerings. Verify live configuration before adding any price, trial, free allowance, renewal promise, or paid feature gate.

## Findings corrected

| Finding | Final change |
| --- | --- |
| Filter caption claimed dimensions absent from the capture | “Can’t remember when you changed the furnace filter? It’s right on your phone.” Scene selection name now describes furnace maintenance. Genuine screenshot unchanged. |
| Old monthly/lifetime prices and purchase promises remained elsewhere | Replaced pricing cards with current-options guidance; removed the stale price registry, comparison-table price amounts, free-item allowances, and unverified tier assignments from shared CTAs, affected landing copy, metadata, and resource blurbs. Functional feature descriptions remain. No replacement offer was invented. |
| Quiz keyboard focus landed below the viewport | After selection, focus now moves to the visible, named feedback region. Tab reaches its source and navigation controls. Question transitions and result transitions still focus their headings. Scrolling is immediate, including reduced motion. |
| Results went straight from warnings into a long list | Added “Your next small wins” and a one-task invitation; a perfect score receives “Keep the streak going.” Original categories, reactions, six questions, thresholds, and personalized recommendation ordering remain. |
| Two horizontally scrolling comparisons lacked keyboard access | Both wrappers are named, focusable regions with visible focus outlines; ArrowRight scrolling was exercised. |
| Several labels were on generic unnamed-role containers | Added appropriate group roles to the carousel, controls, and teaser answer preview; feedback is a region. |
| Footer home link lost its name when narrow CSS hid text | Added a persistent accessible name. Detected during the 400% reflow audit. |
| Neutral pricing page inherited empty space from removed cards | Removed obsolete bottom padding and spaced its two explanatory paragraphs. |
| Asset validation covered fallback images only | Extended default validation to all responsive image candidates, local scripts/styles/icons, and CSS font/image URLs. |

## Creative and visual review

Read the Phase 1 plan and Phase 2/3 reports, inspected the original homepage HTML/README and quiz implementation inside the supplied archives, and checked applicable repository context. No additional AGENTS.md or CLAUDE.md instructions were found.

Fresh browser renders were inspected, including each scene at every required width, complete homepage contact sheets, quiz question/result contact sheets, individual feedback/results, zoom-equivalent reflow, pricing, and enlarged phone details. Screenshots are under [Phase 4 evidence](design/phase4/), separate from previous phase captures.

The headline is unchanged: **“Your home has a lot of moving parts. Keep them at your fingertips.”** The cream/forest/mint/clay direction, approved photos and genuine captures, strong serif hierarchy, official badge, forest quiz transition, three concise supporting steps, useful links, and modest closing invitation remain. The carousel adds recognizable situations; manual selection stays paused, and reduced motion disables rotation. There was no reason to redesign these elements.

The photo begins at roughly 501–544px on narrow mobile screens, following the headline, explanation, and download badge. It begins at 476–500px on stacked tablets, and at 83px in over-photo layouts. No caption/control collision or horizontal page overflow remained. Body text and touch targets stay readable; full app text inside the photograph is intentionally available through “See the app screen,” because photographic phone text is small at mobile sizes.

| Viewport | Reviewed behavior |
| --- | --- |
| 320×740 | Five-line headline; complete held phones; wrapped caption and single-column quiz; narrow footer and long results fit. |
| 375×812, 390×844 | Photography remains in the initial screen; caption, teaser, feedback and sharing wrap cleanly. |
| 430×932 | Shorter headline; complete photo/hand context; no control collision. |
| 768×1024, 834×1194 | Portrait stacks copy/photo; two-column teaser; centered quiz. |
| 900×1200 | Stacked hero remains balanced near the breakpoint. |
| 980×768, 1024×768 | Over-photo hero; screen stays clear of headline; navigation changes at its existing breakpoint. |
| 1280×900, 1440×1000 | Balanced editorial copy and recognizable app record; restrained supporting sections. |
| 1920×1080 | Hero remains capped at 1680px; quiz remains a readable 620px column. |
| 1194×834 | Additional tablet landscape carousel review. |

Live quiz resizing through tablet portrait/landscape, phone portrait/landscape, desktop and narrow widths retained the mixed score and avoided overflow. Results remain substantial: the entire quiz column, including introduction, recommendations, conversion, sharing and privacy notes, is about 4,000px at 320px and 2,888px at wider sizes. Its length comes from six useful, answer-specific results rather than empty spacing. Guidance stays visible for visitors without Apple devices, with a free checklist destination and no email gate.

## Composite review and remaining source limits

All three source capture hashes still match the Phase 2 provenance manifest. No screenshot content, camera area, fields, or photographed hardware was fabricated or replaced.

- **Filter:** screen corners follow the display aperture, the bezel/hand remain intact, and replacement task/history are recognizable. The revised caption matches this content.
- **Smoke:** slight photographed perspective and rounded display corners fit; the alarm and held phone survive the mobile crop. Maintenance task/history remain genuine.
- **Heater:** alignment, hand occlusion and crop are sound. The photographed older notch partially overlaps the genuine capture’s Dynamic Island, leaving a small dark lip. Eliminating it would require altering screenshot camera content or photographed hardware; retain this documented source limitation. The full original capture remains available in the disclosure.

The 1680×944 photographs retain JPEG softness, particularly when enlarged. No claim of higher-resolution masters is made. Usage-rights documentation was not supplied or independently established. Enlarged review details: [filter](design/phase4/filter-screen-review.png), [smoke](design/phase4/smoke-screen-review.png), [heater](design/phase4/heater-screen-review.png).

## Quiz, guidance, accessibility and privacy

A realistic mixed journey (green/yellow/red/green/red/yellow) gives **6/12, Mostly on it**, with two answers in each tone. Red items lead, and dryer safety attention appears independently of the total. Back/change/review recalculates the result; restart clears answers. Clipboard and native sharing success, rejection, unavailability and cancellation preserve usable results. Failure exposes manually copyable text. Only score/category/quiz URL are shared.

Safety wording was rechecked against primary sources: [USFA smoke-alarm care](https://www.usfa.fema.gov/prevention/home-fires/prepare-for-fire/smoke-alarms/), [ENERGY STAR filter maintenance](https://www.energystar.gov/saveathome/heating-cooling/maintenance-checklist), [USFA dryer ignition findings](https://www.usfa.fema.gov/prevention/home-fires/prevent-fires/appliance-and-electrical/), [Whirlpool filter-type and cleaning guidance](https://producthelp.whirlpool.com/Dishwashers/Product_Info/Dishwasher_Cleaning_and_Care/How_to_Clean_the_Dishwasher_Filters), and [DOE water-heater service-life context, PDF page 23](https://www.energy.gov/sites/default/files/2022-08/energy-saver-guide-2022.pdf#page=23). Model instructions remain the controlling guidance; a score never certifies safety. No question, choice, point assignment, or threshold was changed in Phase 4.

Keyboard review exercised skip navigation, all six answer/feedback transitions, sources, Next, result focus, comparisons and mobile menu Escape. Hidden scenes contain no focusable controls. Live feedback uses a polite status region. Reduced-motion timer/CSS changes, persistent manual pause, hover/focus pause and simulated document visibility were exercised. Actual screen-reader announcements were not heard or certified.

Axe-core 4.14.0: **64 audits, zero reported violations**, covering all 44 routes, carousel scenes, six feedback states, light/dark results, desktop comparisons, and 200/400% zoom-equivalent reflow. Incomplete checks remain explicitly recorded: clipped table cells were additionally checked at desktop width; pricing gradient colors pass against both endpoints; the decorative teaser arrow has no meaningful text. This is not a claim that axe proves accessibility. 640/320 CSS-pixel contexts emulate reflow at 200/400% from a 1280px viewport; native browser zoom and OS Dynamic Type remain untested.

Homepage and quiz requests remain on the local site origin. Quiz answers have no persistence or analytics. Existing checklist localStorage and explicit support-form processing retain their prior behavior. No runtime dependency or tracking service was added; axe was unpacked temporarily outside the repository for QA only.

## Final verification and repeatability

- `npm run check`: passes; 44 routes, sitemap, metadata uniqueness, canonicals, social titles, JSON-LD, landmarks, links/fragments, official App Store IDs and local assets.
- `npm run test:quiz`: passes all 4,096 combinations, score/category boundaries, independent safety prioritization, answer edits, stale/repeated actions, restart/share text and light/dark contrast.
- `scripts/browser-qa.mjs`: passes **176 route/viewport checks**, including menu, checklist save/reset/print/CSV, support validation without submission, campaign fragments, badges and disclosure. [Report](design/phase4/regression/browser-qa.json).
- `scripts/home-story-qa.mjs`: passes **13 viewports and 12 interaction checks**. [Report](design/phase4/home-story-qa.json).
- `scripts/home-health-check-qa.mjs`: passes **59 complete journeys at all 12 requested widths**, including every choice and sharing fallback. [Report](design/phase4/quiz/quiz-qa.json).
- `scripts/release-review-qa.mjs`: passes **64 axe audits plus keyboard, orientation, reflow, fonts, headings and visible purchase-copy checks**. [Report](design/phase4/release-review-qa.json).
- All 43 HEAD routes remain, plus the quiz. Existing article bodies are unchanged. Built scripts contain no Claude frame runtime or analytics integration. `git diff --check` passes.

Build first, then start `npm run preview -- --host 127.0.0.1`. Use `PLAYWRIGHT_MODULE` for the available Playwright runtime. Homepage/quiz/browser scripts accept `QA_OUTPUT` relative to `scripts/`; use the Phase 4 destinations above to avoid overwriting earlier evidence. Release review also requires `AXE_SCRIPT` pointing to a local `axe-core@4.14.0` `axe.min.js`. Do not rebuild while browser QA is in flight, as replacing hashed scripts can interrupt navigation.

Testing used installed Chrome via Playwright, viewport emulation and controlled share mocks. No real purchase, support submission, physical printing, production network benchmark, Safari/Firefox session, physical-device test, or assistive-technology session occurred. The owned preview server was stopped after review. Default release validation remains strict; no exception or bypass was introduced.

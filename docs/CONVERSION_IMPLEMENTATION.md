# Conversion optimization implementation

Implemented the approved website scope, ranks 1–7 in `CONVERSION_OPTIMIZATION_PROPOSAL.md`. No deployment, app changes, new dependencies, analytics installation, subscription changes, or price changes.

## Changes

- Following the October 11 preference update, all download actions use Apple’s official, unaltered **Download on the App Store** badge. The shared component supports a smaller navigation size; its image alt text names the action. Free-entry information remains in surrounding copy.
- Desktop and mobile headers expose the official badge as a direct download action. Mobile download remains outside the menu; at 320 pixels the brand shows its icon while retaining the full accessible name.
- Hero retains the primary value proposition, clarifies the practical benefit, shows free/platform information and example-home exploration, and retains **See How It Works**.
- Existing feature introduction now contains the four homeowner questions and the concrete Photos/email/text comparison. The existing Capture / Find / Remember narrative remains intact.
- Existing demo section uses the requested headline and an authentic Demo Mode screenshot. Caption and supporting copy distinguish sample records from owned items and clarify Pro documents/reports.
- Pricing explains five owned items across the app, Free details/history/basic recurrence, and all documented Pro capabilities. Monthly/lifetime prices remain centralized and unchanged. FAQ and visible pricing agree; monthly renewal and lifetime terms are explicit.
- Documents and reports receive contextual Pro labels in the homepage and affected campaign pages. Warranty copy refers to entered dates; handoff/insurance summaries clarify their limits.
- Trust copy describes offline core use, same-Apple-Account sync, and controlled Pro export/backup files. The comparison no longer promises property invitations. Privacy separately describes website hosting and the existing FormSubmit support processor.
- Existing campaign URLs retained; insurance campaign targets `/home-inventory-app/#insurance-records`. Titles, descriptions, and central page summaries were updated together.
- Muted text was darkened slightly within the same palette to meet normal-text contrast on the hero gradient and demo background. No typography or overall design replacement.

## Campaign preparation

`CAMPAIGN_REGISTER.csv` contains six draft creative/destination examples covering the five campaign themes. Source/channel choices are examples, not launched campaigns. Empty measurement fields mean unavailable, not zero. No spend or results are fabricated.

Generate actual campaign links in App Store Connect and enter the provider/campaign-token links into the register. The provider token cannot be invented. Existing website download actions remain direct links to app ID `6789646793`; incoming UTM parameters alone do not count visits or attribute those downloads to an Apple campaign. Wiring valid campaign links is the next configuration step once they exist.

Use App Store Connect for available first-time downloads and download-to-paid cohorts. Website visits/clicks and custom demo/first-item events remain unmeasured; collecting them needs separately reviewed infrastructure or app instrumentation. No browser-local counters were presented as analytics.

## Validation

- `npm run check`: build and static validation pass for all 43 existing routes; sitemap, canonicals, unique metadata, landmarks, images, structured data, internal links/fragments, and App Store destinations verified.
- `scripts/browser-qa.mjs`: production-preview browser checks at 1440×1000, 834×1194, 390×844, and 320×740. Report and screenshots are in `docs/design/conversion/`. The report records the final pass and any errors.
- Additional conversion checks: visible header/hero downloads, minimum 44-pixel header badge targets, direct destination, four questions, insurance campaign anchor, and canonical without campaign parameters.
- Existing interaction checks retained: keyboard skip link, menu anchor navigation and Escape, FAQ, checklist persistence/progress/reset/print/CSV, and required-field/support success states without submitting support data.
- Palette checks: Apple badge artwork is preserved unchanged. Final muted text is at least 4.5:1 on the reviewed hero/demo backgrounds. Large hero accent text is 3.86:1 against the darkest gradient endpoint, exceeding the 3:1 large-text requirement. This is a focused contrast review, not a full accessibility certification.
- October 11 badge update: all 185 generated App Store download links were checked to contain the official `/assets/app-store-badge.svg` image.
- App Store destination was opened and confirmed to resolve to the correct current listing. All site CTA instances share that app ID. No purchases were made.

## Release and business limits

Feature guide and entitlement/source configuration were reviewed. The public listing and source both identify version 2026.09.18, but the app repository includes local edits; identical version strings do not prove every edit shipped. Production app/device entitlement QA, Safari/physical-device browser QA, and private App Store Connect configuration inspection were not performed.

The 14-day sample-data duration remains unadvertised pending released-app activation/expiry/exit verification. Household sharing remains unadvertised pending separate-account release QA. The future November 1 lifetime price schedule remains unconfirmed; no countdown or future price was added. Confirm these with the release/business owner before publishing such claims.

The authentic demo capture predates the current app release. Its explicit example-home banner and records match the documented demo concept; this work does not certify pixel-for-pixel parity with the current release UI.

The GitHub Pages workflow publishes when pushed to `main`. Changes remain local for review; no push or publication was performed.

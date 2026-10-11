# Proposed app improvements

Website direction translated into an app backlog. No iOS, iPadOS, or Mac app files were changed for this website update.

Source: `Around_The_House_Product_Website_Direction.docx`, read from `/Users/ecross/Downloads/` on October 10, 2026. Current product evidence: [official App Store description and version history](https://apps.apple.com/us/app/around-the-house-home-tracker/id6789646793).

## Already available

The App Store version history describes Demo Mode with example information, Global Search, Home Essentials, improved demo exit behavior, and reminder notification diagnostics. The description confirms service-provider records, projects, recurring maintenance, private iCloud sync, property invitations, and Apple Calendar sync. These features should be reviewed and extended rather than assumed absent.

## Verify first: example-home lifecycle

The strategy describes a 14-day preloaded home with items, photos, documents, manuals, history, and tasks. The public version history confirms an example home but does not establish its duration, purchase restrictions, contents, or migration rules. Website copy advertises exploring an example home without a duration claim.

Before changing onboarding, confirm the shipping implementation and add acceptance criteria for:

- Demo start, restart, expiration, and exit, including offline use and changed system time.
- Clear distinction between example information and the homeowner's real records.
- Saving real information during the demo without risking its deletion when example data is removed.
- Whether the same demo state should synchronize between devices.
- Availability of document attachment and export actions during Demo Mode and the free tier.

## P1: first real record from the example home

Desired sequence: explore the example home, save one real thing, save several useful records, receive a relevant maintenance reminder, then decide whether to unlock Pro.

Add contextual actions only after verifying they are absent:

- On the demo furnace: “Make this yours → Add your furnace.”
- On the demo paint record: “Know your paint color? → Save yours.”

Offer the relevant template and property/area choices without copying example identifying details into a real record. Keep progress intact when returning to the example home. Make the example-data label and exit behavior clear to VoiceOver users.

Success criteria: a homeowner can save one real record without documenting the entire property; leaving Demo Mode preserves their record and attached evidence.

## P2: optional demo encouragement

Test approximately four or five useful notifications across the demo period. The strategy's five candidate messages are:

| Day | Candidate action |
| --- | --- |
| 2 | Save one paint color you never want to hunt down again. |
| 4 | Next time you're near your furnace, snap a photo of your air filter so you'll always know the size. |
| 7 | Had something repaired recently? Save the receipt, photo, or contractor before you forget. |
| 10 | Add one maintenance task and let Around The House remember when it's due. |
| 13 | Start adding your real home before Demo Mode ends. |

Gate this sequence on a verified 14-day lifecycle. Obtain notification permission in context, allow these prompts to be disabled independently of maintenance reminders, suppress prompts for actions already completed, and cancel pending encouragement after demo exit or expiration. Avoid duplicate messages across devices and conflicting alerts. Deep-link to the relevant entry form only when doing so is safe.

These are proposed engagement messages, not existing maintenance alerts. They are not advertised as current website features.

## P3: low-frequency check-in

Test an optional monthly prompt: “Anything new around the house? Save a repair, receipt, paint color, purchase, or project before you forget.”

Let homeowners control or disable it. Skip it after recent record creation, respect system notification preferences, and ensure it supplements rather than displaces maintenance alerts.

## Evaluate conversion and retention without weakening privacy

Study whether contextual help makes the first real record easier, whether reminders are useful, and whether homeowners can find saved information later. Prefer local counts, voluntary feedback, and usability testing. Any new analytics proposal needs its own product and privacy decision; this website change adds no behavioral tracking.

Missing app screens to capture once the shipping UI is confirmed: Demo Mode entry and exit, a completed paint record, Global Search results, Home Essentials, a provider profile connected to work, and a project record.

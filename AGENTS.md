# Instructions for coding agents

Read [README.md](README.md) and [docs/PROJECT.md](docs/PROJECT.md) first.

Before finishing any change to this website, run all three and fix what fails:

```bash
npm run check
npm run test:quiz
npm run test:a11y
```

`npm run test:a11y` is the accessibility regression suite (WCAG 2.2 AA target). It needs Google Chrome installed and a fresh build, which `npm run check` produces.

- Do not weaken, skip, or add exclusions to `scripts/accessibility-test.mjs` to get a pass. Fix the page.
- When you add an interactive component, add a keyboard check for it to that script.
- A pass does not prove conformance. Do not claim the site is WCAG compliant or certified. See [docs/ACCESSIBILITY_AUDIT.md](docs/ACCESSIBILITY_AUDIT.md) for conventions and the manual checklist.
- Do not push or deploy unless asked. Pushing to `main` publishes the site.

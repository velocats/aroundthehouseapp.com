# Around The House Website

Astro website for `aroundthehouseapp.com`, designed to fit the Quiet Tools family of sites.

## Project structure

```text
.
├── public/
│   ├── assets/          # App icon, screenshots, and Open Graph image
│   ├── CNAME            # GitHub Pages custom domain
│   ├── robots.txt
│   └── sitemap.xml
├── src/
│   ├── components/      # Shared header, footer, legal article shell
│   ├── layouts/         # Base HTML/meta layout
│   ├── pages/           # Astro routes
│   └── styles/          # Global CSS
├── astro.config.mjs
└── package.json
```

## Commands

```bash
npm install
npm run dev
npm run build
npm run preview
```

## Pages

- `/` — landing page
- `/privacy/` — privacy policy for App Store metadata
- `/support/` — support page
- `/terms/` — Apple standard EULA link page

## Before launch

1. Replace the "App Store link coming soon" buttons with the live App Store URL.
2. Confirm the support email address: `support@aroundthehouseapp.com`.
3. In App Store Connect, use `https://aroundthehouseapp.com/privacy/` as the privacy policy URL.
4. If using GitHub Pages, set the repository Pages source to GitHub Actions and keep `public/CNAME` set to `aroundthehouseapp.com`.

## Notes

- The visual system is intentionally close to the other Quiet Tools app sites: calm palette, rounded cards, screenshot-led sections, privacy reassurance, and practical feature copy.
- The site uses clean Astro routes rather than `.html` links.
- The included GitHub Actions workflow builds `dist/` and deploys it to GitHub Pages.
# aroundthehouseapp.com

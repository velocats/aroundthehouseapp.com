// Accessibility regression suite. Build first, then run: npm run test:a11y
//
// Serves dist/ itself and drives installed Chrome through playwright-core, so
// no preview server or browser download is needed. Every route is scanned
// with axe-core (WCAG 2.2 A/AA plus best practices) at several viewport sizes,
// then checked for the things axe cannot see: keyboard focus order and
// visibility, reflow, text spacing, link affordance, reduced motion, and the
// interactive components. A clean run is a regression gate, not proof of
// WCAG conformance. See docs/ACCESSIBILITY_AUDIT.md for the manual checks.
//
// A11Y_ROUTES=/,/support/   limit the per-page scans to some routes
// PREVIEW_URL=http://...    test a running server instead of dist/
// A11Y_REPORT=path.json     also write the results as JSON
// A11Y_DEBUG=1              print hero text-over-photograph contrast ratios below 7:1
import { createServer } from 'node:http';
import { readdir, readFile, writeFile } from 'node:fs/promises';
import { extname, join, relative, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright-core';
import { AxeBuilder } from '@axe-core/playwright';

const dist = fileURLToPath(new URL('../dist/', import.meta.url));
const supportEmail = 'support@quiettoolsapps.com';
const axeTags = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa', 'best-practice'];

// 320×256 is a 1280×1024 window at 400% zoom; 640×512 is the same window at 200%.
const viewports = [
  { label: 'desktop', width: 1440, height: 1000 },
  { label: 'large-desktop', width: 1920, height: 1080 },
  { label: 'tablet', width: 834, height: 1194 },
  { label: 'iphone', width: 390, height: 844 },
  { label: 'zoom-200', width: 640, height: 512 },
  { label: 'zoom-400', width: 320, height: 256 }
];
const keyboardViewports = viewports.filter(({ label }) => ['desktop', 'iphone', 'zoom-400'].includes(label));
// Only the Home Health Check implements a dark appearance.
const darkRoutes = ['/home-health-check/'];

const failures = [];
const counts = {};
const fail = (check, where, message) => failures.push(`[${check}] ${where}: ${message}`);
const ran = check => { counts[check] = (counts[check] ?? 0) + 1; };

// --- Static server and route inventory ---------------------------------------

const contentTypes = {
  '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.json': 'application/json',
  '.webmanifest': 'application/manifest+json', '.xml': 'application/xml', '.txt': 'text/plain', '.csv': 'text/csv',
  '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.webp': 'image/webp', '.avif': 'image/avif',
  '.woff2': 'font/woff2'
};

async function htmlFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const nested = await Promise.all(entries.map(entry => {
    const path = join(directory, entry.name);
    return entry.isDirectory() ? htmlFiles(path) : [path];
  }));
  return nested.flat().filter(file => file.endsWith('.html'));
}

const allRoutes = (await htmlFiles(dist).catch(() => []))
  .map(file => `/${relative(dist, file).split(sep).join('/').replace(/index\.html$/, '')}`)
  .sort();
if (!allRoutes.length) {
  console.error('No built pages found in dist/. Run "npm run build" first.');
  process.exit(1);
}
const routes = process.env.A11Y_ROUTES ? allRoutes.filter(route => process.env.A11Y_ROUTES.split(',').includes(route)) : allRoutes;

let server;
let origin = process.env.PREVIEW_URL?.replace(/\/$/, '');
if (!origin) {
  server = createServer(async (request, response) => {
    let path = decodeURIComponent(new URL(request.url, 'http://localhost').pathname);
    if (path.endsWith('/')) path += 'index.html';
    try {
      const body = await readFile(join(dist, path));
      response.writeHead(200, { 'content-type': contentTypes[extname(path)] ?? 'application/octet-stream' });
      response.end(body);
    } catch {
      response.writeHead(404).end('Not found');
    }
  });
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  origin = `http://127.0.0.1:${server.address().port}`;
}

async function launch() {
  const attempts = [{ channel: 'chrome' }, { channel: 'msedge' }, {}];
  for (const options of attempts) {
    try { return await chromium.launch({ ...options, headless: true }); } catch { /* try the next browser */ }
  }
  console.error('No Chromium-based browser is available. Install Google Chrome, or run "npx playwright-core install chromium".');
  process.exit(1);
}
const browser = await launch();

// --- In-page checks ----------------------------------------------------------

// Structure, reflow, and link affordance for the current document.
function pageChecks() {
  const issues = [];
  const shown = element => {
    const box = element.getBoundingClientRect();
    return box.width > 0 && box.height > 0 && getComputedStyle(element).visibility !== 'hidden';
  };
  if (document.documentElement.lang !== 'en') issues.push('1.3.1/3.1.1: <html lang="en"> is missing');
  if (!document.title.trim()) issues.push('2.4.2: page has no title');
  if (document.querySelectorAll('h1').length !== 1) issues.push(`1.3.1: expected one h1, found ${document.querySelectorAll('h1').length}`);
  if (document.querySelectorAll('main').length !== 1) issues.push('1.3.1: expected one main landmark');
  for (const landmark of ['header.site-header', 'header.site-header nav', 'footer.footer']) {
    if (!document.querySelector(landmark)) issues.push(`1.3.1: missing landmark ${landmark}`);
  }
  const focusable = document.querySelector('a[href], button, input:not([type="hidden"]), select, textarea, summary, [tabindex]');
  if (!focusable?.matches('a.skip-link[href="#main-content"]')) issues.push('2.4.1: the skip link is not the first focusable element');
  const main = document.getElementById('main-content');
  if (main?.tagName !== 'MAIN' || main.getAttribute('tabindex') !== '-1') issues.push('2.4.1: #main-content must be a focusable <main>');
  if (document.documentElement.scrollWidth > window.innerWidth + 1) issues.push(`1.4.10: page scrolls horizontally (${document.documentElement.scrollWidth}px wide)`);
  if (!document.querySelector('footer a[href="/accessibility/"]')) issues.push('footer does not link to the accessibility statement');
  if (document.querySelector('meta[name="viewport"]')?.content.match(/user-scalable\s*=\s*no|maximum-scale\s*=\s*[0-4](\.|,|$)/)) issues.push('1.4.4: viewport meta blocks zoom');

  // 1.4.1: a link inside running text needs more than colour to stand out.
  for (const link of document.querySelectorAll(':is(main, footer) :is(p, li, dd, td, figcaption) a')) {
    if (!shown(link) || link.querySelector('img') || getComputedStyle(link).display !== 'inline') continue;
    const block = link.closest('p, li, dd, td, figcaption');
    if (!block.textContent.replace(link.textContent, '').trim()) continue;
    if (!getComputedStyle(link).textDecorationLine.includes('underline')) issues.push(`1.4.1: inline link "${link.textContent.trim().slice(0, 50)}" is not underlined`);
  }

  // 3.2.5 (advisory at AA): links that open a new tab should say so.
  for (const link of document.querySelectorAll('a[target="_blank"]')) {
    if (!/new tab/i.test(link.textContent)) issues.push(`new-tab link to ${link.getAttribute('href')} does not announce that it opens a new tab`);
  }
  return issues;
}

// 1.4.12: apply the WCAG text-spacing overrides and look for clipped content.
function textSpacingChecks() {
  const style = document.createElement('style');
  style.textContent = '* { line-height:1.5 !important; letter-spacing:.12em !important; word-spacing:.16em !important; } p { margin-bottom:2em !important; }';
  document.head.append(style);
  const issues = [];
  if (document.documentElement.scrollWidth > window.innerWidth + 1) issues.push('1.4.12: text spacing causes horizontal scrolling');
  for (const element of document.querySelectorAll('body *')) {
    const styles = getComputedStyle(element);
    if (!element.textContent.trim() || element.closest('[aria-hidden="true"]') || element.clientWidth <= 1 || element.clientHeight <= 1) continue;
    const clipsX = ['hidden', 'clip'].includes(styles.overflowX) && element.scrollWidth > element.clientWidth + 2;
    const clipsY = ['hidden', 'clip'].includes(styles.overflowY) && element.scrollHeight > element.clientHeight + 2;
    if (clipsX || clipsY) issues.push(`1.4.12: text is clipped in <${element.tagName.toLowerCase()} class="${element.className}">`);
  }
  style.remove();
  return issues;
}

// Describes the focused element: its focus indicator, and whether it is visible.
async function focusState() {
  // Let the (near-instant, reduced-motion) focus transitions settle before measuring.
  await new Promise(resolve => requestAnimationFrame(resolve));
  await Promise.all(document.getAnimations().map(animation => animation.finished.catch(() => {})));
  const element = document.activeElement;
  if (!element || element === document.body || element === document.documentElement) return null;
  const parse = color => (color.match(/[\d.]+/g) ?? []).map(Number);
  const luminance = ([r, g, b]) => [r, g, b].map(v => v / 255).map(v => (v <= .04045 ? v / 12.92 : ((v + .055) / 1.055) ** 2.4)).reduce((sum, v, i) => sum + v * [.2126, .7152, .0722][i], 0);
  // Composite ancestor backgrounds until one is opaque. Images and gradients are unknowable here.
  function backdrop(start) {
    const layers = [];
    for (let node = start; node; node = node.parentElement) {
      const styles = getComputedStyle(node);
      if (styles.backgroundImage !== 'none') return null;
      const [r, g, b, a = 1] = parse(styles.backgroundColor);
      if (a > 0) layers.push([r, g, b, a]);
      if (a === 1) break;
    }
    if (!layers.length || layers.at(-1)[3] !== 1) layers.push([255, 255, 255, 1]);
    return layers.reverse().reduce((under, [r, g, b, a]) => [r, g, b].map((v, i) => v * a + under[i] * (1 - a)), [255, 255, 255]);
  }
  const styles = getComputedStyle(element);
  const box = element.getBoundingClientRect();
  const x = Math.min(Math.max(box.left + box.width / 2, 0), window.innerWidth - 1);
  const y = Math.min(Math.max(box.top + box.height / 2, 0), window.innerHeight - 1);
  const top = document.elementFromPoint(x, y);
  const outlineWidth = parseFloat(styles.outlineWidth);
  const hasOutline = styles.outlineStyle !== 'none' && outlineWidth > 0;
  const behind = backdrop(element.parentElement);
  let contrast = null;
  if (hasOutline && styles.outlineStyle !== 'auto' && behind) {
    const [light, dark] = [luminance(parse(styles.outlineColor)), luminance(behind)].sort((a, b) => b - a);
    contrast = (light + .05) / (dark + .05);
  }
  element.dataset.a11yVisited = String(Number(element.dataset.a11yVisited ?? 0) + 1);
  return {
    name: `<${element.tagName.toLowerCase()}> "${(element.getAttribute('aria-label') || element.textContent || element.id || '').trim().replace(/\s+/g, ' ').slice(0, 40)}"`,
    revisited: Number(element.dataset.a11yVisited) > 1,
    hasIndicator: hasOutline || styles.boxShadow !== 'none',
    thinOutline: hasOutline && styles.outlineStyle !== 'auto' && outlineWidth < 2,
    contrast,
    onScreen: box.width > 0 && box.height > 0 && box.bottom > 0 && box.top < window.innerHeight && box.right > 0 && box.left < window.innerWidth,
    obscured: Boolean(top) && !(top === element || element.contains(top) || top.contains(element) || top.closest('label')?.control === element)
  };
}

// --- Suites ------------------------------------------------------------------

async function axe(page, where) {
  const results = await new AxeBuilder({ page }).withTags(axeTags).analyze();
  for (const violation of results.violations) {
    for (const node of violation.nodes) fail('axe', where, `${violation.id} (${violation.impact}) at ${node.target.join(' ')}: ${violation.help}`);
  }
  ran('axe scans');
}

async function open(page, route) {
  const response = await page.goto(origin + route, { waitUntil: 'load' });
  if (response.status() !== 200) fail('http', route, `HTTP ${response.status()}`);
  await page.evaluate(() => document.fonts.ready);
}

async function scanPages() {
  for (const { label, width, height } of viewports) {
    // Reduced motion keeps cross-fades from skewing contrast samples. Motion has its own suite.
    const context = await browser.newContext({ viewport: { width, height }, reducedMotion: 'reduce' });
    const page = await context.newPage();
    page.on('pageerror', error => fail('script error', label, error.message));
    for (const route of routes) {
      const where = `${label} ${route}`;
      await open(page, route);
      for (const issue of await page.evaluate(pageChecks)) fail('page', where, issue);
      ran('page structure and reflow checks');
      await axe(page, where);
      if (label === 'iphone' || label === 'desktop') {
        for (const issue of await page.evaluate(textSpacingChecks)) fail('text spacing', where, issue);
        ran('text spacing checks');
      }
    }
    await context.close();
    console.log(`Scanned ${routes.length} routes at ${width}×${height} (${label}).`);
  }
}

// 2.1.1, 2.1.2, 2.4.3, 2.4.7, 2.4.11, 1.4.11: Tab through every page.
async function keyboardWalks() {
  for (const { label, width, height } of keyboardViewports) {
    const context = await browser.newContext({ viewport: { width, height }, reducedMotion: 'reduce' });
    const page = await context.newPage();
    for (const route of routes) {
      const where = `${label} ${route}`;
      await open(page, route);
      const limit = await page.evaluate(() => document.querySelectorAll('a[href], button, input, select, textarea, summary, [tabindex]').length) + 5;
      let stops = 0;
      let finished = false;
      for (let step = 0; step < limit; step++) {
        await page.keyboard.press('Tab');
        const state = await page.evaluate(focusState);
        if (!state || state.revisited) { finished = true; break; }
        stops++;
        if (step === 0 && !state.name.includes('Skip to main content')) fail('keyboard', where, `first Tab stop is ${state.name}, not the skip link`);
        if (!state.hasIndicator) fail('keyboard', where, `2.4.7: no visible focus indicator on ${state.name}`);
        if (state.thinOutline) fail('keyboard', where, `2.4.7: focus outline thinner than 2px on ${state.name}`);
        if (state.contrast !== null && state.contrast < 3) fail('keyboard', where, `1.4.11: focus outline contrast ${state.contrast.toFixed(2)}:1 on ${state.name}`);
        if (!state.onScreen) fail('keyboard', where, `2.4.11: focused ${state.name} is off screen`);
        else if (state.obscured) fail('keyboard', where, `2.4.11: focused ${state.name} is covered by other content`);
      }
      if (!finished) fail('keyboard', where, '2.1.2: Tab never left the page (possible keyboard trap)');
      if (stops < 5) fail('keyboard', where, `only ${stops} Tab stops were reachable`);
      ran('keyboard walks');
    }
    await context.close();
    console.log(`Tabbed through ${routes.length} routes at ${width}×${height} (${label}).`);
  }
}

const isFocused = locator => locator.evaluate(element => element === document.activeElement);

async function skipLink(context) {
  const page = await context.newPage();
  for (const route of ['/', '/support/', '/resources/how-to-clean-dryer-vent/', '/accessibility/'].filter(route => allRoutes.includes(route))) {
    await open(page, route);
    await page.keyboard.press('Tab');
    const link = page.locator('.skip-link');
    if (!await isFocused(link)) fail('skip link', route, 'not the first Tab stop');
    await page.evaluate(async () => { await new Promise(resolve => requestAnimationFrame(resolve)); await Promise.all(document.getAnimations().map(animation => animation.finished.catch(() => {}))); });
    const box = await link.boundingBox();
    if (!box || box.y < 0) fail('skip link', route, 'not visible when focused');
    await page.keyboard.press('Enter');
    if (!await isFocused(page.locator('#main-content'))) fail('skip link', route, 'does not move focus to main content');
    ran('skip link checks');
  }
  await page.close();
}

async function mobileMenu(context) {
  const page = await context.newPage();
  const where = 'iphone /';
  await open(page, '/');
  const menu = page.locator('.nav-disclosure');
  const summary = menu.locator('summary');
  const isOpen = () => menu.evaluate(element => element.open);
  if (await summary.getAttribute('aria-label')) fail('menu', where, 'summary has a fixed aria-label that hides its state-neutral visible name');
  if ((await summary.innerText()).trim() !== 'Menu') fail('menu', where, 'menu button is not named "Menu"');
  const box = await summary.boundingBox();
  if (!box || box.height < 44 || box.width < 44) fail('menu', where, 'menu button is smaller than 44×44');
  await summary.focus();
  await page.keyboard.press('Enter');
  if (!await isOpen()) fail('menu', where, 'Enter does not open the menu');
  await page.keyboard.press('Tab');
  if (!await isFocused(menu.locator('.nav-disclosure-panel a').first())) fail('menu', where, 'Tab does not move into the open menu');
  await page.keyboard.press('Escape');
  if (await isOpen()) fail('menu', where, 'Escape does not close the menu');
  if (!await isFocused(summary)) fail('menu', where, 'focus does not return to the menu button after Escape');
  await page.keyboard.press('Space');
  if (!await isOpen()) fail('menu', where, 'Space does not open the menu');
  const linkCount = await menu.locator('.nav-disclosure-panel a').count();
  for (let i = 0; i <= linkCount; i++) await page.keyboard.press('Tab');
  if (await isOpen()) fail('menu', where, 'menu stays open, covering the page, after focus leaves it');
  await summary.click();
  await page.mouse.click(20, 700);
  if (await isOpen()) fail('menu', where, 'menu does not close when the page behind it is clicked');
  await open(page, '/pricing/');
  if (await page.locator('.nav-disclosure-panel a[aria-current="page"]').getAttribute('href') !== '/pricing/') fail('menu', 'iphone /pricing/', 'current page is not marked with aria-current');
  ran('mobile menu checks');
  await page.close();
}

async function carousel() {
  for (const reducedMotion of ['no-preference', 'reduce']) {
    const context = await browser.newContext({ viewport: { width: 1440, height: 1000 }, reducedMotion });
    const page = await context.newPage();
    const where = `/ (motion: ${reducedMotion})`;
    await open(page, '/');
    const hero = page.locator('[data-story-hero][data-enhanced="true"]');
    await hero.waitFor();
    const play = page.locator('[data-story-play]');
    if (reducedMotion === 'reduce') {
      if (await hero.getAttribute('data-playing') !== 'false') fail('motion', where, '2.3.3/2.2.2: slideshow auto-plays despite reduced motion');
      if (await page.locator('.story-slide').first().evaluate(element => parseFloat(getComputedStyle(element).transitionDuration)) > .01) fail('motion', where, 'slides still cross-fade');
      if (await page.evaluate(() => getComputedStyle(document.documentElement).scrollBehavior) !== 'auto') fail('motion', where, 'smooth scrolling is still enabled');
    } else {
      await page.mouse.move(0, 0);
      await play.waitFor();
      if (await play.getAttribute('aria-label') !== 'Pause the slideshow') fail('motion', where, '2.2.2: no pause control while the slideshow plays');
      await play.focus();
      await page.keyboard.press('Enter');
      if (await hero.getAttribute('data-playing') !== 'false') fail('motion', where, '2.2.2: pause button does not stop the slideshow');
      if (await play.getAttribute('aria-label') !== 'Play the slideshow') fail('motion', where, '4.1.2: pause button name does not change to play');
    }
    // Scene buttons work from the keyboard and announce the new scene.
    const second = page.locator('[data-story-select="1"]');
    await second.focus();
    await page.keyboard.press('Space');
    await page.waitForFunction(() => document.querySelector('[data-story-select="1"]').getAttribute('aria-pressed') === 'true');
    if (!(await page.locator('[data-story-announcement]').textContent()).startsWith('Scene 2 of 3')) fail('carousel', where, '4.1.3: scene change is not announced');
    if (await page.locator('[data-story-slide]').first().getAttribute('aria-hidden') !== 'true') fail('carousel', where, 'inactive slide is still exposed to assistive technology');
    ran('carousel and motion checks');
    await context.close();
  }
}

// Samples the pixels behind every line of hero copy, with the copy hidden, and
// reports the lowest contrast found (ignoring the darkest 1% as image noise).
async function heroTextContrast() {
  for (const width of [980, 1024, 1200, 1440, 1920]) {
    const context = await browser.newContext({ viewport: { width, height: 1000 }, reducedMotion: 'reduce' });
    const page = await context.newPage();
    await open(page, '/');
    await page.locator('[data-story-hero][data-enhanced="true"]').waitFor();
    for (let scene = 0; scene < 3; scene++) {
      await page.locator(`[data-story-select="${scene}"]`).click();
      await page.waitForFunction(index => document.querySelector(`[data-story-select="${index}"]`).getAttribute('aria-pressed') === 'true', scene);
      await page.evaluate(() => window.scrollTo(0, 0));
      const lines = await page.evaluate(() => [...document.querySelectorAll('.story-copy :is(h1, p)')].filter(element => element.getClientRects().length).flatMap(element => {
        const range = document.createRange();
        range.selectNodeContents(element);
        const styles = getComputedStyle(element);
        const large = parseFloat(styles.fontSize) >= 24 || (parseFloat(styles.fontSize) >= 18.66 && Number(styles.fontWeight) >= 700);
        const colors = [...new Set([element, ...element.querySelectorAll('*')].map(node => getComputedStyle(node).color))];
        return [...range.getClientRects()].map(({ x, y, width, height }) => ({ x, y, width, height, large, colors, text: element.textContent.trim().slice(0, 30) }));
      }));
      const hideCopy = await page.addStyleTag({ content: '.story-copy, .story-copy *, .skip-link { visibility:hidden !important; transition:none !important; }' });
      await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
      const shot = (await page.screenshot()).toString('base64');
      await hideCopy.evaluate(element => element.remove());
      const worst = await page.evaluate(async ({ shot, lines }) => {
        const bitmap = await createImageBitmap(await (await fetch(`data:image/png;base64,${shot}`)).blob());
        const canvas = new OffscreenCanvas(bitmap.width, bitmap.height);
        const context = canvas.getContext('2d');
        context.drawImage(bitmap, 0, 0);
        const scale = bitmap.width / window.innerWidth;
        const luminance = (r, g, b) => [r, g, b].map(v => v / 255).map(v => (v <= .04045 ? v / 12.92 : ((v + .055) / 1.055) ** 2.4)).reduce((sum, v, i) => sum + v * [.2126, .7152, .0722][i], 0);
        return lines.map(line => {
          const left = Math.max(0, Math.floor(line.x * scale)), top = Math.max(0, Math.floor(line.y * scale));
          const w = Math.min(bitmap.width - left, Math.ceil(line.width * scale)), h = Math.min(bitmap.height - top, Math.ceil(line.height * scale));
          if (w <= 0 || h <= 0) return null;
          const { data } = context.getImageData(left, top, w, h);
          const samples = [];
          for (let i = 0; i < data.length; i += 4) samples.push(luminance(data[i], data[i + 1], data[i + 2]));
          samples.sort((a, b) => a - b);
          const background = samples[Math.floor(samples.length * .01)];
          const ratios = line.colors.map(color => {
            const text = luminance(...color.match(/[\d.]+/g).slice(0, 3).map(Number));
            return (Math.max(text, background) + .05) / (Math.min(text, background) + .05);
          });
          return { text: line.text, large: line.large, ratio: Math.min(...ratios) };
        }).filter(Boolean);
      }, { shot, lines });
      for (const { text, large, ratio } of worst) {
        if (process.env.A11Y_DEBUG && ratio < 7) console.log(width, scene + 1, text, ratio.toFixed(2));
        if (ratio < (large ? 3 : 4.5)) fail('contrast', `/ at ${width}px, scene ${scene + 1}`, `1.4.3: "${text}…" over the photograph is ${ratio.toFixed(2)}:1`);
      }
      ran('text-over-photograph contrast samples');
    }
    await context.close();
  }
}

async function homeHealthCheck() {
  for (const colorScheme of ['light', 'dark']) {
    for (const { label, width, height } of viewports.filter(({ label }) => ['desktop', 'iphone', 'zoom-400'].includes(label))) {
      const context = await browser.newContext({ viewport: { width, height }, colorScheme, reducedMotion: 'reduce' });
      const page = await context.newPage();
      const where = `${label} ${colorScheme} /home-health-check/`;
      await open(page, '/home-health-check/');
      const widget = page.locator('[data-health-check][data-enhanced="true"]');
      await widget.waitFor();
      const status = page.locator('[data-quiz-status]');
      if (await status.getAttribute('role') !== 'status') fail('quiz', where, '4.1.3: quiz status region is missing role="status"');
      const group = page.locator('.hhc-answers');
      if (await group.getAttribute('role') !== 'group' || await group.getAttribute('aria-labelledby') !== 'hhc-question-title') fail('quiz', where, '1.3.1: answers are not grouped under the question');
      await axe(page, `${where} (question)`);

      // Answer every question with the keyboard only, alternating Enter and Space.
      for (let index = 0; index < 6; index++) {
        if (!(await page.locator('.hhc-progress-row').innerText()).includes(`Question ${index + 1} of 6`)) fail('quiz', where, `progress text missing on question ${index + 1}`);
        const answer = page.locator('.hhc-answer').nth(index % 3);
        await answer.focus();
        await page.keyboard.press(index % 2 ? 'Space' : 'Enter');
        if (!await isFocused(page.locator('.hhc-feedback'))) fail('quiz', where, `2.4.3: focus does not move to the feedback after answering question ${index + 1}`);
        const picked = page.locator('.hhc-answer[aria-pressed="true"]');
        if (await picked.count() !== 1) fail('quiz', where, `4.1.2: chosen answer is not exposed on question ${index + 1}`);
        // 1.4.1: the verdict is text, not just a coloured dot.
        if (!/Pro move|Getting there|Uh oh/.test(await picked.innerText())) fail('quiz', where, `1.4.1: answer verdict relies on colour on question ${index + 1}`);
        if (!/Pro move|Getting there|Uh oh/.test(await status.textContent())) fail('quiz', where, `4.1.3: answer feedback is not announced on question ${index + 1}`);
        if (index === 0) await axe(page, `${where} (feedback)`);
        await page.locator('#hhc-next').focus();
        await page.keyboard.press('Enter');
        if (index < 5) {
          if (!await isFocused(page.locator('#hhc-question-title'))) fail('quiz', where, `2.4.3: focus does not move to question ${index + 2}`);
          if (!(await status.textContent()).includes(`Question ${index + 2} of 6`)) fail('quiz', where, `4.1.3: progress is not announced for question ${index + 2}`);
        }
      }

      if (!await isFocused(page.locator('#hhc-band'))) fail('quiz', where, '2.4.3: focus does not move to the result');
      const score = await page.locator('[data-score]').getAttribute('data-score');
      if (!(await status.textContent()).includes(`${score} out of 12`)) fail('quiz', where, '4.1.3: the score is not announced');
      if (!(await page.locator('.hhc-score').innerText()).replace(/\s+/g, ' ').includes(`${score} out of 12`)) fail('quiz', where, 'the score is not available as text');
      if (!/Uh oh.*Getting there.*Pro move/s.test(await page.locator('.hhc-counts').innerText())) fail('quiz', where, '1.4.1: the result tally names colours without their meaning');
      if (await page.locator('[data-recommendation] .hhc-tag').count() !== 6) fail('quiz', where, '1.4.1: a recommendation has no text verdict');
      if (await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1)) fail('quiz', where, '1.4.10: results scroll horizontally');
      await axe(page, `${where} (results)`);

      // Results controls: review and restart from the keyboard.
      await page.locator('#hhc-review').focus();
      await page.keyboard.press('Enter');
      if (!await isFocused(page.locator('#hhc-question-title'))) fail('quiz', where, 'focus is lost after "Review answers"');
      ran('Home Health Check keyboard journeys');
      await context.close();
    }
  }
}

async function supportForm(context) {
  const page = await context.newPage();
  const where = 'iphone /support/';
  await open(page, '/support/');
  const problems = await page.evaluate(() => {
    const issues = [];
    const form = document.querySelector('#supportForm');
    for (const control of form.querySelectorAll('input:not([type="hidden"]), select, textarea')) {
      if (control.getAttribute('aria-hidden') === 'true') {
        if (control.tabIndex !== -1) issues.push('hidden honeypot field is keyboard focusable');
        continue;
      }
      const label = control.labels?.[0];
      if (!label || !label.offsetParent) issues.push(`3.3.2: ${control.id} has no visible label`);
      if (control.required && !/required/i.test(label?.textContent ?? '')) issues.push(`3.3.2: ${control.id} is required but its label does not say so`);
      if (control.getBoundingClientRect().height < 44) issues.push(`2.5.8: ${control.id} is shorter than 44px`);
      const [r, g, b] = getComputedStyle(control).borderTopColor.match(/[\d.]+/g).map(Number);
      const luminance = [r, g, b].map(v => v / 255).map(v => (v <= .04045 ? v / 12.92 : ((v + .055) / 1.055) ** 2.4)).reduce((sum, v, i) => sum + v * [.2126, .7152, .0722][i], 0);
      // Fields sit on #fffdf8 (luminance ≈ .98).
      if ((getComputedStyle(control).borderTopColor.match(/[\d.]+/g)[3] ?? 1) < 1 || (.98 + .05) / (luminance + .05) < 3) issues.push(`1.4.11: ${control.id} border contrast is below 3:1`);
    }
    for (const [id, token] of [['support-name', 'name'], ['support-email', 'email']]) {
      if (document.getElementById(id).autocomplete !== token) issues.push(`1.3.5: ${id} is missing autocomplete="${token}"`);
    }
    if (form.checkValidity()) issues.push('3.3.1: empty form is treated as valid');
    return issues;
  });
  for (const issue of problems) fail('support form', where, issue);

  // 3.3.1: an invalid submission keeps the user's input and focuses the first error. Nothing is sent.
  let submitted = false;
  await page.route('**/formsubmit.co/**', route => { submitted = true; return route.abort(); });
  await page.locator('#support-message').fill('Kept after a failed submission.');
  await page.locator('#supportForm button[type="submit"]').focus();
  await page.keyboard.press('Enter');
  if (submitted) fail('support form', where, 'an invalid form was submitted');
  if (!await isFocused(page.locator('#support-topic'))) fail('support form', where, '3.3.1: focus does not move to the first invalid field');
  if (!await page.locator('#support-topic').evaluate(element => element.validationMessage)) fail('support form', where, '3.3.1: the invalid field has no error message');
  if (await page.locator('#support-message').inputValue() !== 'Kept after a failed submission.') fail('support form', where, '3.3.4: input was lost after a validation error');

  await open(page, '/support/?sent=1');
  const success = page.locator('#formSuccess');
  if (!await success.isVisible()) fail('support form', where, 'success message is not shown');
  if (await success.getAttribute('role') !== 'status') fail('support form', where, '4.1.3: success message is not a status');
  if (!await isFocused(success)) fail('support form', where, '4.1.3: success message does not receive focus, so it may not be announced');
  ran('support form checks');
  await page.close();
}

async function checklist(context) {
  const page = await context.newPage();
  const where = 'iphone /annual-home-maintenance-checklist/';
  await open(page, '/annual-home-maintenance-checklist/');
  const progress = page.locator('#progress-label');
  if (await progress.getAttribute('role') !== 'status') fail('checklist', where, '4.1.3: progress is not exposed as a status message');
  const first = page.locator('#monthly-1');
  await first.focus();
  await page.keyboard.press('Space');
  if (!await first.isChecked()) fail('checklist', where, '2.1.1: Space does not check a task');
  if (!(await progress.textContent()).startsWith('1 of')) fail('checklist', where, 'progress text does not update');
  if (!await first.evaluate(element => element.labels.length === 1)) fail('checklist', where, '1.3.1: task checkbox has no label');
  await page.locator('#reset-checklist').focus();
  await page.keyboard.press('Enter');
  if (await first.isChecked()) fail('checklist', where, 'keyboard reset does not clear checkmarks');
  ran('checklist checks');
  await page.close();
}

async function statement(context) {
  const page = await context.newPage();
  const where = '/accessibility/';
  if (!allRoutes.includes(where)) { fail('statement', where, 'the accessibility statement page does not exist'); return; }
  await open(page, where);
  if (await page.title() !== 'Accessibility | Around The House') fail('statement', where, `unexpected title "${await page.title()}"`);
  const text = await page.locator('main').innerText();
  if (!text.includes('WCAG') || !text.includes('2.2') || !text.includes('AA')) fail('statement', where, 'does not name WCAG 2.2 Level AA as the target');
  if (await page.locator(`main a[href="mailto:${supportEmail}"]`).count() === 0) fail('statement', where, 'does not offer the support email');
  if (await page.locator('main a[href="/support/"]').count() === 0) fail('statement', where, 'does not link to the support form');
  if (/certified|fully compliant|fully accessible|guarantee/i.test(text)) fail('statement', where, 'makes a certification or full-compliance claim');
  ran('accessibility statement checks');
  await page.close();
}

// --- Run ---------------------------------------------------------------------

try {
  await scanPages();
  await keyboardWalks();
  for (const route of darkRoutes.filter(route => routes.includes(route))) {
    for (const { label, width, height } of viewports) {
      const context = await browser.newContext({ viewport: { width, height }, colorScheme: 'dark', reducedMotion: 'reduce' });
      const page = await context.newPage();
      await open(page, route);
      await axe(page, `${label} dark ${route}`);
      await context.close();
    }
  }
  const phone = await browser.newContext({ viewport: { width: 390, height: 844 }, reducedMotion: 'reduce' });
  await skipLink(phone);
  await mobileMenu(phone);
  await supportForm(phone);
  await checklist(phone);
  await statement(phone);
  await phone.close();
  await carousel();
  await heroTextContrast();
  await homeHealthCheck();
} catch (error) {
  fail('suite', 'runner', error.stack);
} finally {
  await browser.close();
  server?.close();
}

const report = { routes: routes.length, viewports, checks: counts, failures };
if (process.env.A11Y_REPORT) await writeFile(process.env.A11Y_REPORT, `${JSON.stringify(report, null, 2)}\n`);

console.log('');
for (const [check, count] of Object.entries(counts)) console.log(`  ${String(count).padStart(4)} ${check}`);
if (failures.length) {
  console.error(`\nAccessibility checks failed with ${failures.length} issue(s):`);
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}
console.log(`\nAccessibility checks passed for ${routes.length} routes. Automated checks cannot prove WCAG conformance; see docs/ACCESSIBILITY_AUDIT.md for the manual checklist.`);

// Run against the production preview. Supply PLAYWRIGHT_MODULE when using a bundled runtime.
// Example: PLAYWRIGHT_MODULE=/absolute/path/to/playwright/index.mjs node scripts/browser-qa.mjs
import { readdir, mkdir, writeFile } from 'node:fs/promises';
import { join, relative } from 'node:path';
const { chromium } = await import(process.argv[2] || process.env.PLAYWRIGHT_MODULE || 'playwright');
const origin = process.env.PREVIEW_URL || 'http://127.0.0.1:4321';
const output = new URL(process.env.QA_OUTPUT || '../docs/design/home-records/', import.meta.url);
await mkdir(output, { recursive:true });
async function htmlFiles(dir) {
  const entries=await readdir(dir,{withFileTypes:true});
  return (await Promise.all(entries.map(entry=>entry.isDirectory()?htmlFiles(join(dir,entry.name)):[join(dir,entry.name)]))).flat().filter(file=>file.endsWith('.html'));
}
const root=new URL('../dist/',import.meta.url).pathname;
const routes=(await htmlFiles(root)).map(file=> '/' + relative(root,file).replace(/index\.html$/,'')).filter(route=>!process.env.QA_ROUTES||process.env.QA_ROUTES.split(',').includes(route));
const sizes=[['desktop',1440,1000],['iphone',390,844],['ipad',834,1194],['narrow',320,740]];
const browser=await chromium.launch({channel:'chrome',headless:true});
const errors=[];
const screenshots=new Set(['/','/home-records-app/','/pricing/','/paint-color-tracker/','/home-inventory-app/','/home-warranty-tracker/','/home-handoff-report/','/support/','/resources/','/resources/how-to-create-a-digital-home-binder/']);
let checks=0;
try {
 for(const [label,width,height] of sizes) {
  const page=await browser.newPage({viewport:{width,height},deviceScaleFactor:1,reducedMotion:'reduce'});
  page.on('pageerror',error=>errors.push(`${label}: ${error.message}`));
  for(const route of routes) {
   const response=await page.goto(origin+route,{waitUntil:'domcontentloaded'});
   if(response.status()!==200) errors.push(`${label} ${route}: HTTP ${response.status()}`);
   // Scroll normally so the browser requests every lazy-loaded screenshot.
   await page.evaluate(async()=>{
    for(let y=0;y<document.documentElement.scrollHeight;y+=700){window.scrollTo(0,y);await new Promise(resolve=>setTimeout(resolve,25));}
    await Promise.all([...document.images].filter(img=>img.complete&&img.naturalWidth>0).map(img=>img.decode().catch(()=>{})));
    window.scrollTo(0,0);
   });
   const issues=await page.evaluate(()=>{
    const issues=[];
    if(document.documentElement.scrollWidth>innerWidth+1)issues.push('horizontal page overflow');
    for(const img of document.images){if(!img.closest('details:not([open])')&&img.getBoundingClientRect().height>0&&getComputedStyle(img).visibility!=='hidden'&&(!img.complete||!img.naturalWidth))issues.push(`image did not load: ${img.getAttribute('src')}`);}
    for(const el of document.querySelectorAll('a,button,summary')){
     if(!el.textContent.trim()&&!el.getAttribute('aria-label')&&!el.querySelector('img[alt]'))issues.push('interactive element without accessible name');
    }
    for(const el of document.querySelectorAll('input:not([type="hidden"]),select,textarea')){
     if(el.getAttribute('aria-hidden')==='true')continue;
     if(!el.labels?.length&&!el.getAttribute('aria-label'))issues.push(`unlabelled field: ${el.id}`);
    }
    return issues;
   });
   errors.push(...issues.map(issue=>`${label} ${route}: ${issue}`));
   // Remove navigation-restored focus from visual captures; keyboard QA uses a fresh page below.
   await page.evaluate(()=>document.activeElement instanceof HTMLElement&&document.activeElement.blur());
   if(route==='/') {
    const action=page.locator(width<=980?'.mobile-download':'.desktop-links .store-link');
    if(!await action.isVisible())errors.push(`${label}: header download hidden`);
    const bounds=await action.boundingBox();
    const brand=await page.locator('.site-header .brand').boundingBox();
    if(bounds&&brand&&brand.x+brand.width>bounds.x)errors.push(`${label}: brand overlaps download`);
    if(!bounds||bounds.width<44||bounds.height<44||bounds.x<0||bounds.x+bounds.width>width)errors.push(`${label}: header download target does not fit`);
    if(await action.locator('img').getAttribute('alt')!=='Download on the App Store')errors.push(`${label}: wrong visible header CTA`);
    if(!await page.locator('.story-download .store-link').isVisible())errors.push(`${label}: hero download missing`);
    if(!await page.locator('#how-it-works').count())errors.push(`${label}: how-it-works destination missing`);
    for(const el of await page.locator('.store-link').all()) {
     if(await el.getAttribute('href')!=='https://apps.apple.com/us/app/around-the-house-binder/id6789646793')errors.push(`${label}: download destination changed`);
    }
    if(await page.locator('[data-story-slide]').count()!==3)errors.push(`${label}: homeowner scenes incomplete`);
    if(await page.locator('.story-quiz-link').getAttribute('href')!=='/home-health-check/')errors.push(`${label}: quiz teaser destination changed`);
    if(screenshots.has(route)&&label!=='narrow') {
     await page.locator('.site-header').screenshot({path:new URL(`header-${label}.png`,output).pathname});
     await page.locator('.story-hero').screenshot({style:'.skip-link:not(:focus) { visibility:hidden; }',path:new URL(`hero-${label}.png`,output).pathname});
     await page.locator('.story-quiz').screenshot({path:new URL(`quiz-teaser-${label}.png`,output).pathname});
    }
   }
   if(screenshots.has(route)&&label!=='narrow'){
    const name=route==='/'?'home':route.split('/').filter(Boolean).at(-1);
    await page.screenshot({style:'.skip-link:not(:focus){visibility:hidden}',path:new URL(`${name}-${label}.png`,output).pathname,fullPage:true});
   }
   checks++;
  }
  console.log(`Checked ${routes.length} routes at ${width}×${height}.`);
  await page.close();
 }
 const page=await browser.newPage({viewport:{width:390,height:844},reducedMotion:'reduce'});
 await page.goto(origin+'/');
 await page.keyboard.press('Tab');
 if(await page.locator('.skip-link').evaluate(el=>el!==document.activeElement))errors.push('Skip link is not first keyboard stop');
 await page.keyboard.press('Enter');
 if(await page.locator('#main-content').evaluate(el=>el!==document.activeElement))errors.push('Skip link does not focus main');
 await page.locator('.nav-disclosure summary').click();
 await page.locator('.nav-disclosure-panel a[href="#how-it-works"]').click();
 if(await page.locator('.nav-disclosure').getAttribute('open')!==null)errors.push('Menu remains open after anchor navigation');
 await page.locator('.nav-disclosure summary').click();
 await page.keyboard.press('Escape');
 if(await page.locator('.nav-disclosure').getAttribute('open')!==null)errors.push('Escape does not close the menu');
 await page.goto(origin+'/annual-home-maintenance-checklist/');
 await page.locator('#monthly-1').check();
 await page.reload();
 if(!await page.locator('#monthly-1').isChecked())errors.push('Checklist persistence failed');
 if(!await page.locator('#progress-label').textContent().then(text=>text.startsWith('1 of')))errors.push('Checklist progress failed');
 await page.locator('#reset-checklist').click();
 if(await page.locator('#monthly-1').isChecked())errors.push('Checklist reset failed');
 await page.locator('#print-checklist').evaluate(el=>{window.__printCalled=false;window.print=()=>{window.__printCalled=true};el.click()});
 if(!await page.evaluate(()=>window.__printCalled))errors.push('Checklist print action failed');
 const csv=await page.request.get(origin+'/downloads/annual-home-maintenance-checklist.csv');
 if(csv.status()!==200||!(await csv.text()).includes('Test smoke alarms'))errors.push('Checklist CSV download failed');
 await page.goto(origin+'/support/');
 if(await page.locator('#supportForm').evaluate(form=>form.checkValidity()))errors.push('Support form does not enforce required fields');
 await page.goto(origin+'/support/?sent=1');
 if(!await page.locator('#formSuccess').isVisible())errors.push('Support success state failed');
 await page.goto(origin+'/');
 await page.locator('[data-story-select="1"]').click();
 await page.waitForFunction(()=>document.querySelector('[data-story-select="1"]').getAttribute('aria-pressed')==='true');
 if(await page.locator('[data-story-select="1"]').getAttribute('aria-pressed')!=='true')errors.push('Manual story selection failed');
 await page.locator('[data-story-screen]:not([hidden]) summary').click();
 if(!await page.locator('[data-story-screen]:not([hidden])').getAttribute('open').then(value=>value!==null))errors.push('Genuine screenshot disclosure failed');
 await page.goto(origin+'/home-inventory-app/?utm_source=instagram&utm_medium=paid_social&utm_campaign=insurance_2026q4#insurance-records');
 if(!await page.locator('#insurance-records').isVisible())errors.push('Insurance campaign anchor missing');
 if(await page.locator('link[rel="canonical"]').getAttribute('href')!=='https://aroundthehouseapp.com/home-inventory-app/')errors.push('Campaign query changes canonical');
 await page.close();
} finally {await browser.close();}
const report={date:'2026-10-11',checks,viewports:sizes.map(([label,width,height])=>({label,width,height})),routes:routes.length,errors,interactions:['visible mobile and desktop download targets','hero download and quiz destination','three homeowner scenes','insurance campaign anchor and canonical','keyboard skip link','mobile anchor menu','Escape menu close','checklist persistence, progress, reset, print, CSV','support required fields and success state (no submission)','manual carousel selection','genuine screenshot disclosure']};
await writeFile(new URL(process.env.QA_REPORT || 'browser-qa.json',output),JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify(report,null,2));
if(errors.length)process.exit(1);

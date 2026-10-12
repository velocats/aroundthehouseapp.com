// Dedicated Phase 2 visual/interaction QA. Uses bundled Playwright, no project dependency.
import { mkdir, writeFile } from 'node:fs/promises';
const { chromium } = await import(process.argv[2] || process.env.PLAYWRIGHT_MODULE || 'playwright');
const origin = process.env.PREVIEW_URL || 'http://127.0.0.1:4321';
const output = new URL(process.env.QA_OUTPUT || '../docs/design/phase2/', import.meta.url);
await mkdir(output, { recursive: true });
const sizes = [[320,740],[375,812],[390,844],[430,932],[768,1024],[834,1194],[900,1200],[980,768],[1024,768],[1280,900],[1440,1000],[1920,1080],[1194,834]];
const browser = await chromium.launch({channel:'chrome', headless:true});
const report = {date:'2026-10-11',viewports:[],interactions:[],errors:[],requests:[]};
const check = (condition,message) => {if(!condition)report.errors.push(message);};
async function active(page,i) {await page.locator(`[data-story-select="${i}"][aria-pressed="true"]`).waitFor({state:'attached'});}
try {
 for (const [width,height] of sizes) {
  const page=await browser.newPage({viewport:{width,height},reducedMotion:'reduce'});
  page.on('pageerror',e=>report.errors.push(`${width}: ${e.message}`));
  await page.goto(origin);await page.waitForSelector('[data-enhanced=true]');
  const measurements = await page.evaluate(() => ({overflow:document.documentElement.scrollWidth>innerWidth,photoTop:document.querySelector('.story-photographs').getBoundingClientRect().top,copy:document.querySelector('.story-copy').getBoundingClientRect().toJSON(),photographs:document.querySelector('.story-photographs').getBoundingClientRect().toJSON()}));
  check(!measurements.overflow,`${width}: overflow`);
  check(await page.locator('[data-story-hero]').getAttribute('data-playing')==='false',`${width}: reduced motion autoplay`);
  check(await page.locator('[data-story-play]').isDisabled(),`${width}: reduced motion play control enabled`);
  const targets=await page.locator('.story-controls button:not([disabled])').evaluateAll(buttons=>buttons.map(b=>b.getBoundingClientRect().toJSON()));
  check(targets.every(r=>r.width>=44&&r.height>=44),`${width}: small carousel controls`);
  for(let i=0;i<3;i++){
   await page.locator(`[data-story-select="${i}"]`).click();await active(page,i);
   check(await page.locator('[data-story-slide][aria-hidden=false]').count()===1,`${width}: active slide access`);
   check(await page.locator('[data-story-caption]:not([hidden])').count()===1,`${width}: active caption count`);
   const dimensions=await page.locator('.story-slide.is-active img').evaluate(async img=>{await img.decode();return {loaded:img.naturalWidth>0,src:img.currentSrc};});
   check(dimensions.loaded,`${width}: scene ${i} image not loaded`);
   const isMobile=width<600;check(dimensions.src.includes(isMobile?'mobile':'desktop'),`${width}: wrong image art direction`);
   await page.locator('.story-hero').screenshot({style:'.skip-link:not(:focus) { visibility:hidden; }',path:new URL(`hero-${width}-scene-${i+1}.png`,output).pathname});
  }
  await page.locator('[data-story-select="0"]').click();await active(page,0);
  await page.evaluate(async()=>{for(let y=0;y<document.documentElement.scrollHeight;y+=900){window.scrollTo(0,y);await new Promise(r=>setTimeout(r,15));}await Promise.all([...document.images].filter(img=>img.complete && img.naturalWidth>0).map(img=>img.decode().catch(()=>{})));window.scrollTo(0,0);document.activeElement?.blur();});
  check(await page.locator('.story-quiz-link').getAttribute('href')==='/home-health-check/',`${width}: quiz destination`);
  check(await page.locator('.story-answer-previews a,.story-answer-previews button').count()===0,`${width}: pretend answer selection`);
  const body=await page.locator('main').innerText();check(!/\$|two weeks|cancel anytime|29\.99|69\.99|0\.99|14\.99/i.test(body),`${width}: unverified price/trial`);
  for(const img of await page.locator('.store-link img').all())check(await img.getAttribute('src')==='/assets/app-store-badge.svg',`${width}: placeholder badge`);
  check(await page.locator('.ath-screen,iframe').count()===0,`${width}: prototype runtime/UI`);
  await page.screenshot({style:'.skip-link:not(:focus) { visibility:hidden; }',path:new URL(`home-${width}.png`,output).pathname,fullPage:true});
  report.viewports.push({width,height,...measurements});await page.close();
 }
 const page=await browser.newPage({viewport:{width:1440,height:1000},reducedMotion:'no-preference'});
 page.on('pageerror',e=>report.errors.push(e.message));
 // Deterministic clock exercises the actual timer rather than replacing carousel logic.
 await page.clock.install();await page.goto(origin);await page.waitForSelector('[data-enhanced=true]');await page.mouse.move(1400,30);
 check(await page.locator('[data-story-hero]').getAttribute('data-playing')==='true','autoplay did not start');
 await page.clock.runFor(6000);await active(page,1);report.interactions.push('6-second automatic advance');
 await page.mouse.move(900,300);check(await page.locator('[data-story-hero]').getAttribute('data-playing')==='false','hover did not pause');
 await page.clock.runFor(12000);await active(page,1);report.interactions.push('hover pause');
 await page.mouse.move(1400,30);await page.clock.runFor(6000);await active(page,2);await page.clock.runFor(6000);await active(page,0);report.interactions.push('hover resume and carousel wrap');
 await page.locator('[data-story-select="2"]').focus();check(await page.locator('[data-story-hero]').getAttribute('data-playing')==='false','focus did not pause');
 await page.keyboard.press('Enter');await active(page,2);await page.locator('.story-quiz-link').focus();await page.mouse.move(1400,30);await page.clock.runFor(12000);await active(page,2);report.interactions.push('keyboard selection and persistent manual pause');
 await page.locator('[data-story-play]').focus();await page.keyboard.press('Enter');check(await page.locator('[data-story-hero]').getAttribute('data-playing')==='false','focused play should wait');await page.locator('.story-quiz-link').focus();await page.clock.runFor(6000);await active(page,0);report.interactions.push('play resumes after focus leaves');
 await page.locator('[data-story-play]').click();await page.locator('.story-quiz-link').focus();await page.clock.runFor(12000);await active(page,0);report.interactions.push('explicit pause');
 await page.locator('[data-story-play]').click();await page.locator('.story-quiz-link').focus();
 await page.evaluate(()=>{Object.defineProperty(document,'hidden',{configurable:true,get:()=>true});document.dispatchEvent(new Event('visibilitychange'));});
 check(await page.locator('[data-story-hero]').getAttribute('data-playing')==='false','hidden document did not pause');await page.clock.runFor(12000);await active(page,0);
 await page.evaluate(()=>{delete document.hidden;document.dispatchEvent(new Event('visibilitychange'));});await page.clock.runFor(6000);await active(page,1);report.interactions.push('simulated document visibility pause/resume');
 await page.emulateMedia({reducedMotion:'reduce'});await page.locator('[data-story-play]:disabled').waitFor({state:'attached'});check(await page.locator('[data-story-play]').isDisabled(),'motion change did not disable autoplay');await page.clock.runFor(12000);await active(page,1);report.interactions.push('live reduced-motion change');
 await page.locator('[data-story-screen]:not([hidden]) summary').click();check(await page.locator('[data-story-screen]:not([hidden])').getAttribute('open')!==null,'capture disclosure');
 await page.locator('[data-story-screen]:not([hidden]) img').evaluate(img=>img.decode());await page.screenshot({style:'.skip-link:not(:focus) { visibility:hidden; }',path:new URL('supplemental-capture.png',output).pathname,fullPage:true});report.interactions.push('full genuine screenshot disclosure');
 await page.close();
 const keyboard=await browser.newPage({viewport:{width:390,height:844},reducedMotion:'reduce'});await keyboard.goto(origin);await keyboard.keyboard.press('Tab');check(await keyboard.locator('.skip-link').evaluate(el=>el===document.activeElement),'skip not first');await keyboard.keyboard.press('Enter');check(await keyboard.locator('#main-content').evaluate(el=>el===document.activeElement),'skip focus');report.interactions.push('keyboard skip link');await keyboard.close();
 const nojs=await browser.newPage({javaScriptEnabled:false,viewport:{width:390,height:844}});await nojs.goto(origin);check(await nojs.locator('.story-nojs').isVisible(),'nojs description missing');check(await nojs.locator('[data-story-controls]').isHidden(),'dead nojs controls');check(await nojs.locator('.story-slide.is-active img').isVisible(),'nojs photo missing');await nojs.screenshot({path:new URL('no-javascript.png',output).pathname,fullPage:true});report.interactions.push('no-JavaScript fallback');await nojs.close();
 const network=await browser.newPage();network.on('request',r=>report.requests.push(r.url()));await network.goto(origin);await network.locator('[data-story-select="1"]').click();await active(network,1);check(report.requests.every(url=>url.startsWith(origin)),'external homepage requests');await network.close();report.interactions.push('homepage requests stay on local origin');
} finally {await browser.close();await writeFile(new URL('home-story-qa.json',output),JSON.stringify(report,null,2)+'\n');}
console.log(JSON.stringify({viewports:report.viewports.length,interactions:report.interactions,errors:report.errors},null,2));if(report.errors.length)process.exit(1);

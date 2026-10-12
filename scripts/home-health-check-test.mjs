// Run with Node 20+: npm run test:quiz. Uses the existing Astro/esbuild tooling.
import assert from 'node:assert/strict';
import { transform } from 'esbuild';
import { readFile as readQuizSource } from 'node:fs/promises';
const quizModule = await transform(await readQuizSource(new URL('../src/data/homeHealthCheck.ts', import.meta.url), 'utf8'), { loader: 'ts', format: 'esm', target: 'es2022' });
const { questions, bands, tones, resultsFor, reactionFor, initialState, answerQuestion, nextQuestion, previousQuestion, changeAnswer, shareText, shareUrl } = await import('data:text/javascript;base64,' + Buffer.from(quizModule.code).toString('base64'));
assert.equal(questions.length, 6);
questions.forEach(q => { assert.equal(q.choices.length, 4); assert.deepEqual(q.choices.map(a => a.tone), ['g','y','r','r']); assert.ok(q.rule && q.why && q.tip && q.guide); });
assert.deepEqual(Object.values(tones).map(t => t.points), [2,1,0]);
const seen = new Set(); let combinations = 0;
for (let code = 0; code < 4096; code++) {
 const picks = Array.from({length:6}, (_,i) => (code >> (i * 2)) & 3);
 const expected = picks.reduce((sum,a)=>sum + [2,1,0,0][a],0);
 const r = resultsFor(picks); assert.equal(r.score, expected); seen.add(r.score);
 assert.equal(r.band.name, expected >= 11 ? 'House whisperer' : expected >= 6 ? 'Mostly on it' : 'Your house is keeping secrets');
 assert.equal(r.recommendations.length,6);
 assert.deepEqual(r.recommendations.map(e=>e.index), [0,1,2,3,4,5].sort((a,b)=>[2,1,0,0][picks[a]]-[2,1,0,0][picks[b]] || a-b));
 assert.deepEqual(r.safety.map(e=>e.index), [0,2].filter(i=>picks[i]!==0));
 r.entries.forEach((e,i)=>{assert.equal(e.answer,picks[i]);assert.equal(e.question.choices[e.answer].text,questions[i].choices[picks[i]].text);assert.ok(reactionFor(i,picks[i]));});
 combinations++;
}
assert.deepEqual([...seen].sort((a,b)=>a-b),Array.from({length:13},(_,i)=>i));
for (const [picks,score] of [[[0,0,0,0,0,0],12],[[2,2,2,2,2,2],0],[[0,0,1,2,2,2],5],[[0,0,0,2,2,2],6],[[0,0,0,0,0,2],10],[[0,0,0,0,0,1],11]])assert.equal(resultsFor(picks).score,score);
assert.equal(resultsFor([1,0,0,0,0,0]).score,11);assert.equal(resultsFor([1,0,0,0,0,0]).safety[0].question.id,'smoke');
assert.equal(resultsFor([0,0,2,0,0,0]).safety[0].question.id,'dryer');
assert.throws(()=>resultsFor([0]));assert.throws(()=>resultsFor([0,0,0,0,0,9]));
let s=initialState(); assert.equal(nextQuestion(s,0),s);
s=answerQuestion(s,0,2);assert.equal(answerQuestion(s,0,0),s);const stale=s;s=nextQuestion(s,0);assert.equal(nextQuestion(s,0),s);assert.equal(stale.index,0);
s=previousQuestion(s,1);assert.equal(s.picks[0],2);s=changeAnswer(s,0);s=answerQuestion(s,0,0);
for(let i=0;i<6;i++){if(s.picks[i]===undefined)s=answerQuestion(s,i,0);s=nextQuestion(s,i);}
assert.equal(s.phase,'results');assert.equal(resultsFor(s.picks).score,12);assert.equal(nextQuestion(s,5),s);
s=previousQuestion(s,5);assert.equal(s.index,5);s=changeAnswer(s,5);s=answerQuestion(s,5,2);s=nextQuestion(s,5);assert.equal(resultsFor(s.picks).score,10);
s=initialState();assert.ok(s.picks.every(p=>p===undefined));assert.equal(s.index,0);
assert.equal(shareUrl,'https://aroundthehouseapp.com/home-health-check/');assert.match(shareText(11,bands[0].name),/11\/12.*House whisperer/);assert.ok(!shareUrl.includes('?'));
console.log(`Passed all ${combinations} combinations, all scores and band boundaries, safety priority, answer edits, stale/repeated actions, restart, and share text.`);

// Validate actual text/control theme colors, including selected answer backgrounds.
const css = await readQuizSource(new URL('../src/styles/home-health-check.css', import.meta.url), 'utf8');
function luminance(hex) {
 const channels = [1,3,5].map(i=>parseInt(hex.slice(i,i+2),16)/255).map(c=>c<=.04045?c/12.92:((c+.055)/1.055)**2.4);
 return channels.reduce((sum,c,i)=>sum+c*[.2126,.7152,.0722][i],0);
}
for (const [name,scope] of [['light',css.slice(css.indexOf('.hhc-page {'),css.indexOf('.hhc-wrap'))],['dark',css.slice(css.indexOf('@media (prefers-color-scheme:dark)'))]]) {
 const palette=Object.fromEntries([...scope.matchAll(/--hhc-([a-z-]+):(#\w{6})/g)].map(m=>[m[1],m[2]]));
 for (const [fg,bg,min] of [['ink','bg',4.5],['muted','bg',4.5],['accent','card',4.5],['good','good-soft',4.5],['warn','warn-soft',4.5],['bad','bad-soft',4.5],['clay','clay-soft',4.5],['accent-ink','accent',4.5],['border','bg',3]]) {
  const values=[luminance(palette[fg]),luminance(palette[bg])].sort((a,b)=>a-b);
  assert.ok((values[1]+.05)/(values[0]+.05)>=min,`${name}: ${fg}/${bg} contrast below ${min}`);
 }
}
console.log('Light/dark text, selected tone labels, CTA, and answer borders pass contrast thresholds.');

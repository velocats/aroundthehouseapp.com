import { appStoreUrl } from '../data/site';
import { questions, tones, reactionFor, resultsFor, shareUrl, shareText, initialState, answerQuestion, nextQuestion, previousQuestion, changeAnswer } from '../data/homeHealthCheck';
import type { Tone } from '../data/homeHealthCheck';

const widget = document.querySelector<HTMLElement>('[data-health-check]');
if (widget) {
  const stage = widget.querySelector<HTMLElement>('[data-quiz-stage]')!;
  const status = widget.querySelector<HTMLElement>('[data-quiz-status]')!;
  let state = initialState();
  let generation = 0;
  // Holding Enter must not repeat an answer or navigation action on the replacement DOM.
  widget.addEventListener('keydown', event => { if (event.repeat && ['Enter', ' '].includes(event.key)) event.preventDefault(); });
  function node<K extends keyof HTMLElementTagNameMap>(tag: K, cls = '', text?: string): HTMLElementTagNameMap[K] {
    const element = document.createElement(tag); element.className = cls;
    if (text !== undefined) element.textContent = text;
    return element;
  }
  function link(text: string, href: string, cls = '') { const a = node('a', cls, text); a.href = href; return a; }
  function button(text: string, action: () => void, cls = 'hhc-btn', id?: string) {
    const b = node('button', cls, text); b.type = 'button'; if (id) b.id = id;
    const view = generation;
    b.addEventListener('click', event => { if (event.detail > 1 || view !== generation) return; action(); });
    return b;
  }
  function dot(tone: Tone) { const d = node('span', `hhc-dot ${tone}`); d.setAttribute('aria-hidden', 'true'); return d; }
  function tag(tone: Tone) { const t = node('span', 'hhc-tag'); t.append(dot(tone), tones[tone].label); return t; }
  function focusHeading(heading: HTMLElement) {
    heading.tabIndex = -1; heading.focus({ preventScroll: true });
    const top = heading.getBoundingClientRect().top;
    if (top < 100 || top > window.innerHeight - 80) heading.scrollIntoView({ block: 'center', behavior: 'instant' });
  }
  function renderQuestion(focus = false, afterAnswer = false) {
    generation++;
    const index = state.index, question = questions[index], picked = state.picks[index];
    widget!.dataset.question = String(index + 1); widget!.dataset.phase = 'question';
    const card = node('section', 'hhc-card'); card.setAttribute('aria-labelledby', 'hhc-question-title');
    const progress = node('div', 'hhc-progress'), row = node('div', 'hhc-progress-row');
    row.append(node('span', '', `Question ${index + 1} of 6`), node('span', '', question.short));
    const track = node('div', 'hhc-track'); track.setAttribute('aria-hidden', 'true');
    questions.forEach((q, i) => { const p = state.picks[i]; track.append(node('span', p === undefined ? (i === index ? 'now' : '') : q.choices[p].tone)); });
    progress.append(row, track);
    const heading = node('h2', '', question.question); heading.id = 'hhc-question-title';
    const answers = node('div', 'hhc-answers'); answers.setAttribute('role', 'group'); answers.setAttribute('aria-labelledby', heading.id);
    question.choices.forEach((choice, answer) => {
      const b = button('', () => {
        const updated = answerQuestion(state, index, answer); if (updated === state) return;
        state = updated; renderQuestion(false, true);
        status.textContent = `${tones[choice.tone].label}. ${reactionFor(index, answer)}`;
      }, `hhc-answer${picked !== undefined ? ` ${choice.tone}` : ''}${picked === answer ? ' picked' : ''}`, `hhc-q${index}a${answer}`);
      b.dataset.answer = String(answer); b.setAttribute('aria-pressed', String(picked === answer));
      b.append(node('span', '', choice.text));
      if (picked !== undefined) { b.disabled = true; b.append(tag(choice.tone)); }
      answers.append(b);
    });
    card.append(progress, heading, answers);
    if (picked !== undefined) {
      const tone = question.choices[picked].tone;
      const feedback = node('div', 'hhc-feedback'); feedback.setAttribute('aria-label', 'Answer feedback'); feedback.setAttribute('role', 'region');
      feedback.append(node('p', `hhc-reaction ${tone}`, reactionFor(index, picked)));
      const rule = node('div', 'hhc-rule'); rule.append(node('b', '', 'Rule of thumb'), node('span', '', question.rule));
      const why = node('div', 'hhc-why'); why.append(node('b', '', 'Why it matters'), node('p', '', question.why));
      if (question.source) why.append(link(`Source: ${question.source.name}`, question.source.url, 'hhc-source'));
      if (question.id === 'smoke' && picked === 3) why.append(node('p', 'hhc-immediate', 'Safety first: restore working smoke-alarm protection promptly. A chirp needs attention, not a missing alarm.'));
      feedback.append(rule, why); card.append(feedback);
    }
    const actions = node('div', 'hhc-actions');
    if (index > 0) actions.append(button('Back', () => { const updated = previousQuestion(state, index); if (updated === state) return; state = updated; status.textContent = ''; renderQuestion(true); }, 'hhc-btn ghost', 'hhc-back'));
    if (picked !== undefined) {
      actions.append(button('Change answer', () => { state = changeAnswer(state, index); status.textContent = ''; renderQuestion(true); }, 'hhc-btn ghost', 'hhc-change'));
      actions.append(button(index === 5 ? 'See my score' : 'Next question', () => {
        const updated = nextQuestion(state, index); if (updated === state) return; state = updated; status.textContent = '';
        if (state.phase === 'results') renderResults(); else renderQuestion(true);
      }, 'hhc-btn', 'hhc-next'));
    }
    if (actions.childElementCount) card.append(actions);
    stage.replaceChildren(card);
    if (afterAnswer) focusHeading(stage.querySelector<HTMLElement>('.hhc-feedback')!);
    else if (focus) focusHeading(heading);
    // Screen-reader users hear their place in the quiz when the question changes.
    if (focus) status.textContent = `Question ${index + 1} of 6: ${question.short}`;
  }
  function renderResults() {
    generation++; widget!.dataset.phase = 'results'; delete widget!.dataset.question;
    const result = resultsFor(state.picks);
    const card = node('section', 'hhc-card'); card.setAttribute('aria-labelledby', 'hhc-band');
    card.append(node('span', 'hhc-eyebrow', 'Your score'));
    const score = node('div', 'hhc-score'); score.append(node('span', 'hhc-num', String(result.score)), node('span', 'hhc-of', 'out of 12')); score.dataset.score = String(result.score); card.append(score);
    const lights = node('div', 'hhc-lights'); lights.setAttribute('aria-hidden', 'true'); result.entries.forEach(e => lights.append(dot(e.tone))); card.append(lights);
    card.append(node('p', 'hhc-counts', (['r', 'y', 'g'] as Tone[]).map(tone => `${result.entries.filter(e => e.tone === tone).length} ${tones[tone].label}`).join(' · ')));
    const band = node('h2', 'hhc-band', result.band.name); band.id = 'hhc-band';
    card.append(band, node('p', 'hhc-band-description', result.band.description));
    if (result.safety.length) {
      const safety = node('aside', 'hhc-safety'); safety.setAttribute('aria-labelledby', 'hhc-safety-title');
      const title = node('h3', '', 'Safety first, whatever your score'); title.id = 'hhc-safety-title'; safety.append(title);
      result.safety.forEach(entry => {
        const text = entry.question.id === 'smoke' ? (entry.answer === 3 ? 'Restore working smoke-alarm protection promptly. Check the instructions or ask a qualified installer for help.' : 'Put smoke-alarm testing and model-specific care first. Check that every alarm works and is within its service life.') : 'Give the dryer vent some attention. Clear the lint screen each load and arrange inspection or cleaning as the instructions and conditions require.';
        const p = node('p'); p.append(node('strong', '', `${entry.question.short}: `), text); safety.append(p);
      }); card.append(safety);
    }
    const nextWins = node('h3', 'hhc-next-wins', result.score === 12 ? 'Keep the streak going' : 'Your next small wins');
    card.append(nextWins, node('p', 'hhc-next-intro', result.score === 12 ? 'Keep the dates and details somewhere you can find them again.' : 'Pick one thing below to act on today. Keep the checklist handy for the rest.'));
    const list = node('ul', 'hhc-list'); list.setAttribute('aria-label', 'Your results, reds first');
    result.recommendations.forEach(entry => {
      const item = node('li', entry.tone); item.dataset.recommendation = entry.question.id; item.dataset.tone = entry.tone;
      const content = node('div'), title = node('div', 'hhc-item-title'); title.append(node('strong', '', entry.question.short), tag(entry.tone));
      content.append(title, node('p', 'hhc-picked', `Your answer: ${entry.question.choices[entry.answer].text}`), node('p', 'hhc-when', entry.question.rule));
      if (entry.tone !== 'g') content.append(node('p', 'hhc-tip', entry.question.tip));
      content.append(link('Read the guide →', entry.question.guide, 'hhc-guide')); item.append(dot(entry.tone), content); list.append(item);
    }); card.append(list);
    const cta = node('section', 'hhc-cta'); cta.setAttribute('aria-labelledby', 'hhc-cta-title');
    const ctaTitle = node('h3', '', 'Around The House remembers all of this for you.'); ctaTitle.id = 'hhc-cta-title';
    const store = link('', appStoreUrl, 'store-link'); store.dataset.downloadSource = 'quiz-results';
    const badge = node('img'); badge.src = '/assets/app-store-badge.svg'; badge.alt = 'Download on the App Store'; badge.width = 168; badge.height = 56; store.append(badge);
    cta.append(ctaTitle, node('p', '', 'Filter sizes, battery dates, install dates, and the pro you trust, kept with the thing they belong to. Reminders when it’s time. Private, on your iPhone, iPad, and Mac.'), store, link('Get the free annual checklist →', '/annual-home-maintenance-checklist/', 'hhc-alt'));
    const share = node('section', 'hhc-card hhc-share'); share.setAttribute('aria-label', 'Share and retake');
    share.append(node('b', '', 'Know someone who’d score lower? Send it to them.'));
    const label = node('label', 'hhc-share-label', 'Link to this quiz'); label.htmlFor = 'hhc-share-link';
    const input = node('input'); input.id = 'hhc-share-link'; input.value = shareUrl; input.readOnly = true;
    const shareStatus = node('p', 'hhc-status'); shareStatus.setAttribute('role', 'status'); shareStatus.setAttribute('aria-atomic', 'true');
    const text = shareText(result.score, result.band.name);
    const fallbackLabel = node('label', '', 'Your score and quiz link'); fallbackLabel.htmlFor = 'hhc-share-text';
    const fallbackText = node('textarea'); fallbackText.id = 'hhc-share-text'; fallbackText.value = text; fallbackText.readOnly = true; fallbackText.rows = 4;
    const fallback = node('div', 'hhc-share-fallback'); fallback.hidden = true; fallback.append(fallbackLabel, fallbackText);
    const row = node('div', 'hhc-share-row'); row.append(input);
    let sharing = false;
    const showFallback = () => { fallback.hidden = false; fallbackText.focus(); fallbackText.select(); shareStatus.textContent = 'Copy the selected score and link below. On your phone, touch and hold to copy.'; };
    const copy = button('Copy my score to share', async () => {
      if (sharing) return; sharing = true; copy.disabled = true;
      try { await navigator.clipboard.writeText(text); if (!share.isConnected) return; fallback.hidden = true; shareStatus.textContent = 'Copied. Paste it anywhere to challenge a friend.'; }
      catch { if (share.isConnected) showFallback(); }
      finally { sharing = false; copy.disabled = false; }
    }, 'hhc-btn ghost', 'hhc-copy'); row.append(copy);
    if (typeof navigator.share === 'function') {
      const native = button('Share my score', async () => {
        if (sharing) return; sharing = true; native.disabled = true;
        try { await navigator.share({ title: 'Home Health Check', text }); if (share.isConnected) shareStatus.textContent = 'Shared. Challenge accepted?'; }
        catch (error) { if (!share.isConnected) return; if (error instanceof DOMException && error.name === 'AbortError') shareStatus.textContent = 'Sharing canceled. Your score is still here.'; else showFallback(); }
        finally { sharing = false; native.disabled = false; }
      }, 'hhc-btn ghost', 'hhc-native-share'); row.append(native);
    }
    const actions = node('div', 'hhc-actions');
    actions.append(button('Review answers', () => { state = previousQuestion(state, 5); status.textContent = ''; renderQuestion(true); }, 'hhc-btn ghost', 'hhc-review'), button('Take it again', () => { state = initialState(); status.textContent = ''; renderQuestion(true); }, 'hhc-btn ghost', 'hhc-restart'));
    share.append(label, row, fallback, shareStatus, actions); stage.replaceChildren(card, cta, share); focusHeading(band);
    status.textContent = `Your score is ${result.score} out of 12: ${result.band.name}.`;
  }
  renderQuestion(); stage.hidden = false; widget.dataset.enhanced = 'true';
}

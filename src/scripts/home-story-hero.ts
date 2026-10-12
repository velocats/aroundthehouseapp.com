// The photos are finalized composites. JavaScript only controls scene visibility.
const hero = document.querySelector<HTMLElement>('[data-story-hero]');
if (hero) {
  const slides = [...hero.querySelectorAll<HTMLElement>('[data-story-slide]')];
  const buttons = [...hero.querySelectorAll<HTMLButtonElement>('[data-story-select]')];
  const captions = [...hero.querySelectorAll<HTMLElement>('[data-story-caption]')];
  const screens = [...hero.querySelectorAll<HTMLDetailsElement>('[data-story-screen]')];
  const play = hero.querySelector<HTMLButtonElement>('[data-story-play]')!;
  const count = hero.querySelector<HTMLElement>('[data-story-count]')!;
  const status = hero.querySelector<HTMLElement>('[data-story-announcement]')!;
  const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let index = 0;
  let requested = !motion.matches;
  let hovered = false;
  let focused = false;
  let timer: ReturnType<typeof setTimeout> | undefined;
  let pending = 0;

  function updatePlayback() {
    if (timer) clearTimeout(timer);
    timer = undefined;
    const playing = requested && !motion.matches && !hovered && !focused && !document.hidden;
    hero!.dataset.playing = String(playing);
    play.setAttribute('aria-label', requested && !motion.matches ? 'Pause the slideshow' : 'Play the slideshow');
    hero!.querySelector('[data-story-pause-icon]')!.toggleAttribute('hidden', !requested || motion.matches);
    hero!.querySelector('[data-story-play-icon]')!.toggleAttribute('hidden', requested && !motion.matches);
    // Reduced motion disables rotation even if play is pressed. Manual buttons remain available.
    play.disabled = motion.matches;
    if (playing) timer = setTimeout(() => void show((index + 1) % slides.length), 6000);
  }

  async function show(next: number, announce = false) {
    const request = ++pending;
    // Decode before fading so a deferred image never produces an empty scene.
    await slides[next].querySelector('img')?.decode().catch(() => {});
    if (request !== pending) return;
    index = next;
    slides.forEach((slide, i) => {
      slide.classList.toggle('is-active', i === next);
      slide.setAttribute('aria-hidden', String(i !== next));
      buttons[i].setAttribute('aria-pressed', String(i === next));
      captions[i].hidden = i !== next;
      screens[i].hidden = i !== next;
      if (i !== next) screens[i].open = false;
    });
    count.textContent = `${String(next + 1).padStart(2, '0')} / 03`;
    if (announce) status.textContent = `Scene ${next + 1} of 3. ${captions[next].textContent?.trim()}`;
    updatePlayback();
  }

  buttons.forEach((button, i) => button.addEventListener('click', () => {
    requested = false;
    updatePlayback();
    void show(i, true);
  }));
  play.addEventListener('click', () => {
    requested = !requested;
    status.textContent = requested ? 'Slideshow will play when you leave its controls.' : 'Slideshow paused.';
    updatePlayback();
  });
  hero.addEventListener('pointerenter', event => {
    if (event.pointerType === 'mouse') { hovered = true; updatePlayback(); }
  });
  hero.addEventListener('pointerleave', () => { hovered = false; updatePlayback(); });
  hero.addEventListener('focusin', () => { focused = true; updatePlayback(); });
  hero.addEventListener('focusout', event => {
    if (!hero.contains(event.relatedTarget as Node | null)) { focused = false; updatePlayback(); }
  });
  screens.forEach(screen => screen.addEventListener('toggle', () => {
    if (screen.open) { requested = false; updatePlayback(); }
  }));
  document.addEventListener('visibilitychange', updatePlayback);
  motion.addEventListener('change', () => { requested = false; updatePlayback(); });
  hero.querySelector<HTMLElement>('[data-story-controls]')!.hidden = false;
  hero.dataset.enhanced = 'true';
  updatePlayback();
}

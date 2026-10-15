const realmCopy = {
  ai: ['01', 'Intelligence, in motion', 'A living constellation of learning systems, neural patterns and ideas that keep evolving.'],
  cyber: ['02', 'The unseen frontier', 'Explore the architectures, signals and human ingenuity that shape a more resilient digital world.'],
  robotics: ['03', 'Matter with intent', 'Mechanisms, autonomy and imagination meet in forms made to move beyond the expected.'],
  ev: ['04', 'A new kind of momentum', 'Electric mobility redraws the map: quieter systems, cleaner motion and fresh ways to travel.'],
  drone: ['05', 'A different point of view', 'Flight, sensing and spatial intelligence open new perspectives on the world below.'],
  workshops: ['06', 'Make the next thing', 'A place for hands-on exploration, shared practice and the spark of learning by doing.']
};

export function setupInterface(experience) {
  const progressLine = document.querySelector('#progress-line');
  const scrollCue = document.querySelector('#scroll-cue');
  const chapterLinks = [...document.querySelectorAll('.chapter-link')];
  const chips = [...document.querySelectorAll('.realm-chip')];
  const detail = document.querySelector('#realm-detail');
  const detailIndex = document.querySelector('#detail-index');
  const detailTitle = document.querySelector('#detail-title');
  const detailCopy = document.querySelector('#detail-copy');
  const fallback = document.querySelector('#webgl-fallback');
  const motionButton = document.querySelector('#motion-toggle');
  let reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  document.documentElement.classList.toggle('reduced-motion', reduced);
  document.querySelector('.motion-label').textContent = reduced ? 'MOTION OFF' : 'MOTION ON';
  const sections = [...document.querySelectorAll('[data-chapter]')];
  let activeChapter = 'awakening';

  function showRealm(data) {
    const copy = realmCopy[data.id];
    if (!copy) return;
    chips.forEach(chip => {
      const active = chip.dataset.realm === data.id;
      chip.classList.toggle('selected', active);
      chip.setAttribute('aria-pressed', String(active));
    });
    detailIndex.textContent = copy[0];
    detailTitle.textContent = copy[1];
    detailCopy.textContent = copy[2];
    detail.classList.add('open');
    detail.setAttribute('aria-label', `${copy[1]} realm details`);
  }
  chips.forEach(chip => {
    chip.setAttribute('aria-pressed', 'false');
    chip.addEventListener('click', () => {
      experience.select(chip.dataset.realm);
      showRealm({ id: chip.dataset.realm });
    });
  });
  document.querySelector('#detail-close').addEventListener('click', () => {
    detail.classList.remove('open');
    chips.forEach(chip => { chip.classList.remove('selected'); chip.setAttribute('aria-pressed', 'false'); });
  });

  chapterLinks.forEach(link => {
    link.addEventListener('click', () => {
      document.getElementById(link.dataset.target)?.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' });
    });
  });
  const linkForChapter = new Map([['awakening', 'awakening'], ['passage', 'passage'], ['portal', 'passage'], ['realms', 'realms'], ['ambassador', 'realms'], ['departure', 'departure']]);
  const observer = new IntersectionObserver(entries => {
    const visible = entries.filter(e => e.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
    if (!visible) return;
    activeChapter = linkForChapter.get(visible.target.id) || 'awakening';
    chapterLinks.forEach(link => link.classList.toggle('active', link.dataset.target === activeChapter));
  }, { threshold: [0.15, 0.35, 0.6] });
  sections.forEach(section => observer.observe(section));

  const updateScroll = () => {
    const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    const progress = Math.max(0, Math.min(1, window.scrollY / max));
    progressLine.style.height = `${progress * 100}%`;
    scrollCue.style.opacity = progress > .025 ? '0' : '1';
    scrollCue.style.pointerEvents = progress > .025 ? 'none' : '';
    experience.update(progress, reduced);
  };
  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(() => { updateScroll(); ticking = false; });
    }
  }, { passive: true });
  window.addEventListener('resize', updateScroll, { passive: true });
  motionButton.addEventListener('click', () => {
    reduced = !reduced;
    document.documentElement.classList.toggle('reduced-motion', reduced);
    document.querySelector('.motion-label').textContent = reduced ? 'MOTION OFF' : 'MOTION ON';
    motionButton.setAttribute('aria-pressed', String(reduced));
    updateScroll();
  });
  const contextLoss = event => { event.preventDefault(); fallback.hidden = false; };
  experience.renderer?.domElement?.addEventListener('webglcontextlost', contextLoss);
  updateScroll();

  return {
    onSelect: showRealm,
    showFallback() { fallback.hidden = false; },
    dispose() { observer.disconnect(); window.removeEventListener('scroll', updateScroll); window.removeEventListener('resize', updateScroll); }
  };
}

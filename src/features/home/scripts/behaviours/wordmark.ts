// Move the hero wordmark into its fixed header position as the page scrolls.
export function initialiseWordmark() {
  const source = document.querySelector<HTMLElement>('.hero-wordmark');
  const wordmark = document.querySelector<HTMLElement>('.floating-wordmark');
  const header = document.querySelector<HTMLElement>('.nav');
  if (!source || !wordmark || !header) return;

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const scrollProgress = () => {
    const distance = Math.max(320, Math.min(window.innerHeight * 0.9, 900));
    return Math.min(1, Math.max(0, window.scrollY / distance));
  };
  let currentProgress = scrollProgress();
  let frame: number | null = null;
  let lastTime: number | null = null;

  const render = (progress: number) => {
    const rect = source.getBoundingClientRect();
    const eased = progress * progress * (3 - 2 * progress);
    const targetWidth = Math.min(150, window.innerWidth * 0.36);
    const targetLeft = (window.innerWidth - targetWidth) / 2;
    const targetTop = 3;
    const scale = 1 + (targetWidth / rect.width - 1) * eased;
    const left = rect.left + (targetLeft - rect.left) * eased;
    const sourceTop = rect.top + window.scrollY;
    const top = sourceTop + (targetTop - sourceTop) * eased;

    if (reducedMotion.matches) {
      wordmark.style.opacity = progress > 0.5 ? '1' : '0';
      source.style.visibility = 'visible';
      wordmark.style.transform = `translate3d(${targetLeft}px, ${targetTop}px, 0)`;
      wordmark.style.width = `${targetWidth}px`;
    } else {
      source.style.visibility = 'hidden';
      wordmark.style.opacity = '1';
      wordmark.style.width = `${rect.width}px`;
      wordmark.style.transform = `translate3d(${left}px, ${top}px, 0) scale(${scale})`;
    }
    wordmark.style.setProperty('--wordmark-opacity', String(0.58 + eased * 0.32));
    header.style.setProperty('--header-progress', String(eased));
  };

  const animate = (time: number) => {
    const target = scrollProgress();
    const elapsed = lastTime === null ? 16 : Math.min(time - lastTime, 64);
    lastTime = time;
    currentProgress += (target - currentProgress) * (1 - Math.exp(-elapsed / 120));
    if (reducedMotion.matches || Math.abs(target - currentProgress) < 0.001) {
      currentProgress = target;
    }
    render(currentProgress);
    if (currentProgress !== target) {
      frame = requestAnimationFrame(animate);
    } else {
      frame = null;
      lastTime = null;
    }
  };

  const requestUpdate = () => {
    if (frame === null) frame = requestAnimationFrame(animate);
  };
  window.addEventListener('scroll', requestUpdate, { passive: true });
  window.addEventListener('resize', requestUpdate);
  reducedMotion.addEventListener('change', requestUpdate);
  render(currentProgress);
}

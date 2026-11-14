// Move the hero wordmark into its fixed header position as the page scrolls.
export function initialiseWordmark() {
  const source = document.querySelector<HTMLElement>('.hero-wordmark');
  const wordmark = document.querySelector<HTMLElement>('.floating-wordmark');
  const header = document.querySelector<HTMLElement>('.nav');
  if (!source || !wordmark || !header) return;

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let scheduled = false;

  const update = () => {
    scheduled = false;
    const rect = source.getBoundingClientRect();
    const distance = Math.max(320, Math.min(window.innerHeight * 0.9, 900));
    const progress = Math.min(1, Math.max(0, window.scrollY / distance));
    const eased = progress * progress * (3 - 2 * progress);
    const targetWidth = Math.min(150, window.innerWidth * 0.36);
    const targetLeft = (window.innerWidth - targetWidth) / 2;
    const targetTop = 3;
    const width = rect.width + (targetWidth - rect.width) * eased;
    const left = rect.left + (targetLeft - rect.left) * eased;
    const top = Math.max(targetTop, rect.top + (targetTop - rect.top) * eased);

    if (reducedMotion.matches) {
      wordmark.style.opacity = progress > 0.5 ? '1' : '0';
      source.style.visibility = 'visible';
      wordmark.style.transform = `translate3d(${targetLeft}px, ${targetTop}px, 0)`;
      wordmark.style.width = `${targetWidth}px`;
    } else {
      source.style.visibility = 'hidden';
      wordmark.style.opacity = '1';
      wordmark.style.transform = `translate3d(${left}px, ${top}px, 0)`;
      wordmark.style.width = `${width}px`;
    }
    wordmark.style.setProperty('--wordmark-opacity', String(0.58 + eased * 0.32));
    header.style.setProperty('--header-progress', String(eased));
  };

  const requestUpdate = () => {
    if (!scheduled) {
      scheduled = true;
      requestAnimationFrame(update);
    }
  };
  window.addEventListener('scroll', requestUpdate, { passive: true });
  window.addEventListener('resize', requestUpdate);
  reducedMotion.addEventListener('change', requestUpdate);
  update();
}





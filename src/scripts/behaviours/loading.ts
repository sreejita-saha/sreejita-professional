/** Completes the optional page-intro state without delaying reduced-motion users. */
export function initialiseLoading() {
  const loader = document.querySelector<HTMLElement>('.loader');
  const site = document.querySelector<HTMLElement>('.site');
  const percent = document.querySelector<HTMLElement>('.percent');
  const line = document.querySelector<HTMLElement>('.loader-line i');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const finish = () => {
    loader?.classList.add('done');
    site?.classList.add('ready');
  };

  if (reducedMotion) {
    finish();
    return;
  }

  let progress = 0;
  const timer = window.setInterval(() => {
    progress += Math.max(1, Math.round((100 - progress) * 0.14));

    if (progress >= 100) {
      progress = 100;
      window.clearInterval(timer);
      window.setTimeout(finish, 280);
    }

    if (percent) percent.textContent = `${String(progress).padStart(2, '0')}%`;
    if (line) line.style.width = `${progress}%`;
  }, 35);

  window.addEventListener('load', () => window.setTimeout(finish, 900), { once: true });
}

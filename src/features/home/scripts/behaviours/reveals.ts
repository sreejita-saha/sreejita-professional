/** Reveals home-page editorial content once it enters the viewport. */
export function initialiseRevealEffects() {
  const revealElements = document.querySelectorAll<HTMLElement>('.reveal');
  if (!revealElements.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.12 },
  );

  revealElements.forEach((element, index) => {
    element.style.transitionDelay = `${Math.min(index % 4, 3) * 80}ms`;
    observer.observe(element);
  });
}

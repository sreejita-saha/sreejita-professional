// Home-page client behaviours.
import { initialiseLoading } from './behaviours/loading';
import { initialiseRevealEffects } from './behaviours/reveals';

initialiseLoading();
initialiseRevealEffects();

const sidebar = document.querySelector<HTMLElement>('[data-line-sidebar]');
const sidebarItems = [...document.querySelectorAll<HTMLElement>('[data-sidebar-item]')];
const sectionTargets = sidebarItems
  .map(item => item.querySelector<HTMLAnchorElement>('a')?.hash)
  .map(hash => hash ? document.querySelector<HTMLElement>(hash) : null);
let animationFrame = 0;
let pointerY = -1;

const updateSidebar = () => {
  animationFrame = 0;
  sidebarItems.forEach(item => {
    const center = item.getBoundingClientRect().top + item.offsetHeight / 2;
    const distance = pointerY < 0 ? Infinity : Math.abs(pointerY - center);
    const proximity = Math.max(0, 1 - distance / 100);
    item.style.setProperty('--effect', (proximity * proximity * (3 - 2 * proximity)).toFixed(4));
  });
};

sidebar?.addEventListener('pointermove', event => { pointerY = event.clientY; if (!animationFrame) animationFrame = requestAnimationFrame(updateSidebar); });
sidebar?.addEventListener('pointerleave', () => { pointerY = -1; if (!animationFrame) animationFrame = requestAnimationFrame(updateSidebar); });

const updateActiveSection = () => {
  const readingLine = window.scrollY + window.innerHeight * .38;
  let activeIndex = 0;
  sectionTargets.forEach((section, index) => {
    if (section && section.getBoundingClientRect().top + window.scrollY <= readingLine) activeIndex = index;
  });
  sidebarItems.forEach((item, index) => {
    const isActive = index === activeIndex;
    item.setAttribute('aria-current', isActive ? 'true' : 'false');
    item.classList.toggle('is-active', isActive);
  });
};

sidebarItems.forEach((item, index) => {
  item.addEventListener('click', () => {
    sidebarItems.forEach((other, otherIndex) => {
      const isActive = otherIndex === index;
      other.setAttribute('aria-current', isActive ? 'true' : 'false');
      other.classList.toggle('is-active', isActive);
    });
  });
});

let scrollFrame = 0;
const scheduleActiveUpdate = () => { if (!scrollFrame) scrollFrame = requestAnimationFrame(() => { scrollFrame = 0; updateActiveSection(); }); };
window.addEventListener('scroll', scheduleActiveUpdate, { passive: true });
window.addEventListener('resize', scheduleActiveUpdate);
updateActiveSection();

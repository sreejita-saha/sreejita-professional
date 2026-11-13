const loader = document.querySelector<HTMLElement>(".loader");
const site = document.querySelector<HTMLElement>(".site");
const percent = document.querySelector<HTMLElement>(".percent");
const line = document.querySelector<HTMLElement>(".loader-line i");
const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function finish() {
  loader?.classList.add("done");
  site?.classList.add("ready");
}
if (reduced) finish();
else {
  let progress = 0;
  const timer = window.setInterval(() => {
    progress += Math.max(1, Math.round((100 - progress) * 0.14));
    if (progress >= 100) {
      progress = 100;
      window.clearInterval(timer);
      window.setTimeout(finish, 280);
    }
    if (percent) percent.textContent = `${String(progress).padStart(2, "0")}%`;
    if (line) line.style.width = `${progress}%`;
  }, 35);
  window.addEventListener("load", () => window.setTimeout(finish, 900), {
    once: true,
  });
}

const observer = new IntersectionObserver(
  (entries) =>
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    }),
  { threshold: 0.12 },
);
document.querySelectorAll<HTMLElement>(".reveal").forEach((element, index) => {
  element.style.transitionDelay = `${Math.min(index % 4, 3) * 80}ms`;
  observer.observe(element);
});
const bar = document.querySelector<HTMLElement>(".progress i");
function updateProgress() {
  const max = document.documentElement.scrollHeight - innerHeight;
  if (bar && max > 0)
    bar.style.setProperty("--scroll-progress", String(scrollY / max));
}
addEventListener("scroll", updateProgress, { passive: true });
updateProgress();
